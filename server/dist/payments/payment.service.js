"use strict";
// server/src/payments/payment.service.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.paymentService = void 0;
const enums_1 = require("../generated/prisma/enums.js");
const email_1 = require("../utils/email.js");
const email_templates_1 = require("../utils/email.templates.js");
const prisma_1 = require("../lib/prisma");
const payment_provider_factory_1 = require("./payment-provider.factory");
// ============================================================
// 🧩 خدمة الدفع الموحدة (لا تعرف أي بوابة بعينها)
// ============================================================
exports.paymentService = {
    /**
     * إنشاء عملية دفع باستخدام البوابة المحددة
     */
    async createPayment(params) {
        const provider = payment_provider_factory_1.paymentProviderFactory.get(params.gateway);
        const result = await provider.createPayment({
            amount: params.amount,
            currency: params.currency,
            orderId: params.orderId,
        });
        // ✅ حفظ معرف الدفع في الطلب
        await prisma_1.prisma.order.update({
            where: { id: params.orderId },
            data: { stripePaymentIntentId: result.paymentId },
        });
        return result;
    },
    /**
     * التحقق من حالة دفع
     */
    async verifyPayment(gateway, paymentId) {
        const provider = payment_provider_factory_1.paymentProviderFactory.get(gateway);
        return provider.verifyPayment(paymentId);
    },
    /**
     * استرداد مبلغ
     */
    async refund(gateway, paymentId, amount) {
        const provider = payment_provider_factory_1.paymentProviderFactory.get(gateway);
        return provider.refund({ paymentId, amount });
    },
    /**
     * معالجة Webhook (موحدة لكل البوابات)
     */
    async handleWebhook(gateway, payload, signature) {
        const provider = payment_provider_factory_1.paymentProviderFactory.get(gateway);
        const event = provider.verifyWebhookSignature(payload, signature);
        if (!event.orderId) {
            console.warn(`⚠️ Webhook event without orderId: ${event.type}`);
            return { received: true };
        }
        switch (event.status) {
            case "SUCCEEDED": {
                // ✅ تحديث حالة الطلب
                const updatedOrder = await prisma_1.prisma.order.update({
                    where: { id: event.orderId },
                    data: { status: enums_1.OrderStatus.PROCESSING },
                    include: {
                        items: {
                            include: {
                                variant: { include: { product: true } },
                            },
                        },
                    },
                });
                // ✅ تفريغ السلة الآن بعد نجاح الدفع
                const cart = await prisma_1.prisma.cart.findUnique({
                    where: { userId: updatedOrder.userId },
                });
                if (cart) {
                    await prisma_1.prisma.cartItem.deleteMany({
                        where: { cartId: cart.id },
                    });
                    console.log(`🛒 Cart cleared for user ${updatedOrder.userId}`);
                }
                // ✅ إرسال الإيميلات
                const user = await prisma_1.prisma.user.findUnique({
                    where: { id: updatedOrder.userId },
                    select: { name: true, email: true },
                });
                if (user) {
                    (0, email_1.sendEmail)({
                        to: user.email,
                        subject: `✅ تم تأكيد طلبك #${updatedOrder.id.slice(0, 8)} - ProStore`,
                        html: (0, email_templates_1.getOrderConfirmationTemplate)(updatedOrder, user),
                    }).catch(console.error);
                    const admin = await prisma_1.prisma.user.findFirst({
                        where: { role: "ADMIN" },
                        select: { email: true },
                    });
                    if (admin) {
                        (0, email_1.sendEmail)({
                            to: admin.email,
                            subject: `🛒 طلب جديد #${updatedOrder.id.slice(0, 8)} - ProStore`,
                            html: (0, email_templates_1.getAdminOrderNotificationTemplate)(updatedOrder, user),
                        }).catch(console.error);
                    }
                }
                console.log(`✅ Order #${event.orderId} paid successfully.`);
                break;
            }
            case "FAILED":
            case "CANCELLED": {
                // ✅ الدفع فشل: إعادة المخزون وإلغاء الطلب
                await prisma_1.prisma.$transaction(async (tx) => {
                    const orderItems = await tx.orderItem.findMany({
                        where: { orderId: event.orderId },
                        include: { variant: true },
                    });
                    for (const item of orderItems) {
                        await tx.productVariant.update({
                            where: { id: item.variantId },
                            data: { stock: { increment: item.quantity } },
                        });
                    }
                    await tx.order.update({
                        where: { id: event.orderId },
                        data: { status: enums_1.OrderStatus.CANCELLED },
                    });
                });
                console.error(`❌ Order #${event.orderId} payment failed. Stock restored.`);
                break;
            }
            case "REFUNDED": {
                await prisma_1.prisma.order.update({
                    where: { id: event.orderId },
                    data: { status: enums_1.OrderStatus.CANCELLED },
                });
                break;
            }
            default:
                console.log(`ℹ️ Unhandled webhook status: ${event.status}`);
        }
        return { received: true };
    },
    /**
     * الحصول على قائمة البوابات المتاحة (للواجهة الأمامية)
     */
    getAvailableGateways() {
        return payment_provider_factory_1.paymentProviderFactory.getEnabledNames();
    },
};
