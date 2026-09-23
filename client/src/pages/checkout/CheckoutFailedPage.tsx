// client/src/pages/checkout/CheckoutFailedPage.tsx

import { motion } from "framer-motion";
import { AlertTriangle, RefreshCw, ShoppingBag } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { ROUTES } from "../../app/router/route.constants";
import { PageContainer } from "../../components/layout/PageContainer";

export const CheckoutFailedPage = () => {
  const location = useLocation();
  const errorMessage =
    location.state?.error || "حدث خطأ غير متوقع أثناء الدفع.";

  return (
    <PageContainer>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-md mx-auto text-center py-12"
      >
        <div className="bg-red-100 dark:bg-red-900/30 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
          <AlertTriangle className="w-12 h-12 text-red-600 dark:text-red-400" />
        </div>

        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          فشل الدفع
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-6">{errorMessage}</p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            to={ROUTES.CHECKOUT}
            className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-lg transition"
          >
            <RefreshCw className="w-5 h-5" />
            إعادة المحاولة
          </Link>
          <Link
            to={ROUTES.CART}
            className="flex items-center justify-center gap-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-white font-medium px-6 py-3 rounded-lg transition"
          >
            <ShoppingBag className="w-5 h-5" />
            العودة إلى السلة
          </Link>
        </div>
      </motion.div>
    </PageContainer>
  );
};
