// server/src/payments/payment.service.ts

import { OrderStatus } from "@/generated/prisma/enums";
import { sendEmail } from "@/utils/email";
import {
  getAdminOrderNotificationTemplate,
  getOrderConfirmationTemplate,
} from "@/utils/email.templates";
import { prisma } from "../lib/prisma";
import { paymentProviderFactory } from "./payment-provider.factory";

// ============================================================
// 🧩 خدمة الدفع الموحدة (لا تعرف أي بوابة بعينها)
// ============================================================

export const paymentService = {
  /**
   * إنشاء عملية دفع باستخدام البوابة المحددة
   */
  async createPayment(params: {
    gateway: string;
    amount: number;
    currency: string;
    orderId: string;
  }) {
    const provider = paymentProviderFactory.get(params.gateway);
    const result = await provider.createPayment({
      amount: params.amount,
      currency: params.currency,
      orderId: params.orderId,
    });

    // ✅ حفظ معرف الدفع في الطلب
    await prisma.order.update({
      where: { id: params.orderId },
      data: { stripePaymentIntentId: result.paymentId },
    });

    return result;
  },

  /**
   * التحقق من حالة دفع
   */
  async verifyPayment(gateway: string, paymentId: string) {
    const provider = paymentProviderFactory.get(gateway);
    return provider.verifyPayment(paymentId);
  },

  /**
   * استرداد مبلغ
   */
  async refund(gateway: string, paymentId: string, amount?: number) {
    const provider = paymentProviderFactory.get(gateway);
    return provider.refund({ paymentId, amount });
  },

  /**
   * معالجة Webhook (موحدة لكل البوابات)
   */
  async handleWebhook(
    gateway: string,
    payload: Buffer | string,
    signature: string
  ) {
    const provider = paymentProviderFactory.get(gateway);
    const event = provider.verifyWebhookSignature(payload, signature);

    if (!event.orderId) {
      console.warn(`⚠️ Webhook event without orderId: ${event.type}`);
      return { received: true };
    }

    switch (event.status) {
      case "SUCCEEDED": {
        // ✅ تحديث حالة الطلب
        const updatedOrder = await prisma.order.update({
          where: { id: event.orderId },
          data: { status: OrderStatus.PROCESSING },
          include: {
            items: {
              include: {
                variant: { include: { product: true } },
              },
            },
          },
        });

        // ✅ تفريغ السلة الآن بعد نجاح الدفع
        const cart = await prisma.cart.findUnique({
          where: { userId: updatedOrder.userId },
        });
        if (cart) {
          await prisma.cartItem.deleteMany({
            where: { cartId: cart.id },
          });
          console.log(`🛒 Cart cleared for user ${updatedOrder.userId}`);
        }

        // ✅ إرسال الإيميلات
        const user = await prisma.user.findUnique({
          where: { id: updatedOrder.userId },
          select: { name: true, email: true },
        });

        if (user) {
          sendEmail({
            to: user.email,
            subject: `✅ تم تأكيد طلبك #${updatedOrder.id.slice(
              0,
              8
            )} - ProStore`,
            html: getOrderConfirmationTemplate(updatedOrder, user),
          }).catch(console.error);

          const admin = await prisma.user.findFirst({
            where: { role: "ADMIN" },
            select: { email: true },
          });

          if (admin) {
            sendEmail({
              to: admin.email,
              subject: `🛒 طلب جديد #${updatedOrder.id.slice(0, 8)} - ProStore`,
              html: getAdminOrderNotificationTemplate(updatedOrder, user),
            }).catch(console.error);
          }
        }

        console.log(`✅ Order #${event.orderId} paid successfully.`);
        break;
      }

      case "FAILED":
      case "CANCELLED": {
        // ✅ الدفع فشل: إعادة المخزون وإلغاء الطلب
        await prisma.$transaction(async (tx) => {
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
            data: { status: OrderStatus.CANCELLED },
          });
        });
        console.error(
          `❌ Order #${event.orderId} payment failed. Stock restored.`
        );
        break;
      }

      case "REFUNDED": {
        await prisma.order.update({
          where: { id: event.orderId },
          data: { status: OrderStatus.CANCELLED },
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
  getAvailableGateways(): string[] {
    return paymentProviderFactory.getEnabledNames();
  },
};
