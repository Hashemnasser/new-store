// client/src/pages/user/SettingsPage.tsx

import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { Key, LogOut, Moon, Sun, Trash2, User } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { z } from "zod";
import { ROUTES } from "../../app/router/route.constants";
import { PageContainer } from "../../components/layout/PageContainer";
import { Button } from "../../components/ui/Button";
import { useAuth } from "../../features/auth/hooks/useAuth";
import { useTheme } from "../../providers/ThemeProvider";

// ============================================================
// 📝 مخطط التحقق (Zod Schema) لتغيير كلمة المرور
// ============================================================

const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "كلمة المرور الحالية مطلوبة"),
    newPassword: z
      .string()
      .min(6, "كلمة المرور الجديدة يجب أن تكون 6 أحرف على الأقل"),
    confirmPassword: z.string().min(6, "تأكيد كلمة المرور مطلوب"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "كلمة المرور الجديدة وتأكيدها غير متطابقين",
    path: ["confirmPassword"],
  });

type ChangePasswordFormValues = z.infer<typeof changePasswordSchema>;

// ============================================================
// 🧩 المكون الرئيسي
// ============================================================

export const SettingsPage = () => {
  const { changePassword, logout, user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // ✅ نموذج تغيير كلمة المرور
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<ChangePasswordFormValues>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  // ✅ إعادة تعيين النموذج عند تغيير المستخدم

  useEffect(() => {
    reset({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
  }, [user, reset]);

  // ✅ دالة تغيير كلمة المرور
  const onSubmitPassword = async (data: ChangePasswordFormValues) => {
    setIsLoading(true);
    try {
      await changePassword(data.currentPassword, data.newPassword);
      toast.success("تم تغيير كلمة المرور بنجاح");
      reset(); // تفريغ النموذج بعد النجاح
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || "حدث خطأ أثناء تغيير كلمة المرور"
      );
    } finally {
      setIsLoading(false);
    }
  };

  // ✅ دالة حذف الحساب (مع تأكيد)
  const handleDeleteAccount = () => {
    if (!user) return;
    const confirmDelete = window.confirm(
      `هل أنت متأكد من حذف حسابك "${user.email}"؟ هذا الإجراء لا يمكن التراجع عنه.`
    );
    if (!confirmDelete) return;

    setIsDeleting(true);
    // هنا يمكنك استدعاء API حذف الحساب (غير موجود حالياً، لكن سنضيفه لاحقاً)
    // مؤقتاً: نعرض رسالة ونقوم بتسجيل الخروج
    toast.warning("ميزة حذف الحساب قيد التطوير");
    setIsDeleting(false);
    // logout(); // لو أردت تسجيل الخروج فوراً
  };

  return (
    <PageContainer>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          الإعدادات
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* ============================================================
              العمود الأيسر: قائمة الإعدادات السريعة
              ============================================================ */}
          <div className="lg:col-span-1 space-y-4">
            {/* بطاقة الثيم */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                المظهر
              </h3>
              <button
                onClick={toggleTheme}
                className="flex items-center justify-between w-full p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition"
              >
                <span className="flex items-center gap-2">
                  {theme === "dark" ? (
                    <Sun className="w-5 h-5 text-yellow-500" />
                  ) : (
                    <Moon className="w-5 h-5 text-gray-600" />
                  )}
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {theme === "dark" ? "الوضع النهاري" : "الوضع الليلي"}
                  </span>
                </span>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {theme === "dark" ? "☀️" : "🌙"}
                </span>
              </button>
            </div>

            {/* بطاقة الملف الشخصي السريع */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                حسابي
              </h3>
              <button
                onClick={() => navigate(ROUTES.PROFILE)}
                className="flex items-center gap-3 w-full p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition"
              >
                <User className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  تعديل الملف الشخصي
                </span>
              </button>
            </div>

            {/* بطاقة تسجيل الخروج */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <button
                onClick={() => {
                  logout();
                  navigate(ROUTES.HOME);
                  toast.success("تم تسجيل الخروج بنجاح");
                }}
                className="flex items-center gap-3 w-full p-3 bg-red-50 dark:bg-red-900/20 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition text-red-600 dark:text-red-400"
              >
                <LogOut className="w-5 h-5" />
                <span className="text-sm font-medium">تسجيل الخروج</span>
              </button>
            </div>
          </div>

          {/* ============================================================
              العمود الأيمن: نموذج تغيير كلمة المرور
              ============================================================ */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center gap-2 mb-6">
                <Key className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  تغيير كلمة المرور
                </h3>
              </div>

              <form
                onSubmit={handleSubmit(onSubmitPassword)}
                className="space-y-6"
              >
                {/* كلمة المرور الحالية */}
                <div>
                  <label
                    htmlFor="currentPassword"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  >
                    كلمة المرور الحالية
                  </label>
                  <input
                    id="currentPassword"
                    type="password"
                    // autoComplete="new-password" // ✅ منع التعبئة التلقائية
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    placeholder="••••••••"
                    {...register("currentPassword")}
                  />
                  {errors.currentPassword && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.currentPassword.message}
                    </p>
                  )}
                </div>

                {/* كلمة المرور الجديدة */}
                <div>
                  <label
                    htmlFor="newPassword"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  >
                    كلمة المرور الجديدة
                  </label>
                  <input
                    id="newPassword"
                    type="password"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    placeholder="••••••••"
                    {...register("newPassword")}
                  />
                  {errors.newPassword && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.newPassword.message}
                    </p>
                  )}
                </div>

                {/* تأكيد كلمة المرور الجديدة */}
                <div>
                  <label
                    htmlFor="confirmPassword"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  >
                    تأكيد كلمة المرور الجديدة
                  </label>
                  <input
                    id="confirmPassword"
                    type="password"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    placeholder="••••••••"
                    {...register("confirmPassword")}
                  />
                  {errors.confirmPassword && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.confirmPassword.message}
                    </p>
                  )}
                </div>

                {/* زر الحفظ */}
                <div className="flex justify-end">
                  <Button
                    type="submit"
                    isLoading={isLoading}
                    disabled={!isDirty || isLoading}
                    className="flex items-center gap-2"
                  >
                    <Key className="w-4 h-4" />
                    {isLoading ? "جاري التغيير..." : "تغيير كلمة المرور"}
                  </Button>
                </div>
              </form>
            </div>

            {/* ============================================================
                قسم حذف الحساب (خطر)
                ============================================================ */}
            <div className="mt-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-red-200 dark:border-red-800 p-6">
              <div className="flex items-center gap-2 mb-2">
                <Trash2 className="w-6 h-6 text-red-600" />
                <h3 className="text-lg font-semibold text-red-600">
                  حذف الحساب
                </h3>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                سيتم حذف حسابك وجميع بياناته بشكل نهائي. هذا الإجراء لا يمكن
                التراجع عنه.
              </p>
              <Button
                variant="danger"
                onClick={handleDeleteAccount}
                disabled={isDeleting}
                className="flex items-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                {isDeleting ? "جاري الحذف..." : "حذف الحساب"}
              </Button>
            </div>
          </div>
        </div>
      </motion.div>
    </PageContainer>
  );
};
