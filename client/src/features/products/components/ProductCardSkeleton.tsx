// src/features/products/components/ProductCardSkeleton.tsx

import { motion } from "framer-motion";

export const ProductCardSkeleton = () => {
  return (
    <motion.div
      initial={{ opacity: 0.3, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="bg-gray-200 dark:bg-gray-700 rounded-xl overflow-hidden animate-pulse"
    >
      <div className="aspect-square bg-gray-300 dark:bg-gray-600" />
      <div className="p-4 space-y-3">
        <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-3/4" />
        <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-1/2" />
        <div className="flex items-center gap-1">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="w-4 h-4 bg-gray-300 dark:bg-gray-600 rounded"
            />
          ))}
        </div>
        <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded w-1/3" />
        <div className="h-10 bg-gray-300 dark:bg-gray-600 rounded w-full" />
      </div>
    </motion.div>
  );
};
