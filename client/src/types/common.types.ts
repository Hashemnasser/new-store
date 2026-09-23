// src/types/common.types.ts

import { TopProduct } from "../features/admin/types/admin.types";
import { Product } from "../features/products/types/product.types";

// ============================================================
// 📦 أنواع مشتركة تستخدم في جميع أنحاء التطبيق
// ============================================================

// 👤 المستخدم
export interface User {
  id: string;
  name: string;
  email: string;
  role: "USER" | "ADMIN";
  image: string | null;
  createdAt: string;
  updatedAt: string;
}

// 📦 استجابة API الموحدة
export interface ApiResponse<T = any> {
  success: boolean;
  data: T;
  message?: string;
}

// 📄 الترقيم
export interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// 🔄 اتجاه الترتيب
export type SortDirection = "asc" | "desc";

// 🧩 الكيان الأساسي (معرف وتواريخ)
export interface BaseEntity {
  id: string;
  createdAt: string;
  updatedAt: string;
}

// 📂 التصنيف
export interface Category {
  id: string;
  name: string;
  slug: string;
  createdAt: string;
  updatedAt: string;
}

// 🛍️ المنتج (مختصر للاستخدام العام)
export interface ProductSummary {
  id: string;
  title: string;
  slug: string;
  price: string;
  images: string;
  averageRating: number;
  reviewsCount: number;
}

// 🛒 عنصر السلة
export interface CartItem {
  id: string;
  productId: string;
  variantId: string;
  quantity: number;
  product: ProductSummary;
  variant: {
    id: string;
    price: number;
    stock: number;
    size?: string;
    color?: string;
    sku: string;
  };
}

// 🛒 السلة
export interface Cart {
  id: string;
  userId: string;
  items: CartItem[];
  total: number;
  itemCount: number;
}

// ❤️ عنصر قائمة الرغبات
export interface WishlistItem {
  id: string;
  productId: string;
  product: ProductSummary;
  createdAt: string;
}

// ❤️ قائمة الرغبات
export interface Wishlist {
  id: string;
  userId: string;
  items: WishlistItem[];
}

// 📦 الطلب
export interface OrderSummary {
  id: string;
  status: "PENDING" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED";
  totalAmount: number;
  createdAt: string;
  itemsCount: number;
}

// ⭐ التقييم
export interface Review {
  id: string;
  rating: number;
  comment: string;
  userId: string;
  productId: string;
  user: Pick<User, "id" | "name" | "image">;
  product?: Pick<Product, "id" | "title" | "slug">;
  createdAt: string;
  updatedAt: string;
}

// 📊 إحصائيات المدير
export interface DashboardStats {
  totalUsers: number;
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
  recentOrders: OrderSummary[];
  topProducts: TopProduct[];
  categoryDistribution: {
    category: string;
    count: number;
  }[];
  // ✅ الحقول الجديدة
  userGrowth: {
    totalUsers: number;
    newUsersLastMonth: number;
    growthRate: number;
  };
  ordersByStatus: {
    pending: number;
    processing: number;
    shipped: number;
    delivered: number;
    cancelled: number;
  };
}

// ============================================================
// 🧩 أنواع الأدوات المساعدة (Utilities)
// ============================================================

export type Locale = "ar-EG" | "en-US" | "fr-FR";
export type Currency = "USD" | "EGP" | "SAR" | "EUR";
