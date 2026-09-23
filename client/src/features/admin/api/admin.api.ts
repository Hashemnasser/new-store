// src/features/admin/api/admin.api.ts

import http from "../../../services/http";
import { DashboardStats } from "../../../types/common.types";
import type { LowStockProduct, SalesAnalytics } from "../types/admin.types";

// ============================================================
// 📊 دوال API الخاصة بلوحة المدير
// ============================================================

export const adminApi = {
  // جلب إحصائيات لوحة التحكم
  getDashboardStats: (): Promise<DashboardStats> => {
    return http
      .get<{ success: boolean; data: DashboardStats }>("/admin/dashboard")
      .then((res) => res.data);
  },

  // جلب تحليلات المبيعات
  getSalesAnalytics: (days: number = 30): Promise<SalesAnalytics> => {
    return http
      .get<{ success: boolean; data: SalesAnalytics }>(
        "/admin/analytics/sales",
        {
          params: { days },
        }
      )
      .then((res) => res.data);
  },

  // ✅ جلب المنتجات منخفضة المخزون
  getLowStockProducts: (threshold: number = 5): Promise<LowStockProduct[]> => {
    return http
      .get<{ success: boolean; data: LowStockProduct[] }>("/admin/low-stock", {
        params: { threshold },
      })
      .then((res) => res.data);
  },
  // ✅ إعادة ملء المخزون
  replenishStock: (
    variantId: string,
    quantity: number = 10
  ): Promise<{
    success: boolean;
    data: {
      variantId: string;
      newStock: number;
      productTitle: string;
      message: string;
    };
  }> => {
    return http.patch(`/admin/replenish/${variantId}`, { quantity });
  },
  // جلب جميع البيانات للوحة التحكم (دفعة واحدة)
  //   getDashboardData: (): Promise<{
  //     stats: DashboardStats;
  //     recentOrders: Order[];
  //     topProducts: TopProduct[];
  //     categoryDistribution: CategoryDistribution[];
  //   }> => {
  //     return http.get("/admin/dashboard/data");
  //   },
};
