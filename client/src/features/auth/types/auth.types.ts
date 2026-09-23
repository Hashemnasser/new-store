// // src/features/auth/types/auth.types.ts

// import type { User } from "../../../types/common.types";

// // ============================================================
// // 🔐 أنواع المصادقة
// // ============================================================

// // طلب تسجيل الدخول
// export interface LoginRequest {
//   email: string;
//   password: string;
// }

// // طلب التسجيل
// export interface RegisterRequest {
//   name: string;
//   email: string;
//   password: string;
// }

// // استجابة تسجيل الدخول
// export interface LoginResponse {
//   token: string;
//   user: User;
// }

// // استجابة التسجيل
// export interface RegisterResponse {
//   token: string;
//   user: User;
// }

// // استجابة الملف الشخصي
// export interface ProfileResponse {
//   user: User;
// }

// // حالة المصادقة في الـ Store
// export interface AuthState {
//   user: User | null;
//   token: string | null;
//   isAuthenticated: boolean;
//   isLoading: boolean;
//   login: (email: string, password: string) => Promise<void>;
//   register: (name: string, email: string, password: string) => Promise<void>;
//   logout: () => void;
//   getUserProfile: () => Promise<void>;
//   updateUser: (user: User) => void;
// }

// src/features/auth/types/auth.types.ts
// src/features/auth/types/auth.types.ts

import type { User } from "../../../types/common.types";

// ============================================================
// 🔐 أنواع المصادقة (متطابقة مع استجابات الباك إند)
// ============================================================

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

// استجابة تسجيل الدخول
export interface LoginResponse {
  success: boolean;
  message: string;
  data: {
    token: string;
    user: User;
  };
}

// استجابة التسجيل
export interface RegisterResponse {
  success: boolean;
  message: string;
  data: {
    token: string;
    user: User;
  };
}

// استجابة الملف الشخصي (البيانات تعيد المستخدم مباشرة)
export interface ProfileResponse {
  success: boolean;
  data: User; // ✅ الباك إند يعيد user داخل data مباشرة
}

// حالة المصادقة في الـ Store
export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  changePassword: (
    currentPassword: string,
    newPassword: string
  ) => Promise<{ message: string }>;
  getUserProfile: () => Promise<void>;
  updateUser: (user: User) => void;
}
