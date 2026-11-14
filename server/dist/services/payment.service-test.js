"use strict";
// // src/services/payment.service.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.paymentService = void 0;
const stripe_provider_1 = require("../payments/providers/stripe.provider");
const stripeProvider = new stripe_provider_1.StripeProvider();
exports.paymentService = {
    /**
     * إنشاء PaymentIntent حقيقي في Stripe
     * @returns clientSecret + paymentId
     */
    createPaymentIntent: async (params) => {
        if (!stripeProvider.isEnabled()) {
            throw new Error("Stripe is not configured");
        }
        const result = await stripeProvider.createPayment({
            amount: params.amount.toNumber(),
            currency: params.currency,
            orderId: params.orderId,
            metadata: {
                userId: params.userId,
            },
        });
        if (!result.success || !result.clientSecret) {
            throw new Error("Failed to create payment intent");
        }
        return {
            clientSecret: result.clientSecret,
            paymentId: result.paymentId,
        };
    },
    /**
     * استرداد المبلغ
     */
    refund: async (paymentId, amount) => {
        return stripeProvider.refund({ paymentId, amount });
    },
};
