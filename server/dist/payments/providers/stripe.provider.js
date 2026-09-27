"use strict";
// server/src/payments/providers/stripe.provider.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StripeProvider = void 0;
const stripe_1 = __importDefault(require("stripe"));
const app_error_1 = require("../../errors/app-error");
class StripeProvider {
    name = "stripe";
    stripe = null;
    isEnabled() {
        return !!process.env.STRIPE_SECRET_KEY;
    }
    // ✅ دالة مساعدة لإنشاء Stripe عند الحاجة فقط
    getStripe() {
        if (this.stripe)
            return this.stripe;
        const key = process.env.STRIPE_SECRET_KEY;
        if (!key) {
            throw (0, app_error_1.createError)("INTERNAL_SERVER_ERROR", "STRIPE_SECRET_KEY not configured");
        }
        this.stripe = new stripe_1.default(key, {
            apiVersion: "2026-08-26.dahlia",
        });
        return this.stripe;
    }
    async createPayment(params) {
        try {
            const stripe = this.getStripe();
            const paymentIntent = await stripe.paymentIntents.create({
                amount: Math.round(params.amount * 100),
                currency: params.currency.toLowerCase(),
                metadata: {
                    orderId: params.orderId,
                    ...params.metadata,
                },
                automatic_payment_methods: {
                    enabled: true,
                },
            });
            return {
                success: true,
                paymentId: paymentIntent.id,
                clientSecret: paymentIntent.client_secret || undefined,
                raw: paymentIntent,
            };
        }
        catch (error) {
            console.error("❌ Stripe createPayment error:", error);
            throw (0, app_error_1.createError)("PAYMENT_FAILED", error?.message || "فشل إنشاء عملية الدفع");
        }
    }
    async verifyPayment(paymentId) {
        try {
            const stripe = this.getStripe();
            const paymentIntent = await stripe.paymentIntents.retrieve(paymentId);
            return {
                success: paymentIntent.status === "succeeded",
                status: this.mapStripeStatus(paymentIntent.status),
                amount: paymentIntent.amount / 100,
                raw: paymentIntent,
            };
        }
        catch (error) {
            console.error("❌ Stripe verifyPayment error:", error);
            return { success: false, status: "FAILED", raw: error };
        }
    }
    async refund(params) {
        try {
            const stripe = this.getStripe();
            await stripe.refunds.create({
                payment_intent: params.paymentId,
                amount: params.amount ? Math.round(params.amount * 100) : undefined,
            });
            return { success: true };
        }
        catch (error) {
            console.error("❌ Stripe refund error:", error);
            throw (0, app_error_1.createError)("PAYMENT_FAILED", "فشل استرداد المبلغ");
        }
    }
    verifyWebhookSignature(payload, signature) {
        const secret = process.env.STRIPE_WEBHOOK_SECRET;
        if (!secret) {
            throw (0, app_error_1.createError)("INTERNAL_SERVER_ERROR", "STRIPE_WEBHOOK_SECRET not configured");
        }
        const stripe = this.getStripe();
        let event;
        try {
            event = stripe.webhooks.constructEvent(payload, signature, secret);
        }
        catch (error) {
            throw (0, app_error_1.createError)("BAD_REQUEST", `Webhook signature failed: ${error.message}`);
        }
        switch (event.type) {
            case "payment_intent.succeeded": {
                const pi = event.data.object;
                return {
                    type: event.type,
                    paymentId: pi.id,
                    orderId: pi.metadata.orderId,
                    status: "SUCCEEDED",
                    raw: event,
                };
            }
            case "payment_intent.payment_failed": {
                const pi = event.data.object;
                return {
                    type: event.type,
                    paymentId: pi.id,
                    orderId: pi.metadata.orderId,
                    status: "FAILED",
                    raw: event,
                };
            }
            case "charge.refunded": {
                const charge = event.data.object;
                return {
                    type: event.type,
                    paymentId: charge.payment_intent,
                    status: "REFUNDED",
                    raw: event,
                };
            }
            default:
                return {
                    type: event.type,
                    paymentId: "",
                    status: "PENDING",
                    raw: event,
                };
        }
    }
    mapStripeStatus(status) {
        switch (status) {
            case "succeeded":
                return "SUCCEEDED";
            case "processing":
            case "requires_payment_method":
            case "requires_confirmation":
            case "requires_action":
                return "PENDING";
            case "canceled":
                return "CANCELLED";
            default:
                return "FAILED";
        }
    }
}
exports.StripeProvider = StripeProvider;
