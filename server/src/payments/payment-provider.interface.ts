// server/src/payments/payment-provider.interface.ts

// ============================================================
// 📦 الأنواع المشتركة لجميع بوابات الدفع
// ============================================================

export interface CreatePaymentParams {
  amount: number; // المبلغ (بالوحدة الرئيسية، مثل الدولار)
  currency: string; // العملة (مثل "usd")
  orderId: string; // معرف الطلب في قاعدة البيانات
  metadata?: Record<string, string>;
}

export interface CreatePaymentResult {
  success: boolean;
  paymentId: string; // معرف العملية في البوابة
  clientSecret?: string; // للبوابات التي تستخدم client-side confirmation (Stripe)
  redirectUrl?: string; // للبوابات التي توجّه المستخدم (PayPal, Tap)
  qrCode?: string; // للبوابات التي تستخدم QR (شام كاش)
  raw?: any; // استجابة البوابة الأصلية (للتشخيص)
}

export interface VerifyPaymentResult {
  success: boolean;
  status: PaymentStatus;
  amount?: number;
  raw?: any;
}

export type PaymentStatus =
  | "PENDING"
  | "SUCCEEDED"
  | "FAILED"
  | "CANCELLED"
  | "REFUNDED";

export interface RefundParams {
  paymentId: string;
  amount?: number; // المبلغ المسترد (اختياري للاسترداد الجزئي)
}

export interface WebhookEvent {
  type: string;
  paymentId: string;
  orderId?: string;
  status: PaymentStatus;
  raw: any;
}

// ============================================================
// 🧩 العقد (Interface) الذي يجب أن يطبقه كل مزود دفع
// ============================================================

export interface PaymentProvider {
  /**
   * اسم البوابة (مثل "stripe", "shamcash", "paypal")
   */
  readonly name: string;

  /**
   * إنشاء عملية دفع جديدة
   */
  createPayment(params: CreatePaymentParams): Promise<CreatePaymentResult>;

  /**
   * التحقق من حالة عملية دفع
   */
  verifyPayment(paymentId: string): Promise<VerifyPaymentResult>;

  /**
   * استرداد مبلغ
   */
  refund(params: RefundParams): Promise<{ success: boolean }>;

  /**
   * التحقق من توقيع Webhook (أمان)
   */
  verifyWebhookSignature(
    payload: Buffer | string,
    signature: string
  ): WebhookEvent;

  /**
   * هل البوابة مدعومة حالياً؟ (مفيد لتعطيل بوابة دون حذفها)
   */
  isEnabled(): boolean;
}
