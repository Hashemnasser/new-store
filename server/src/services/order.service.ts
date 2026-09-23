// src/services/order.service.ts

import { Coupon } from "@/generated/prisma/client";
import { OrderStatus } from "@/generated/prisma/enums";
import { Decimal } from "@prisma/client/runtime/library";
import { createError } from "../errors/app-error";
import { prisma } from "../lib/prisma";
import { paymentService } from "../payments/payment.service";
import { sendEmail } from "../utils/email";
import {
  getAdminOrderNotificationTemplate,
  getOrderConfirmationTemplate,
} from "../utils/email.templates";
import type { CreateOrderInput } from "../validators/order.validator";
import { getCart } from "./cart.service";
import { calculateDiscount, validateCoupon } from "./coupon.service";

type OrderItemData = {
  variantId: string;
  quantity: number;
  price: Decimal;
};

// ============================================================
// 🛒 إنشاء طلب جديد (مع دعم بوابات الدفع المتعددة)
// ============================================================

export async function createOrder(userId: string, data: CreateOrderInput) {
  // 1. جلب السلة
  const cart = await getCart(userId);

  if (!cart || cart.items.length === 0) {
    throw createError("BAD_REQUEST", "Cart is empty");
  }

  // 2. حساب الإجمالي الأصلي (بدون خصم)
  let subtotal = new Decimal(0);
  const orderItemsData: OrderItemData[] = [];

  for (const item of cart.items) {
    if (!item.variant) {
      throw createError("BAD_REQUEST", "Variant not found for cart item");
    }
    if (item.variant.stock < item.quantity) {
      throw createError(
        "BAD_REQUEST",
        `Insufficient stock for variant: ${item.variant.sku}`
      );
    }
    const price = new Decimal(item.variant.price);
    const itemTotal = price.mul(item.quantity);
    subtotal = subtotal.add(itemTotal);

    orderItemsData.push({
      variantId: item.variantId!,
      quantity: item.quantity,
      price: price,
    });
  }

  // 3. معالجة الكوبون (إن وجد)
  let coupon: Coupon | null = null;
  let discountAmount = new Decimal(0);
  let finalAmount = subtotal;

  if (data.couponCode) {
    coupon = await validateCoupon(data.couponCode, subtotal);
    if (!coupon) {
      throw createError("BAD_REQUEST", "Invalid or expired coupon code");
    }

    discountAmount = calculateDiscount(subtotal, coupon);
    finalAmount = subtotal.minus(discountAmount);

    if (finalAmount.isNegative()) {
      finalAmount = new Decimal(0);
    }
  }

  // 4. تحديد بوابة الدفع بناءً على طريقة الدفع
  const isCashPayment = data.paymentMethod === "CASH";
  const gateway = isCashPayment ? null : "stripe";

  // 5. إنشاء الطلب في قاعدة البيانات (بحالة PENDING دائماً)
  const order = await prisma.$transaction(async (tx) => {
    const newOrder = await tx.order.create({
      data: {
        userId,
        totalAmount: finalAmount,
        subtotal: subtotal,
        discountAmount: discountAmount,
        couponId: coupon?.id || null,
        shippingAddress: data.shippingAddress,
        status: OrderStatus.PENDING,
        items: {
          create: orderItemsData,
        },
      },
      include: {
        items: {
          include: {
            variant: { include: { product: true } },
          },
        },
      },
    });

    // ✅ خصم المخزون (سيُعاد تلقائياً إذا فشل الدفع عبر الـ Webhook)
    for (const item of cart.items) {
      await tx.productVariant.update({
        where: { id: item.variantId! },
        data: { stock: { decrement: item.quantity } },
      });
    }

    // ✅ تفريغ السلة فقط عند الدفع عند الاستلام
    // في حالة الدفع الإلكتروني: سيتم التفريغ في الـ Webhook بعد نجاح الدفع
    if (isCashPayment) {
      await tx.cartItem.deleteMany({
        where: { cartId: cart.id },
      });
    }

    // تحديث عدد استخدامات الكوبون
    if (coupon) {
      await tx.coupon.update({
        where: { id: coupon.id },
        data: { usedCount: { increment: 1 } },
      });
    }

    return newOrder;
  });

  // 6. إنشاء عملية دفع (إن لزم الأمر)
  let paymentResult: {
    clientSecret?: string;
    redirectUrl?: string;
    qrCode?: string;
  } | null = null;

  if (!isCashPayment && gateway) {
    try {
      const result = await paymentService.createPayment({
        gateway,
        amount: Number(finalAmount),
        currency: "usd",
        orderId: order.id,
      });

      paymentResult = {
        clientSecret: result.clientSecret,
        redirectUrl: result.redirectUrl,
        qrCode: result.qrCode,
      };
    } catch (error) {
      // ✅ في حال فشل إنشاء عملية الدفع، نعيد المخزون ونلغي الطلب
      await prisma.$transaction(async (tx) => {
        for (const item of cart.items) {
          await tx.productVariant.update({
            where: { id: item.variantId! },
            data: { stock: { increment: item.quantity } },
          });
        }
        await tx.order.update({
          where: { id: order.id },
          data: { status: OrderStatus.CANCELLED },
        });
      });

      throw createError(
        "PAYMENT_FAILED",
        "فشل إنشاء عملية الدفع. تم إلغاء الطلب وإعادة المخزون."
      );
    }
  }

  // 7. إرسال الإيميلات
  if (isCashPayment) {
    await sendOrderEmails(order, userId);
  }

  return { order, paymentResult };
}

// ============================================================
// 📧 دالة مساعدة لإرسال إيميلات الطلب
// ============================================================

async function sendOrderEmails(order: any, userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { name: true, email: true },
  });

  if (!user) return;

  sendEmail({
    to: user.email,
    subject: `✅ تم تأكيد طلبك #${order.id.slice(0, 8)} - ProStore`,
    html: getOrderConfirmationTemplate(order, user),
  }).catch((error) =>
    console.error("❌ Failed to send user confirmation email:", error)
  );

  const admin = await prisma.user.findFirst({
    where: { role: "ADMIN" },
    select: { email: true },
  });

  if (admin) {
    sendEmail({
      to: admin.email,
      subject: `🛒 طلب جديد #${order.id.slice(0, 8)} - ProStore`,
      html: getAdminOrderNotificationTemplate(order, user),
    }).catch((error) =>
      console.error("❌ Failed to send admin notification email:", error)
    );
  }
}

// ============================================================
// 👤 دوال المستخدم
// ============================================================

export async function getUserOrders(userId: string) {
  const orders = await prisma.order.findMany({
    where: { userId },
    include: {
      items: {
        include: {
          variant: {
            include: {
              product: {
                include: {
                  images: true,
                },
              },
            },
          },
        },
      },
      coupon: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return orders;
}

export async function getOrderById(orderId: string, userId: string) {
  const order = await prisma.order.findFirst({
    where: {
      id: orderId,
      userId,
    },
    include: {
      items: {
        include: {
          variant: {
            include: {
              product: { include: { images: true } },
            },
          },
        },
      },
      coupon: true,
    },
  });

  if (!order) {
    throw createError("NOT_FOUND", "Order not found");
  }

  return order;
}

// ============================================================
// 🔐 دوال المدير (Admin)
// ============================================================

export async function getAllOrders() {
  const orders = await prisma.order.findMany({
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      items: {
        include: {
          variant: {
            include: {
              product: true,
            },
          },
        },
      },
      coupon: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  return orders;
}

export async function updateOrderStatus(orderId: string, status: OrderStatus) {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
  });

  if (!order) {
    throw createError("NOT_FOUND", "Order not found");
  }

  if (
    status === OrderStatus.CANCELLED &&
    order.status !== OrderStatus.CANCELLED
  ) {
    await prisma.$transaction(async (tx) => {
      await tx.order.update({
        where: { id: orderId },
        data: { status: OrderStatus.CANCELLED },
      });

      const orderItems = await tx.orderItem.findMany({
        where: { orderId },
        include: { variant: true },
      });

      for (const item of orderItems) {
        await tx.productVariant.update({
          where: { id: item.variantId },
          data: {
            stock: {
              increment: item.quantity,
            },
          },
        });
      }
    });

    return { message: "Order cancelled and stock restored" };
  }

  const updatedOrder = await prisma.order.update({
    where: { id: orderId },
    data: { status },
    include: {
      items: {
        include: {
          variant: {
            include: {
              product: true,
            },
          },
        },
      },
    },
  });

  return updatedOrder;
}

export async function deleteOrder(orderId: string) {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
  });

  if (!order) {
    throw createError("NOT_FOUND", "Order not found");
  }

  await prisma.order.delete({
    where: { id: orderId },
  });
  return { message: "Order deleted successfully" };
}
