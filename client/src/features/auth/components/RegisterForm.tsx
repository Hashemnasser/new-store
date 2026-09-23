// src/features/auth/components/RegisterForm.tsx

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "../hooks/useAuth";
import { RegisterFormValues, registerSchema } from "../schemas/register.schema";

export const RegisterForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormValues) => {
    setIsLoading(true);
    try {
      await registerUser(data.name, data.email, data.password);
      toast.success("تم إنشاء الحساب بنجاح");
      navigate("/");
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "حدث خطأ أثناء إنشاء الحساب"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* الاسم */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          الاسم الكامل
        </label>
        <input
          type="text"
          {...register("name")}
          className="mt-1 w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
          placeholder="أحمد محمد"
        />
        {errors.name && (
          <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
        )}
      </div>

      {/* البريد الإلكتروني */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          البريد الإلكتروني
        </label>
        <input
          type="email"
          {...register("email")}
          className="mt-1 w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
          placeholder="example@email.com"
        />
        {errors.email && (
          <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
        )}
      </div>

      {/* كلمة المرور */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          كلمة المرور
        </label>
        <input
          type="password"
          {...register("password")}
          className="mt-1 w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
          placeholder="••••••••"
        />
        {errors.password && (
          <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
        )}
      </div>

      {/* تأكيد كلمة المرور */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          تأكيد كلمة المرور
        </label>
        <input
          type="password"
          {...register("confirmPassword")}
          className="mt-1 w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
          placeholder="••••••••"
        />
        {errors.confirmPassword && (
          <p className="mt-1 text-sm text-red-600">
            {errors.confirmPassword.message}
          </p>
        )}
      </div>

      {/* زر التسجيل */}
      <button
        type="submit"
        disabled={isLoading}
        className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? "جاري إنشاء الحساب..." : "إنشاء حساب"}
      </button>

      {/* رابط تسجيل الدخول */}
      <p className="text-center text-sm text-gray-600 dark:text-gray-400">
        لديك حساب بالفعل؟{" "}
        <Link to="/login" className="text-blue-600 hover:underline">
          تسجيل الدخول
        </Link>
      </p>
    </form>
  );
};
