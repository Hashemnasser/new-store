// src/features/admin/hooks/useAdmin.ts

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { DashboardStats } from "../../../types/common.types";
import { adminApi } from "../api/admin.api";
import type { LowStockProduct, SalesAnalytics } from "../types/admin.types";

// ============================================================
// 📊 Hooks الخاصة بلوحة المدير
// ============================================================

// جلب إحصائيات لوحة التحكم
export const useDashboardStats = () => {
  return useQuery<DashboardStats>({
    queryKey: ["admin", "dashboard", "stats"],
    queryFn: (): Promise<DashboardStats> => adminApi.getDashboardStats(),
    staleTime: 5 * 60 * 1000, // 5 دقائق
  });
};

// جلب تحليلات المبيعات
export const useSalesAnalytics = (days: number = 30) => {
  return useQuery<SalesAnalytics>({
    queryKey: ["admin", "analytics", "sales", days],
    queryFn: () => adminApi.getSalesAnalytics(days),
    staleTime: 5 * 60 * 1000,
  });
};

// ✅ جلب المنتجات منخفضة المخزون
export const useLowStockProducts = (threshold: number = 5) => {
  return useQuery<LowStockProduct[]>({
    queryKey: ["admin", "low-stock", threshold],
    queryFn: () => adminApi.getLowStockProducts(threshold),
    staleTime: 2 * 60 * 1000, // 2 دقيقة
  });
};
// ✅ إعادة ملء المخزون (Mutation)
export const useReplenishStock = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      variantId,
      quantity,
    }: {
      variantId: string;
      quantity?: number;
    }) => adminApi.replenishStock(variantId, quantity),
    onSuccess: (data) => {
      // إبطال استعلامات المخزون المنخفض والمنتجات لتحديثها
      queryClient.invalidateQueries({ queryKey: ["admin", "low-stock"] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success(data.data.message || "تم تحديث المخزون بنجاح");
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message || "حدث خطأ أثناء تحديث المخزون"
      );
    },
  });
};
