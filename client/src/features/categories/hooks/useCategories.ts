// src/features/categories/hooks/useCategories.ts

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { categoriesApi } from "../api/categories.api";
import type { Category } from "../types/category.types";

// ============================================================
// 🪝 Hooks الخاصة بالتصنيفات
// ============================================================

// جلب جميع التصنيفات
export const useCategories = () => {
  return useQuery<Category[]>({
    queryKey: ["categories"],
    queryFn: () => categoriesApi.getAll(),
    staleTime: 5 * 60 * 1000,
  });
};

// إنشاء تصنيف جديد (للمدير فقط)
export const useCreateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation<Category, Error, { name: string }>({
    mutationFn: (data) => categoriesApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      toast.success("تم إضافة التصنيف بنجاح");
    },
    onError: (error: Error) => {
      toast.error(error.message || "حدث خطأ أثناء إضافة التصنيف");
    },
  });
};

// تحديث تصنيف (للمدير فقط)
export const useUpdateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation<Category, Error, { id: string; data: { name: string } }>({
    mutationFn: ({ id, data }) => categoriesApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      toast.success("تم تحديث التصنيف بنجاح");
    },
    onError: (error: Error) => {
      toast.error(error.message || "حدث خطأ أثناء تحديث التصنيف");
    },
  });
};

// حذف تصنيف (للمدير فقط)
export const useDeleteCategory = () => {
  const queryClient = useQueryClient();

  return useMutation<{ message: string }, Error, string>({
    mutationFn: (id) => categoriesApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      toast.success("تم حذف التصنيف بنجاح");
    },
    onError: (error: Error) => {
      toast.error(error.message || "حدث خطأ أثناء حذف التصنيف");
    },
  });
};
