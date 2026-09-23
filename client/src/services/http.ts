// // src/services/http.ts

import type { AxiosRequestConfig } from "axios";
import axiosInstance from "../lib/axios";

// ============================================================
// 📦 أنواع الـ API Responses الموحدة
// ============================================================

export interface ApiResponse<T = any> {
  success: boolean;
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

// ============================================================
// 🔧 دوال HTTP الأساسية
// ============================================================

export const http = {
  get: async <T>(url: string, config?: AxiosRequestConfig): Promise<T> => {
    const response = await axiosInstance.get<T>(url, config);
    return response.data;
  },

  post: async <T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<T> => {
    const response = await axiosInstance.post<T>(url, data, config);

    return response.data;
  },

  put: async <T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<T> => {
    const response = await axiosInstance.put<T>(url, data, config);
    return response.data;
  },

  patch: async <T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<T> => {
    const response = await axiosInstance.patch<T>(url, data, config);
    return response.data;
  },

  delete: async <T>(url: string, config?: AxiosRequestConfig): Promise<T> => {
    const response = await axiosInstance.delete<T>(url, config);
    return response.data;
  },
};

export default http;
// src/services/http.ts

// import type { AxiosRequestConfig } from "axios";
// import axiosInstance from "../lib/axios";

// export interface ApiResponse<T = any> {
//   success: boolean;
//   data: T;
//   message?: string;
// }

// export interface PaginatedResponse<T> {
//   data: T[];
//   pagination: {
//     total: number;
//     page: number;
//     limit: number;
//     totalPages: number;
//   };
// }

// export const http = {
//   get: async <T = any>(
//     url: string,
//     config?: AxiosRequestConfig
//   ): Promise<T> => {
//     console.log("🔍 http.get:", url);
//     const response = await axiosInstance.get<T>(url, config);
//     console.log("✅ http.get response:", response.data);
//     return response.data;
//   },

//   post: async <T = any>(
//     url: string,
//     data?: any,
//     config?: AxiosRequestConfig
//   ): Promise<T> => {
//     console.log("🔍 http.post:", url, data);
//     const response = await axiosInstance.post<T>(url, data, config);
//     console.log("✅ http.post response:", response.data);
//     return response.data;
//   },

//   put: async <T = any>(
//     url: string,
//     data?: any,
//     config?: AxiosRequestConfig
//   ): Promise<T> => {
//     console.log("🔍 http.put:", url, data);
//     const response = await axiosInstance.put<T>(url, data, config);
//     console.log("✅ http.put response:", response.data);
//     return response.data;
//   },

//   patch: async <T = any>(
//     url: string,
//     data?: any,
//     config?: AxiosRequestConfig
//   ): Promise<T> => {
//     console.log("🔍 http.patch:", url, data);
//     const response = await axiosInstance.patch<T>(url, data, config);
//     console.log("✅ http.patch response:", response.data);
//     return response.data;
//   },

//   delete: async <T = any>(
//     url: string,
//     config?: AxiosRequestConfig
//   ): Promise<T> => {
//     console.log("🔍 http.delete:", url);
//     const response = await axiosInstance.delete<T>(url, config);
//     console.log("✅ http.delete response:", response.data);
//     return response.data;
//   },
// };

// export default http;
