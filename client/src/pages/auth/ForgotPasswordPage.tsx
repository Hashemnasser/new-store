// client/src/pages/auth/ForgotPasswordPage.tsx
import { motion } from "framer-motion";
import { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "../../components/ui/Button";
import { authApi } from "../../features/auth/api/auth.api";

export const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return toast.error("الرجاء إدخال البريد الإلكتروني");
    setIsLoading(true);
    try {
      await authApi.forgotPassword(email);
      setIsSent(true);
      toast.success("تم إرسال رابط إعادة التعيين إلى بريدك الإلكتروني");
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "حدث خطأ، حاول مرة أخرى");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4"
    >
      <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white text-center mb-2">
          نسيت كلمة المرور
        </h1>
        <p className="text-gray-600 dark:text-gray-400 text-center mb-8">
          أدخل بريدك الإلكتروني وسنرسل لك رابطاً لإعادة التعيين
        </p>
        {!isSent ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example@email.com"
              className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700"
              required
            />
            <Button type="submit" isLoading={isLoading} className="w-full">
              إرسال رابط إعادة التعيين
            </Button>
            <p className="text-center text-sm">
              <Link to="/login" className="text-blue-600 hover:underline">
                تذكرت كلمة المرور؟ تسجيل الدخول
              </Link>
            </p>
          </form>
        ) : (
          <div className="text-center space-y-4">
            <div className="text-6xl">📧</div>
            <h3 className="text-xl font-semibold">تم الإرسال!</h3>
            <p className="text-gray-500">
              تحقق من بريدك الإلكتروني (بما في ذلك مجلد البريد العشوائي).
            </p>
            <Link to="/login" className="text-blue-600 hover:underline block">
              العودة لتسجيل الدخول
            </Link>
          </div>
        )}
      </div>
    </motion.div>
  );
};
