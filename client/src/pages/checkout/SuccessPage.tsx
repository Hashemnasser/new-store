// src/pages/checkout/SuccessPage.tsx

import { motion } from "framer-motion";
import { CheckCircle, Home, ShoppingBag } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { ROUTES } from "../../app/router/route.constants";
import { PageContainer } from "../../components/layout/PageContainer";

export const SuccessPage = () => {
  const location = useLocation();
  const paymentMethod = location.state?.paymentMethod || "CASH";

  const successMessage =
    paymentMethod === "CASH"
      ? "طلبك قيد الانتظار. سيتم تأكيده بعد استلام الدفع عند التوصيل."
      : "تم تأكيد دفعتك بنجاح! سيتم تجهيز طلبك الآن.";
  return (
    <PageContainer>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-md mx-auto text-center py-12"
      >
        <div className=" w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-12 h-12 text-green-600 dark:text-green-400" />
        </div>

        <h1 className="text-3xl font-bold  mb-2">تم تأكيد الطلب!</h1>
        <p className="text-gray-400 mb-6">
          شكراً لتسوقك من ProStore. سيتم تأكيد طلبك وإرساله قريباً.
        </p>

        <div className="bg-white  rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6 text-left">
          <p className="text-sm text-gray-600 ">
            سيتم إرسال تأكيد الطلب إلى بريدك الإلكتروني. يمكنك تتبع حالة طلبك من
            خلال صفحة "طلباتي" في حسابك.
          </p>
        </div>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          {successMessage}
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            to={ROUTES.ORDERS}
            className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-lg transition"
          >
            <ShoppingBag className="w-5 h-5" />
            عرض طلباتي
          </Link>
          <Link
            to={ROUTES.HOME}
            className="flex items-center justify-center gap-2 bg-gray-200 hover:bg-gray-300  dark:hover:bg-gray-600 text-gray-900  font-medium px-6 py-3 rounded-lg transition"
          >
            <Home className="w-5 h-5" />
            العودة للرئيسية
          </Link>
        </div>
      </motion.div>
    </PageContainer>
  );
};
