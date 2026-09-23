// src/features/admin/types/admin.types.ts

import { DashboardStats } from "../../../types/common.types";

// ============================================================
// 📊 أنواع لوحة المدير
// ============================================================

// الإحصائيات العامة
// export interface DashboardStats {
//   success: boolean;
//   data: {
//     totalUsers: number;
//     totalProducts: number;
//     totalOrders: number;
//     totalRevenue: number;
//   };
// }

// بيانات الرسم البياني للمبيعات
export interface SalesDataPoint {
  date: string;
  total: number;
}

// تحليلات المبيعات
export interface SalesAnalytics {
  totalOrders: number;
  totalRevenue: number;
  salesData: SalesDataPoint[];
}

// توزيع المنتجات حسب التصنيف
export interface CategoryDistribution {
  category: string;
  count: number;
}

// المنتج الأكثر مبيعاً
export interface TopProduct {
  productId: string;
  title: string;
  slug: string;
  image: string;
  totalSold: number;
  totalRevenue: string;
  price: string;
}

// بيانات لوحة المدير الكاملة
export interface DashboardData {
  stats: DashboardStats;
  // recentOrders: Order[];
  // topProducts: TopProduct[];
  // categoryDistribution: CategoryDistribution[];
  salesAnalytics: SalesAnalytics;
}

// ✅ نوع المنتج منخفض المخزون
export interface LowStockProduct {
  variantId: string;
  sku: string;
  stock: number;
  productId: string;
  productTitle: string;
  slug: string;
  image: string;
}
