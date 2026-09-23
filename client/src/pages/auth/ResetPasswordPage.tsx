// client/src/pages/auth/ResetPasswordPage.tsx
import { motion } from "framer-motion";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "../../components/ui/Button";
import { authApi } from "../../features/auth/api/auth.api";

export const ResetPasswordPage = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 6)
      return toast.error("كلمة المرور يجب أن تكون 6 أحرف على الأقل");
    if (newPassword !== confirmPassword)
      return toast.error("كلمة المرور غير متطابقة");
    if (!token) return toast.error("رابط غير صحيح");

    setIsLoading(true);
    try {
      await authApi.resetPassword(token, newPassword);
      toast.success("تم إعادة تعيين كلمة المرور بنجاح!");
      navigate("/login");
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || "الرابط منتهي الصلاحية أو غير صحيح"
      );
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
        <h1 className="text-2xl font-bold text-center mb-6">
          إعادة تعيين كلمة المرور
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="كلمة المرور الجديدة"
            className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700"
            required
          />
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="تأكيد كلمة المرور"
            className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700"
            required
          />
          <Button type="submit" isLoading={isLoading} className="w-full">
            تأكيد إعادة التعيين
          </Button>
        </form>
      </div>
    </motion.div>
  );
};
