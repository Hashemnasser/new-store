// src/pages/AboutPage.tsx

import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { PageContainer } from "../../components/layout/PageContainer";

export const AboutPage = () => {
  return (
    <PageContainer>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-6">
          <Link to="/" className="hover:text-blue-600 transition">
            الرئيسية
          </Link>
          <span>/</span>
          <span className="font-medium text-gray-900 dark:text-white">
            عن المتجر
          </span>
        </nav>

        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          عن المتجر
        </h1>
        <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
          هذا هو متجر ProStore، نقدم أفضل المنتجات بأفضل الأسعار. تأسس متجرنا
          عام 2024 بهدف توفير تجربة تسوق مميزة لعملائنا.
        </p>
      </motion.div>
    </PageContainer>
  );
};
