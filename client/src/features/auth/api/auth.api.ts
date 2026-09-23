// // src/features/auth/api/auth.api.ts

// import http from "../../../services/http";
// import type {
//   LoginRequest,
//   LoginResponse,
//   ProfileResponse,
//   RegisterRequest,
//   RegisterResponse,
// } from "../types/auth.types";

// // ============================================================
// // 🔐 دوال API الخاصة بالمصادقة
// // ============================================================

// export const authApi = {
//   // تسجيل الدخول
//   login: (data: LoginRequest): Promise<LoginResponse> => {
//     return http.post("/auth/signin", data);
//   },

//   // التسجيل
//   register: (data: RegisterRequest): Promise<RegisterResponse> => {
//     return http.post("/auth/signup", data);
//   },

//   // جلب الملف الشخصي
//   getProfile: (): Promise<ProfileResponse> => {
//     return http.get("/auth/profile");
//   },

//   // تحديث الملف الشخصي
//   updateProfile: (data: {
//     name?: string;
//     image?: string;
//   }): Promise<ProfileResponse> => {
//     return http.patch("/auth/profile", data);
//   },

//   // تغيير كلمة المرور
//   changePassword: (data: {
//     currentPassword: string;
//     newPassword: string;
//   }): Promise<{ message: string }> => {
//     return http.post("/auth/change-password", data);
//   },

//   // تسجيل الخروج (محلياً فقط)
//   logout: (): void => {
//     localStorage.removeItem("token");
//     localStorage.removeItem("user");
//   },
// };
// src/features/auth/api/auth.api.ts

import http from "../../../services/http";
import type {
  LoginRequest,
  LoginResponse,
  ProfileResponse,
  RegisterRequest,
  RegisterResponse,
} from "../types/auth.types";

export const authApi = {
  login: (data: LoginRequest): Promise<LoginResponse> => {
    console.log("🔍 authApi.login called with:", data);
    return http.post("/auth/login", data);
  },

  register: (data: RegisterRequest): Promise<RegisterResponse> => {
    console.log("🔍 authApi.register called with:", data);
    return http.post("/auth/signup", data);
  },

  getProfile: (): Promise<ProfileResponse> => {
    console.log("🔍 authApi.getProfile called");
    return http.get("/auth/profile");
  },

  updateProfile: (data: {
    name?: string;
    image?: string;
  }): Promise<ProfileResponse> => {
    console.log("🔍 authApi.updateProfile called with:", data);
    return http.patch("/auth/profile", data);
  },

  changePassword: (data: {
    currentPassword: string;
    newPassword: string;
  }): Promise<{ message: string }> => {
    console.log("🔍 authApi.changePassword called");
    return http.post("/auth/change-password", data);
  },

  logout: (): void => {
    console.log("🔍 authApi.logout called");
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  },
  forgotPassword: (
    email: string
  ): Promise<{ success: boolean; message: string }> => {
    return http.post("/auth/forgot-password", { email });
  },
  resetPassword: (
    token: string,
    newPassword: string
  ): Promise<{ success: boolean; message: string }> => {
    return http.post(`/auth/reset-password/${token}`, { newPassword });
  },
};
