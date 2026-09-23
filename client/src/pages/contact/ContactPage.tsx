// src/pages/ContactPage.tsx

import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { PageContainer } from "../../components/layout/PageContainer";

export const ContactPage = () => {
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
            اتصل بنا
          </span>
        </nav>

        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          اتصل بنا
        </h1>
        <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
          يمكنك التواصل معنا عبر البريد الإلكتروني: support@prostore.com
        </p>
      </motion.div>
    </PageContainer>
  );
};
