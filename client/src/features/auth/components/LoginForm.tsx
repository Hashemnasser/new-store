// // src/features/auth/components/LoginForm.tsx

// import { zodResolver } from "@hookform/resolvers/zod";
// import { useState } from "react";
// import { useForm } from "react-hook-form";
// import { Link, useNavigate } from "react-router-dom";
// import { toast } from "sonner";
// import { ROUTES } from "../../../app/router/route.constants";
// import { useAuth } from "../hooks/useAuth";
// import { LoginFormValues, loginSchema } from "../schemas/login.schema";

// export const LoginForm = () => {
//   const [isLoading, setIsLoading] = useState(false);
//   const { login } = useAuth();
//   const navigate = useNavigate();

//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//   } = useForm<LoginFormValues>({
//     resolver: zodResolver(loginSchema),
//   });

//   const onSubmit = async (data: LoginFormValues) => {
//     setIsLoading(true);
//     try {
//       await login(data.email, data.password);
//       toast.success("تم تسجيل الدخول بنجاح");
//       navigate(ROUTES.HOME, { replace: true });
//     } catch (error: any) {
//       toast.error(
//         error.response?.data?.message || "حدث خطأ أثناء تسجيل الدخول"
//       );
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
//       {/* البريد الإلكتروني */}
//       <div>
//         <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
//           البريد الإلكتروني
//         </label>
//         <input
//           type="email"
//           {...register("email")}
//           className="mt-1 w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
//           placeholder="example@email.com"
//         />
//         {errors.email && (
//           <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
//         )}
//       </div>

//       {/* كلمة المرور */}
//       <div>
//         <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
//           كلمة المرور
//         </label>
//         <input
//           type="password"
//           {...register("password")}
//           className="mt-1 w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
//           placeholder="••••••••"
//         />
//         {errors.password && (
//           <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
//         )}
//       </div>

//       {/* زر تسجيل الدخول */}
//       <button
//         type="submit"
//         disabled={isLoading}
//         className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
//       >
//         {isLoading ? "جاري تسجيل الدخول..." : "تسجيل الدخول"}
//       </button>

//       {/* رابط التسجيل */}
//       <p className="text-center text-sm text-gray-600 dark:text-gray-400">
//         ليس لديك حساب؟{" "}
//         <Link to="/register" className="text-blue-600 hover:underline">
//           سجل الآن
//         </Link>
//       </p>
//     </form>
//   );
// };
// src/features/auth/components/LoginForm.tsx

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { ROUTES } from "../../../app/router/route.constants";
import { useAuth } from "../hooks/useAuth";
import { LoginFormValues, loginSchema } from "../schemas/login.schema";

export const LoginForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormValues) => {
    console.log("🔍 LoginForm - onSubmit called");
    console.log("🔍 LoginForm - Email:", data.email);

    setIsLoading(true);
    try {
      await login(data.email, data.password);
      console.log("✅ LoginForm - Login successful");

      toast.success("تم تسجيل الدخول بنجاح");
      navigate(ROUTES.HOME, { replace: true });
    } catch (error: any) {
      console.error("❌ LoginForm - Login error:", error);
      toast.error(
        error.response?.data?.message || "حدث خطأ أثناء تسجيل الدخول"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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

      {/* زر تسجيل الدخول */}
      <button
        type="submit"
        disabled={isLoading}
        className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? "جاري تسجيل الدخول..." : "تسجيل الدخول"}
      </button>

      {/* رابط التسجيل */}
      <p className="text-center text-sm text-gray-600 dark:text-gray-400">
        ليس لديك حساب؟{" "}
        <Link to="/register" className="text-blue-600 hover:underline">
          سجل الآن
        </Link>
      </p>
      <p className="text-center text-sm mt-4">
        <Link to="/forgot-password" className="text-blue-600 hover:underline">
          نسيت كلمة المرور؟
        </Link>
      </p>
    </form>
  );
};
