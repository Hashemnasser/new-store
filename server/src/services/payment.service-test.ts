// // src/services/payment.service.ts

// import { Decimal } from "@prisma/client/runtime/library";

// // نقبل مبلغ، عملة، وطريقة الدفع
// export const paymentService = {
//   processPayment: async (params: {
//     amount: Decimal;
//     currency: string;
//     paymentMethod: "CASH" | "CARD" | "BANK_TRANSFER";
//   }): Promise<{ success: boolean; paymentIntentId: string | null }> => {
//     // إذا كانت طريقة الدفع كاش، لا حاجة لبوابة دفع
//     if (params.paymentMethod === "CASH") {
//       return { success: true, paymentIntentId: null };
//     }

//     // 🔮 محاكاة عملية الدفع الإلكتروني (تأخير وهمي 2 ثانية)
//     // ستقوم هنا مستقبلاً باستدعاء Stripe API
//     // Stripe: const paymentIntent = await stripe.paymentIntents.create({ amount: params.amount.toNumber() * 100, currency: params.currency });
//     await new Promise((resolve) => setTimeout(resolve, 2000)); // محاكاة زمن المعالجة

//     // نعيد نجاح وهمي مع معرف لعملية الدفع (Simulate ID)
//     const simulatedIntentId = `pi_sim_${Date.now()}_${Math.random()
//       .toString(36)
//       .substring(7)}`;

//     // هنا يمكنك إضافة منطق الفشل العشوائي لاختبار تجربة المستخدم (اختياري)
//     // if (Math.random() < 0.1) throw new Error("Payment declined by bank");

//     return { success: true, paymentIntentId: simulatedIntentId };
//   },
// };

// server/src/services/payment.service.ts
import type { Decimal } from "@prisma/client/runtime/library";
import { StripeProvider } from "../payments/providers/stripe.provider";

const stripeProvider = new StripeProvider();

export const paymentService = {
  /**
   * إنشاء PaymentIntent حقيقي في Stripe
   * @returns clientSecret + paymentId
   */
  createPaymentIntent: async (params: {
    amount: Decimal;
    currency: string;
    orderId: string;
    userId: string;
  }): Promise<{ clientSecret: string; paymentId: string }> => {
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
  refund: async (paymentId: string, amount?: number) => {
    return stripeProvider.refund({ paymentId, amount });
  },
};
