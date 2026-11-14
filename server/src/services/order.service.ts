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

// ============================================================
// 🛒 إنشاء طلب جديد (مع دعم بوابات الدفع المتعددة)
// ============================================================

// ============================================================
// 🧩 أنواع مساعدة
// ============================================================
type OrderItemData = {
  variantId: string;
  quantity: number;
  price: Decimal;
};

// ============================================================
// 🛒 إنشاء طلب جديد
// ============================================================
export async function createOrder(userId: string, data: CreateOrderInput) {
  // ============================================================
  // 1. جلب السلة
  // ============================================================
  const cart = await getCart(userId);
  if (!cart || cart.items.length === 0) {
    throw createError("BAD_REQUEST", "Cart is empty");
  }

  // ============================================================
  // 2. التحقق من العناصر وحساب الإجمالي (مرة واحدة فقط)
  // ============================================================
  let subtotal = new Decimal(0);
  const orderItemsData: OrderItemData[] = [];

  for (const item of cart.items) {
    // ✅ تحقق شامل (variant + variantId + stock)
    if (!item.variant || !item.variantId) {
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

    // ✅ TypeScript بتعرف الآن إن variantId = string (بدون !)
    orderItemsData.push({
      variantId: item.variantId,
      quantity: item.quantity,
      price,
    });
  }

  // ============================================================
  // 3. معالجة الكوبون (إن وجد)
  // ============================================================
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

    // ✅ حماية من المبالغ السالبة
    if (finalAmount.isNegative()) {
      finalAmount = new Decimal(0);
    }
  }

  // ============================================================
  // 4. تحديد بوابة الدفع
  // ============================================================
  const isCashPayment = data.paymentMethod === "CASH";
  const gateway = isCashPayment ? null : "stripe";

  // ============================================================
  // 5. إنشاء الطلب + خصم المخزون (في transaction)
  // ============================================================
  const order = await prisma.$transaction(async (tx) => {
    // 5.1 إنشاء الطلب
    const newOrder = await tx.order.create({
      data: {
        userId,
        totalAmount: finalAmount,
        subtotal,
        discountAmount,
        couponId: coupon?.id ?? null,
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

    // 5.2 خصم المخزون (✅ مع return صحيح)
    await Promise.all(
      orderItemsData.map((item) =>
        tx.productVariant.update({
          where: { id: item.variantId },
          data: { stock: { decrement: item.quantity } },
        })
      )
    );

    // 5.3 تفريغ السلة (للدفع عند الاستلام فقط)
    // للدفع الإلكتروني: سيتم التفريغ في الـ Webhook بعد نجاح الدفع
    if (isCashPayment) {
      await tx.cartItem.deleteMany({
        where: { cartId: cart.id },
      });
    }

    // 5.4 تحديث عداد الكوبون
    if (coupon) {
      await tx.coupon.update({
        where: { id: coupon.id },
        data: { usedCount: { increment: 1 } },
      });
    }

    return newOrder;
  });

  // ============================================================
  // 6. إنشاء عملية الدفع (للدفع الإلكتروني)
  // ============================================================
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
      // ✅ Rollback: إعادة المخزون وإلغاء الطلب
      await prisma.$transaction(async (tx) => {
        await Promise.all(
          orderItemsData.map((item) =>
            tx.productVariant.update({
              where: { id: item.variantId },
              data: { stock: { increment: item.quantity } },
            })
          )
        );

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

  // ============================================================
  // 7. إرسال الإيميلات (للدفع عند الاستلام فقط)
  // ============================================================
  if (isCashPayment) {
    // ✅ لا ننتظر الإيميل (لا نعطل الاستجابة)
    sendOrderEmails(order, userId).catch((err) =>
      console.error("❌ Failed to send order emails:", err)
    );
  }

  // ============================================================
  // 8. النتيجة النهائية
  // ============================================================
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
