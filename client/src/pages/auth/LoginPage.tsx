// // src/pages/auth/LoginPage.tsx

// import { motion } from "framer-motion";
// import { LoginForm } from "../../features/auth/components/LoginForm";

// export const LoginPage = () => {
//   return (
//     <motion.div
//       initial={{ opacity: 0, y: 20 }}
//       animate={{ opacity: 1, y: 0 }}
//       exit={{ opacity: 0, y: -20 }}
//       transition={{ duration: 0.3 }}
//       className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4 py-12"
//     >
//       <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
//         {/* الشعار */}
//         <div className="text-center mb-8">
//           <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
//             مرحباً بك
//           </h1>
//           <p className="text-gray-600 dark:text-gray-400 mt-2">
//             سجل دخولك لمتابعة التسوق
//           </p>
//         </div>

//         {/* النموذج */}
//         <LoginForm />
//       </div>
//     </motion.div>
//   );
// };

// src/pages/auth/LoginPage.tsx
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { LoginForm } from "../../features/auth/components/LoginForm";

export const LoginPage = () => {
  const { t } = useTranslation();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4 py-12"
    >
      <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {t("auth.login")}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            {t("auth.login")}
          </p>
        </div>
        <LoginForm />
      </div>
    </motion.div>
  );
};
