// src/pages/checkout/CheckoutPage.tsx

import { zodResolver } from "@hookform/resolvers/zod";
import { Elements } from "@stripe/react-stripe-js";
import { motion } from "framer-motion";
import { ArrowLeft, CreditCard, Tag, Truck, X } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { z } from "zod";
import { ROUTES } from "../../app/router/route.constants";
import { PageContainer } from "../../components/layout/PageContainer";
import { useCart } from "../../features/cart/hooks/useCart";
import { CheckoutForm } from "../../features/checkout/components/CheckoutForm";
import { useValidateCoupon } from "../../features/coupons/hooks/useCoupons";
import type { ValidateCouponRequest } from "../../features/coupons/types/coupon.types";
import { useCreateOrder } from "../../features/orders/hooks/useOrders";
import type { CreateOrderPayload } from "../../features/orders/types/order.types";
import { stripePromise } from "../../lib/stripe";
import { formatCurrency } from "../../utils/currency";
import { isEmpty } from "../../utils/helpers";

// ============================================================
// 📝 مخطط التحقق باستخدام Zod
// ============================================================

const checkoutSchema = z.object({
  street: z.string().min(1, "الشارع مطلوب"),
  city: z.string().min(1, "المدينة مطلوبة"),
  postalCode: z.string().min(1, "الرمز البريدي مطلوب"),
  country: z.string().min(1, "الدولة مطلوبة"),
  paymentMethod: z.enum(["CASH", "CARD", "BANK_TRANSFER"]),
  couponCode: z.string().optional(),
});

type CheckoutFormValues = z.infer<typeof checkoutSchema>;

// ============================================================
// 🧩 الصفحة الرئيسية
// ============================================================

export const CheckoutPage = () => {
  const navigate = useNavigate();
  const {
    items,
    total,
    itemCount,
    isLoading: cartLoading,
    clearCart,
  } = useCart();
  const createOrder = useCreateOrder();
  const validateCoupon = useValidateCoupon();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [couponDiscount, setCouponDiscount] = useState<number>(0);
  const [isCouponLoading, setIsCouponLoading] = useState(false);

  // ✅ حالات الدفع الإلكتروني
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [orderId, setOrderId] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      paymentMethod: "CASH",
      couponCode: "",
    },
  });

  const couponCode = watch("couponCode");

  // ============================================================
  // ⏳ حالة التحميل
  // ============================================================
  if (cartLoading) {
    return (
      <PageContainer>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
        </div>
      </PageContainer>
    );
  }

  // ============================================================
  // 🛒 إذا كانت السلة فارغة
  // ============================================================
  if (isEmpty(items)) {
    return (
      <PageContainer>
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🛒</div>
          <h2 className="text-xl font-medium mb-2">سلة التسوق فارغة</h2>
          <p className="text-gray-400 mb-6">
            أضف بعض المنتجات إلى سلة التسوق أولاً
          </p>
          <button
            onClick={() => navigate(ROUTES.PRODUCTS)}
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-lg transition"
          >
            استمر بالتسوق
          </button>
        </div>
      </PageContainer>
    );
  }

  // ============================================================
  // ✅ دالة تطبيق الكوبون
  // ============================================================
  const handleApplyCoupon = async () => {
    const trimmedCode = couponCode?.trim();
    if (!trimmedCode) {
      toast.error("الرجاء إدخال رمز الكوبون");
      return;
    }

    setIsCouponLoading(true);
    try {
      const payload: ValidateCouponRequest = {
        code: trimmedCode.toUpperCase(),
        orderAmount: total,
      };

      const result = await validateCoupon.mutateAsync(payload);

      if (!result.success) {
        toast.error(result.message || "كوبون غير صالح");
        setAppliedCoupon(null);
        setCouponDiscount(0);
        return;
      }

      const discount = result.data?.discountAmount ?? 0;
      if (discount > 0) {
        setAppliedCoupon(trimmedCode.toUpperCase());
        setCouponDiscount(discount);
        toast.success(`تم تطبيق الخصم: ${formatCurrency(discount)}`);
      } else {
        toast.info("هذا الكوبون لا يقدم خصماً إضافياً");
        setAppliedCoupon(null);
        setCouponDiscount(0);
      }
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        "حدث خطأ أثناء التحقق من الكوبون";
      toast.error(errorMessage);
      setAppliedCoupon(null);
      setCouponDiscount(0);
    } finally {
      setIsCouponLoading(false);
    }
  };

  // ============================================================
  // ✅ دالة إزالة الكوبون
  // ============================================================
  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponDiscount(0);
    setValue("couponCode", "");
    toast.info("تم إزالة الكوبون");
  };

  // ============================================================
  // ✅ حساب الإجمالي النهائي
  // ============================================================
  const finalTotal = Math.max(total - couponDiscount, 0);

  // ============================================================
  // ✅ إرسال الطلب
  // ============================================================
  const onSubmit = async (data: CheckoutFormValues) => {
    setIsSubmitting(true);
    const { paymentMethod, couponCode, ...shippingAddress } = data;

    try {
      const payload: CreateOrderPayload = {
        shippingAddress,
        paymentMethod,
        couponCode: appliedCoupon || undefined,
      };

      const result = await createOrder.mutateAsync(payload);

      // ✅ بنية الاستجابة: { success, message, data: { order, paymentResult } }
      const paymentResult = result.data?.paymentResult;
      const order = result.data?.order;

      // ✅ إذا كان الدفع إلكترونياً (Stripe)
      if (paymentResult?.clientSecret) {
        setClientSecret(paymentResult.clientSecret);
        setOrderId(order.id);
        // ⚠️ لا نمسح السلة هنا — الـ Webhook سيتولى ذلك بعد نجاح الدفع
        setIsSubmitting(false);
        return;
      }

      // ✅ الدفع عند الاستلام: انتقل مباشرة لصفحة النجاح
      clearCart();
      navigate(ROUTES.CHECKOUT_SUCCESS, {
        state: { paymentMethod, orderId: order?.id },
      });
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || "فشل إنشاء الطلب. حاول مرة أخرى."
      );
      setIsSubmitting(false);
    }
  };

  // ============================================================
  // 💳 عرض نموذج Stripe (بعد إنشاء الطلب)
  // ============================================================
  if (clientSecret) {
    return (
      <PageContainer>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <CreditCard className="w-6 h-6" />
              إتمام الدفع
            </h1>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* نموذج الدفع */}
            <div className="lg:col-span-2">
              <div className="rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <h2 className="text-lg font-semibold mb-4">معلومات البطاقة</h2>

                <Elements
                  stripe={stripePromise}
                  options={{
                    clientSecret,
                    appearance: {
                      theme: "stripe",
                      variables: {
                        colorPrimary: "#2563eb",
                      },
                    },
                  }}
                >
                  <CheckoutForm orderId={orderId!} />
                </Elements>
              </div>
            </div>

            {/* ملخص الطلب */}
            <div className="lg:col-span-1">
              <div className="rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 sticky top-24">
                <h2 className="text-lg font-semibold mb-4">ملخص الطلب</h2>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500 dark:text-gray-400">
                      عدد العناصر
                    </span>
                    <span className="font-medium">{itemCount}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500 dark:text-gray-400">
                      المجموع
                    </span>
                    <span className="font-medium">{formatCurrency(total)}</span>
                  </div>
                  {appliedCoupon && couponDiscount > 0 && (
                    <div className="flex justify-between text-sm text-green-600">
                      <span>الخصم</span>
                      <span>-{formatCurrency(couponDiscount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-base font-bold pt-2 border-t border-gray-200 dark:border-gray-700">
                    <span>الإجمالي</span>
                    <span className="text-blue-600 dark:text-blue-400">
                      {formatCurrency(finalTotal)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </PageContainer>
    );
  }

  // ============================================================
  // 📋 عرض نموذج الشحن واختيار طريقة الدفع
  // ============================================================
  return (
    <PageContainer>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {/* العنوان */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Truck className="w-6 h-6" />
            إتمام الطلب
          </h1>
          <button
            onClick={() => navigate(ROUTES.CART)}
            className="text-sm text-gray-400 hover:text-blue-600 transition flex items-center gap-1"
          >
            <ArrowLeft className="w-4 h-4" />
            العودة إلى السلة
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* نموذج الشحن */}
          <div className="lg:col-span-2">
            <div className="rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h2 className="text-lg font-semibold mb-4">معلومات الشحن</h2>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    الشارع
                  </label>
                  <input
                    {...register("street")}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    placeholder="مثال: شارع الحمرا ١٢"
                  />
                  {errors.street && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.street.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    المدينة
                  </label>
                  <input
                    {...register("city")}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    placeholder="مثال: دمشق"
                  />
                  {errors.city && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.city.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    الرمز البريدي
                  </label>
                  <input
                    {...register("postalCode")}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    placeholder="مثال: ١٢٣٤٥"
                  />
                  {errors.postalCode && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.postalCode.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    الدولة
                  </label>
                  <input
                    {...register("country")}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    placeholder="مثال: سوريا"
                  />
                  {errors.country && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.country.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    طريقة الدفع
                  </label>
                  <select
                    {...register("paymentMethod")}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  >
                    <option value="CASH">الدفع عند الاستلام</option>
                    <option value="CARD">بطاقة ائتمان (Stripe)</option>
                    <option value="BANK_TRANSFER">تحويل بنكي</option>
                  </select>
                </div>

                {/* حقل الكوبون */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    رمز الخصم (كوبون)
                  </label>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                        <Tag className="w-4 h-4" />
                      </div>
                      <input
                        {...register("couponCode")}
                        disabled={!!appliedCoupon}
                        className="w-full pr-10 pl-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition disabled:opacity-50"
                        placeholder="أدخل رمز الكوبون"
                      />
                    </div>
                    {appliedCoupon ? (
                      <button
                        type="button"
                        onClick={handleRemoveCoupon}
                        className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition flex items-center gap-1"
                      >
                        <X className="w-4 h-4" />
                        إزالة
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={handleApplyCoupon}
                        disabled={isCouponLoading || !couponCode?.trim()}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition disabled:opacity-50 flex items-center gap-1"
                      >
                        {isCouponLoading ? (
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        ) : (
                          "تطبيق"
                        )}
                      </button>
                    )}
                  </div>
                  {appliedCoupon && (
                    <p className="mt-1 text-sm text-green-600 flex items-center gap-1">
                      <Tag className="w-3 h-3" />
                      تم تطبيق الكوبون: {appliedCoupon} (خصم{" "}
                      {formatCurrency(couponDiscount)})
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-lg transition disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      جاري إنشاء الطلب...
                    </>
                  ) : (
                    <>
                      <CreditCard className="w-5 h-5" />
                      تأكيد الطلب ({formatCurrency(finalTotal)})
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* ملخص الطلب */}
          <div className="lg:col-span-1">
            <div className="rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 sticky top-24">
              <h2 className="text-lg font-semibold mb-4">ملخص الطلب</h2>

              <div className="space-y-3 max-h-60 overflow-y-auto">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-3 py-2 border-b border-gray-100 dark:border-gray-700"
                  >
                    <img
                      src={
                        item.product.images.find((img) => img.isPrimary)?.url ||
                        "/images/placeholder.png"
                      }
                      alt={item.product.title}
                      className="w-12 h-12 object-cover rounded-lg"
                      loading="lazy"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {item.product.title}
                      </p>
                      <p className="text-xs text-gray-400">
                        {item.quantity} × {formatCurrency(item.variant.price)}
                      </p>
                    </div>
                    <span className="text-sm font-semibold">
                      {formatCurrency(item.variant.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="space-y-2 pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500 dark:text-gray-400">
                    عدد العناصر
                  </span>
                  <span className="font-medium">{itemCount}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500 dark:text-gray-400">
                    المجموع
                  </span>
                  <span className="font-medium">{formatCurrency(total)}</span>
                </div>
                {appliedCoupon && couponDiscount > 0 && (
                  <div className="flex justify-between text-sm text-green-600">
                    <span>الخصم</span>
                    <span>-{formatCurrency(couponDiscount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-base font-bold pt-2 border-t border-gray-200 dark:border-gray-700">
                  <span>الإجمالي</span>
                  <span className="text-blue-600 dark:text-blue-400">
                    {formatCurrency(finalTotal)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </PageContainer>
  );
};
