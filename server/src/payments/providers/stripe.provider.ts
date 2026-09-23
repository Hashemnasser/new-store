// server/src/payments/providers/stripe.provider.ts

import Stripe from "stripe";
import { createError } from "../../errors/app-error";
import type {
  CreatePaymentParams,
  CreatePaymentResult,
  PaymentProvider,
  PaymentStatus,
  RefundParams,
  VerifyPaymentResult,
  WebhookEvent,
} from "../payment-provider.interface";

export class StripeProvider implements PaymentProvider {
  readonly name = "stripe";
  private stripe: Stripe | null = null;

  isEnabled(): boolean {
    return !!process.env.STRIPE_SECRET_KEY;
  }

  // ✅ دالة مساعدة لإنشاء Stripe عند الحاجة فقط
  private getStripe(): Stripe {
    if (this.stripe) return this.stripe;

    const key = process.env.STRIPE_SECRET_KEY;
    if (!key) {
      throw createError(
        "INTERNAL_SERVER_ERROR",
        "STRIPE_SECRET_KEY not configured"
      );
    }

    this.stripe = new Stripe(key, {
      apiVersion: "2026-08-26.dahlia",
    });

    return this.stripe;
  }

  async createPayment(
    params: CreatePaymentParams
  ): Promise<CreatePaymentResult> {
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
    } catch (error: any) {
      console.error("❌ Stripe createPayment error:", error);
      throw createError(
        "PAYMENT_FAILED",
        error?.message || "فشل إنشاء عملية الدفع"
      );
    }
  }

  async verifyPayment(paymentId: string): Promise<VerifyPaymentResult> {
    try {
      const stripe = this.getStripe();
      const paymentIntent = await stripe.paymentIntents.retrieve(paymentId);
      return {
        success: paymentIntent.status === "succeeded",
        status: this.mapStripeStatus(paymentIntent.status),
        amount: paymentIntent.amount / 100,
        raw: paymentIntent,
      };
    } catch (error: any) {
      console.error("❌ Stripe verifyPayment error:", error);
      return { success: false, status: "FAILED", raw: error };
    }
  }

  async refund(params: RefundParams): Promise<{ success: boolean }> {
    try {
      const stripe = this.getStripe();
      await stripe.refunds.create({
        payment_intent: params.paymentId,
        amount: params.amount ? Math.round(params.amount * 100) : undefined,
      });
      return { success: true };
    } catch (error: any) {
      console.error("❌ Stripe refund error:", error);
      throw createError("PAYMENT_FAILED", "فشل استرداد المبلغ");
    }
  }

  verifyWebhookSignature(
    payload: Buffer | string,
    signature: string
  ): WebhookEvent {
    const secret = process.env.STRIPE_WEBHOOK_SECRET;
    if (!secret) {
      throw createError(
        "INTERNAL_SERVER_ERROR",
        "STRIPE_WEBHOOK_SECRET not configured"
      );
    }

    const stripe = this.getStripe();

    let event: Stripe.Event;
    try {
      event = stripe.webhooks.constructEvent(payload, signature, secret);
    } catch (error: any) {
      throw createError(
        "BAD_REQUEST",
        `Webhook signature failed: ${error.message}`
      );
    }

    switch (event.type) {
      case "payment_intent.succeeded": {
        const pi = event.data.object as Stripe.PaymentIntent;
        return {
          type: event.type,
          paymentId: pi.id,
          orderId: pi.metadata.orderId,
          status: "SUCCEEDED",
          raw: event,
        };
      }
      case "payment_intent.payment_failed": {
        const pi = event.data.object as Stripe.PaymentIntent;
        return {
          type: event.type,
          paymentId: pi.id,
          orderId: pi.metadata.orderId,
          status: "FAILED",
          raw: event,
        };
      }
      case "charge.refunded": {
        const charge = event.data.object as Stripe.Charge;
        return {
          type: event.type,
          paymentId: charge.payment_intent as string,
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

  private mapStripeStatus(status: Stripe.PaymentIntent.Status): PaymentStatus {
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
