// src/features/cart/components/CartSummary.tsx

import { motion } from "framer-motion";
import { ShoppingBag, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { ROUTES } from "../../../app/router/route.constants";

interface CartSummaryProps {
  total: number;
  itemCount: number;
  onClearCart: () => void;
  isClearing?: boolean;
}

export const CartSummary = ({
  total,
  itemCount,
  onClearCart,
  isClearing = false,
}: CartSummaryProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 sticky top-24"
    >
      <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
        ملخص الطلب
      </h2>

      <div className="space-y-3 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-600 dark:text-gray-400">عدد العناصر</span>
          <span className="font-medium text-gray-900 dark:text-white">
            {itemCount}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600 dark:text-gray-400">المجموع</span>
          <span className="font-medium text-gray-900 dark:text-white">
            ${total.toFixed(2)}
          </span>
        </div>
        <div className="flex justify-between border-t border-gray-200 dark:border-gray-700 pt-3">
          <span className="text-base font-bold text-gray-900 dark:text-white">
            الإجمالي
          </span>
          <span className="text-base font-bold text-blue-600 dark:text-blue-400">
            ${total.toFixed(2)}
          </span>
        </div>
      </div>

      <Link
        to={ROUTES.CHECKOUT}
        className="mt-6 w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-lg transition"
      >
        <ShoppingBag className="w-5 h-5" />
        إتمام الطلب
      </Link>

      <button
        onClick={onClearCart}
        disabled={isClearing || itemCount === 0}
        className="mt-3 w-full flex items-center justify-center gap-2 text-red-600 hover:text-red-700 text-sm font-medium py-2 border border-red-200 hover:border-red-300 rounded-lg transition disabled:opacity-50"
      >
        <Trash2 className="w-4 h-4" />
        {isClearing ? "جاري التفريغ..." : "تفريغ السلة"}
      </button>
    </motion.div>
  );
};
