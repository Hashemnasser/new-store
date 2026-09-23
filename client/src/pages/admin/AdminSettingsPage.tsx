// src/pages/admin/AdminSettingsPage.tsx

import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { PageContainer } from "../../components/layout/PageContainer";

export const AdminSettingsPage = () => {
  return (
    <PageContainer>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-6">
          <Link to="/admin" className="hover:text-blue-600 transition">
            لوحة التحكم
          </Link>
          <span>/</span>
          <span className="font-medium ">الإعدادات</span>
        </nav>

        <h1 className="text-2xl font-bold  mb-4">إعدادات المدير</h1>
        <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
          هذه صفحة إعدادات المدير (قيد التطوير).
        </p>
      </motion.div>
    </PageContainer>
  );
};
