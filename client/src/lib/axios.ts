// // src/lib/axios.ts

// import axios from "axios";
// import { API_URL } from "../config/env";

// // ============================================================
// // 🔧 إنشاء عميل Axios مع الإعدادات الأساسية
// // ============================================================

// export const axiosInstance = axios.create({
//   baseURL: API_URL,
//   timeout: 30000,
//   headers: {
//     "Content-Type": "application/json",
//   },
// });

// // ============================================================
// // ✅ Interceptor للطلبات (إضافة التوكن تلقائياً)
// // ============================================================

// axiosInstance.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem("token");
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// // ============================================================
// // ❌ Interceptor للاستجابات (معالجة الأخطاء المركزية)
// // ============================================================

// axiosInstance.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//     // إذا كان الخطأ 401 (انتهاء التوكن)
//     if (error.response?.status === 401) {
//       localStorage.removeItem("token");
//       localStorage.removeItem("user");
//       window.location.href = "/signin";
//     }

//     return Promise.reject(error);
//   }
// );

// export default axiosInstance;
// src/lib/axios.ts
// src/lib/axios.ts

import axios from "axios";
import { API_URL } from "../config/env";

export const axiosInstance = axios.create({
  baseURL: API_URL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    console.log("🔍 Axios Interceptor - Token from localStorage:", token);
    console.log("🔍 Axios Interceptor - Request URL:", config.url);

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log("✅ Axios Interceptor - Token added to headers");
    } else {
      console.log("❌ Axios Interceptor - No token found");
    }
    return config;
  },
  (error) => {
    console.error("❌ Axios Interceptor - Request error:", error);
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => {
    console.log("✅ Axios Interceptor - Response received:", response.status);
    return response;
  },
  (error) => {
    console.error(
      "❌ Axios Interceptor - Response error:",
      error.response?.status
    );
    if (error.response?.status === 401) {
      console.log("🔍 Axios Interceptor - Unauthorized, clearing token");
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      // لا ننقل تلقائياً، الـ AuthGuard سيتولى ذلك
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
