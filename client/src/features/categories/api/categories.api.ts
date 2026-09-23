// src/features/categories/api/categories.api.ts

import http from "../../../services/http";
import type { Category } from "../types/category.types";

// ============================================================
// 📂 دوال API الخاصة بالتصنيفات
// ============================================================

export const categoriesApi = {
  // جلب جميع التصنيفات
  getAll: (): Promise<Category[]> => {
    return http.get("/categories");
  },

  // إنشاء تصنيف جديد (للمدير فقط)
  create: (data: { name: string }): Promise<Category> => {
    return http.post("/categories", data);
  },

  // تحديث تصنيف (للمدير فقط)
  update: (id: string, data: { name: string }): Promise<Category> => {
    console.log("apiiiiiiiiiiiiiiiiiiiiiiiiiiiiiii");
    const ctooo = http.patch(`/categories/${id}`, data);
    console.log("catooooooooooooooo:::", ctooo);
    return ctooo;
  },

  // حذف تصنيف (للمدير فقط)
  delete: (id: string): Promise<{ message: string }> => {
    return http.delete(`/categories/${id}`);
  },
};
