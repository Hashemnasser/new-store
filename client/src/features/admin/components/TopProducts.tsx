// src/features/admin/components/TopProducts.tsx

import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import type { TopProduct } from "../types/admin.types";

interface TopProductsProps {
  products: TopProduct[];
  isLoading?: boolean;
  totalRevenue?: number;
}

export const TopProducts = ({
  products,
  isLoading = false,
}: TopProductsProps) => {
  console.log("proooo....:::", products);
  if (isLoading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="h-6 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-4" />
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
              <div className="flex-1 h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
              <div className="w-16 h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          أفضل المنتجات مبيعاً
        </h3>
        <p className="text-center text-gray-500 dark:text-gray-400 py-4">
          لا توجد منتجات مبيعة حتى الآن
        </p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.2 }}
      className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-2"
    >
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        أفضل المنتجات مبيعاً
      </h3>

      <div className="space-y-3">
        {products.map((product, index) => (
          <motion.div
            key={product.productId}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition"
          >
            <span className="text-sm font-bold text-gray-400 dark:text-gray-500 w-4">
              {index + 1}
            </span>

            <img
              src={product.image || "/images/placeholder.png"}
              alt={product.title}
              className="w-10 h-10 object-cover rounded-lg"
              loading="lazy"
            />
            <Link
              to={`/product/${product.slug}`}
              className="flex-1 text-sm font-medium text-gray-800 dark:text-white hover:text-blue-600 transition line-clamp-1"
            >
              {product.title}
            </Link>
            <div className="flex   items-center gap-4">
              <div className="text-right  pt-5 flex flex-col ">
                <p className="text-sm font-semibold text-gray-900 dark:text-white">
                  price:{Number(product.price) ?? "0.00"} $
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {product.totalSold} units
                </p>
              </div>
              <div className="font-semibold">
                total:{" "}
                {Number(product.totalSold * Number(product.price)).toFixed(2) ??
                  "0.00"}{" "}
                $
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};
