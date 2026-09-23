// src/pages/not-found/NotFoundPage.tsx

import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { PageContainer } from "../../components/layout/PageContainer";

export const NotFoundPage = () => {
  return (
    <PageContainer>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center py-20"
      >
        <h1 className="text-6xl font-bold text-gray-900 dark:text-white mb-4">
          404
        </h1>
        <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-300 mb-4">
          الصفحة غير موجودة
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          عذراً، الصفحة التي تبحث عنها غير موجودة.
        </p>
        <Link
          to="/"
          className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-lg transition"
        >
          العودة إلى الرئيسية
        </Link>
      </motion.div>
    </PageContainer>
  );
};
