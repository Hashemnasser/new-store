"use strict";
// src/services/order.service.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.createOrder = createOrder;
exports.getUserOrders = getUserOrders;
exports.getOrderById = getOrderById;
exports.getAllOrders = getAllOrders;
exports.updateOrderStatus = updateOrderStatus;
exports.deleteOrder = deleteOrder;
const enums_1 = require("../generated/prisma/enums.js");
const library_1 = require("@prisma/client/runtime/library");
const app_error_1 = require("../errors/app-error");
const prisma_1 = require("../lib/prisma");
const payment_service_1 = require("../payments/payment.service");
const email_1 = require("../utils/email");
const email_templates_1 = require("../utils/email.templates");
const cart_service_1 = require("./cart.service");
const coupon_service_1 = require("./coupon.service");
// ============================================================
// 🛒 إنشاء طلب جديد (مع دعم بوابات الدفع المتعددة)
// ============================================================
async function createOrder(userId, data) {
    // 1. جلب السلة
    const cart = await (0, cart_service_1.getCart)(userId);
    if (!cart || cart.items.length === 0) {
        throw (0, app_error_1.createError)("BAD_REQUEST", "Cart is empty");
    }
    // 2. حساب الإجمالي الأصلي (بدون خصم)
    let subtotal = new library_1.Decimal(0);
    const orderItemsData = [];
    for (const item of cart.items) {
        if (!item.variant) {
            throw (0, app_error_1.createError)("BAD_REQUEST", "Variant not found for cart item");
        }
        if (item.variant.stock < item.quantity) {
            throw (0, app_error_1.createError)("BAD_REQUEST", `Insufficient stock for variant: ${item.variant.sku}`);
        }
        const price = new library_1.Decimal(item.variant.price);
        const itemTotal = price.mul(item.quantity);
        subtotal = subtotal.add(itemTotal);
        orderItemsData.push({
            variantId: item.variantId,
            quantity: item.quantity,
            price: price,
        });
    }
    // 3. معالجة الكوبون (إن وجد)
    let coupon = null;
    let discountAmount = new library_1.Decimal(0);
    let finalAmount = subtotal;
    if (data.couponCode) {
        coupon = await (0, coupon_service_1.validateCoupon)(data.couponCode, subtotal);
        if (!coupon) {
            throw (0, app_error_1.createError)("BAD_REQUEST", "Invalid or expired coupon code");
        }
        discountAmount = (0, coupon_service_1.calculateDiscount)(subtotal, coupon);
        finalAmount = subtotal.minus(discountAmount);
        if (finalAmount.isNegative()) {
            finalAmount = new library_1.Decimal(0);
        }
    }
    // 4. تحديد بوابة الدفع بناءً على طريقة الدفع
    const isCashPayment = data.paymentMethod === "CASH";
    const gateway = isCashPayment ? null : "stripe";
    // 5. إنشاء الطلب في قاعدة البيانات (بحالة PENDING دائماً)
    const order = await prisma_1.prisma.$transaction(async (tx) => {
        const newOrder = await tx.order.create({
            data: {
                userId,
                totalAmount: finalAmount,
                subtotal: subtotal,
                discountAmount: discountAmount,
                couponId: coupon?.id || null,
                shippingAddress: data.shippingAddress,
                status: enums_1.OrderStatus.PENDING,
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
                where: { id: item.variantId },
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
    let paymentResult = null;
    if (!isCashPayment && gateway) {
        try {
            const result = await payment_service_1.paymentService.createPayment({
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
        }
        catch (error) {
            // ✅ في حال فشل إنشاء عملية الدفع، نعيد المخزون ونلغي الطلب
            await prisma_1.prisma.$transaction(async (tx) => {
                for (const item of cart.items) {
                    await tx.productVariant.update({
                        where: { id: item.variantId },
                        data: { stock: { increment: item.quantity } },
                    });
                }
                await tx.order.update({
                    where: { id: order.id },
                    data: { status: enums_1.OrderStatus.CANCELLED },
                });
            });
            throw (0, app_error_1.createError)("PAYMENT_FAILED", "فشل إنشاء عملية الدفع. تم إلغاء الطلب وإعادة المخزون.");
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
async function sendOrderEmails(order, userId) {
    const user = await prisma_1.prisma.user.findUnique({
        where: { id: userId },
        select: { name: true, email: true },
    });
    if (!user)
        return;
    (0, email_1.sendEmail)({
        to: user.email,
        subject: `✅ تم تأكيد طلبك #${order.id.slice(0, 8)} - ProStore`,
        html: (0, email_templates_1.getOrderConfirmationTemplate)(order, user),
    }).catch((error) => console.error("❌ Failed to send user confirmation email:", error));
    const admin = await prisma_1.prisma.user.findFirst({
        where: { role: "ADMIN" },
        select: { email: true },
    });
    if (admin) {
        (0, email_1.sendEmail)({
            to: admin.email,
            subject: `🛒 طلب جديد #${order.id.slice(0, 8)} - ProStore`,
            html: (0, email_templates_1.getAdminOrderNotificationTemplate)(order, user),
        }).catch((error) => console.error("❌ Failed to send admin notification email:", error));
    }
}
// ============================================================
// 👤 دوال المستخدم
// ============================================================
async function getUserOrders(userId) {
    const orders = await prisma_1.prisma.order.findMany({
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
async function getOrderById(orderId, userId) {
    const order = await prisma_1.prisma.order.findFirst({
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
        throw (0, app_error_1.createError)("NOT_FOUND", "Order not found");
    }
    return order;
}
// ============================================================
// 🔐 دوال المدير (Admin)
// ============================================================
async function getAllOrders() {
    const orders = await prisma_1.prisma.order.findMany({
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
async function updateOrderStatus(orderId, status) {
    const order = await prisma_1.prisma.order.findUnique({
        where: { id: orderId },
    });
    if (!order) {
        throw (0, app_error_1.createError)("NOT_FOUND", "Order not found");
    }
    if (status === enums_1.OrderStatus.CANCELLED &&
        order.status !== enums_1.OrderStatus.CANCELLED) {
        await prisma_1.prisma.$transaction(async (tx) => {
            await tx.order.update({
                where: { id: orderId },
                data: { status: enums_1.OrderStatus.CANCELLED },
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
    const updatedOrder = await prisma_1.prisma.order.update({
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
async function deleteOrder(orderId) {
    const order = await prisma_1.prisma.order.findUnique({
        where: { id: orderId },
    });
    if (!order) {
        throw (0, app_error_1.createError)("NOT_FOUND", "Order not found");
    }
    await prisma_1.prisma.order.delete({
        where: { id: orderId },
    });
    return { message: "Order deleted successfully" };
}
