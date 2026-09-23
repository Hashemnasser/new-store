// client/src/features/checkout/components/CheckoutForm.tsx

import {
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { ROUTES } from "../../../app/router/route.constants";
import { useCartStore } from "../../../store/cart.store";

interface CheckoutFormProps {
  orderId: string;
}

export const CheckoutForm = ({ orderId }: CheckoutFormProps) => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const { clearItems } = useCartStore();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) return;

    setIsLoading(true);

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}${ROUTES.CHECKOUT_SUCCESS}`,
      },
      redirect: "if_required",
    });

    if (error) {
      // ❌ فشل الدفع
      toast.error(error.message || "فشل الدفع");
      navigate(ROUTES.CHECKOUT_FAILED, {
        state: { error: error.message, orderId },
      });
    } else if (paymentIntent && paymentIntent.status === "succeeded") {
      // ✅ نجاح الدفع
      toast.success("تم الدفع بنجاح!");

      // ✅ 1. فرّغ السلة في Zustand Store (فوراً في الواجهة)
      clearItems();

      // ✅ 3. انتقل إلى صفحة النجاح
      navigate(ROUTES.CHECKOUT_SUCCESS, { state: { orderId } });
    } else {
      // حالة غير متوقعة (مثل processing)
      navigate(ROUTES.CHECKOUT_SUCCESS, { state: { orderId } });
    }

    setIsLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement />

      <button
        type="submit"
        disabled={!stripe || isLoading}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-lg transition disabled:opacity-50 flex items-center justify-center gap-2"
      >
        {isLoading ? (
          <>
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            جاري معالجة الدفع...
          </>
        ) : (
          "ادفع الآن"
        )}
      </button>
    </form>
  );
};
