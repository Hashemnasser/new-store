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
// 🛒 إنشاء طلب جديد
// ============================================================
async function createOrder(userId, data) {
    // ============================================================
    // 1. جلب السلة
    // ============================================================
    const cart = await (0, cart_service_1.getCart)(userId);
    if (!cart || cart.items.length === 0) {
        throw (0, app_error_1.createError)("BAD_REQUEST", "Cart is empty");
    }
    // ============================================================
    // 2. التحقق من العناصر وحساب الإجمالي (مرة واحدة فقط)
    // ============================================================
    let subtotal = new library_1.Decimal(0);
    const orderItemsData = [];
    for (const item of cart.items) {
        // ✅ تحقق شامل (variant + variantId + stock)
        if (!item.variant || !item.variantId) {
            throw (0, app_error_1.createError)("BAD_REQUEST", "Variant not found for cart item");
        }
        if (item.variant.stock < item.quantity) {
            throw (0, app_error_1.createError)("BAD_REQUEST", `Insufficient stock for variant: ${item.variant.sku}`);
        }
        const price = new library_1.Decimal(item.variant.price);
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
        // ✅ حماية من المبالغ السالبة
        if (finalAmount.isNegative()) {
            finalAmount = new library_1.Decimal(0);
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
    const order = await prisma_1.prisma.$transaction(async (tx) => {
        // 5.1 إنشاء الطلب
        const newOrder = await tx.order.create({
            data: {
                userId,
                totalAmount: finalAmount,
                subtotal,
                discountAmount,
                couponId: coupon?.id ?? null,
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
        // 5.2 خصم المخزون (✅ مع return صحيح)
        await Promise.all(orderItemsData.map((item) => tx.productVariant.update({
            where: { id: item.variantId },
            data: { stock: { decrement: item.quantity } },
        })));
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
            // ✅ Rollback: إعادة المخزون وإلغاء الطلب
            await prisma_1.prisma.$transaction(async (tx) => {
                await Promise.all(orderItemsData.map((item) => tx.productVariant.update({
                    where: { id: item.variantId },
                    data: { stock: { increment: item.quantity } },
                })));
                await tx.order.update({
                    where: { id: order.id },
                    data: { status: enums_1.OrderStatus.CANCELLED },
                });
            });
            throw (0, app_error_1.createError)("PAYMENT_FAILED", "فشل إنشاء عملية الدفع. تم إلغاء الطلب وإعادة المخزون.");
        }
    }
    // ============================================================
    // 7. إرسال الإيميلات (للدفع عند الاستلام فقط)
    // ============================================================
    if (isCashPayment) {
        // ✅ لا ننتظر الإيميل (لا نعطل الاستجابة)
        sendOrderEmails(order, userId).catch((err) => console.error("❌ Failed to send order emails:", err));
    }
    // ============================================================
    // 8. النتيجة النهائية
    // ============================================================
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
