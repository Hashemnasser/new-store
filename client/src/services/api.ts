// src/services/api.ts

import http from "./http";

// ============================================================
// 📦 تصدير دوال API الأساسية (سلة، منتجات، إلخ)
// ============================================================

// 🛍️ المنتجات
export const productApi = {
  getAll: (params?: any) => http.get("/products", { params }),
  getBySlug: (slug: string) => http.get(`/product/${slug}`),
  create: (data: any) => http.post("/products", data),
  update: (slug: string, data: any) => http.patch(`/product/${slug}`, data),
  delete: (slug: string) => http.delete(`/product/${slug}`),
};

// 📂 التصنيفات
export const categoryApi = {
  getAll: () => http.get("/categories"),
  create: (data: any) => http.post("/categories", data),
};

// 🛒 السلة
export const cartApi = {
  get: () => http.get("/cart"),
  add: (data: any) => http.post("/cart", data),
  update: (id: string, data: any) => http.patch(`/cart/${id}`, data),
  remove: (id: string) => http.delete(`/cart/${id}`),
  clear: () => http.delete("/cart"),
};

// 📦 الطلبات
export const orderApi = {
  getAll: () => http.get("/orders"),
  getById: (id: string) => http.get(`/orders/${id}`),
  create: (data: any) => http.post("/orders", data),
  updateStatus: (id: string, data: any) =>
    http.patch(`/orders/admin/${id}/status`, data),
};

// ❤️ قائمة الرغبات
export const wishlistApi = {
  get: () => http.get("/wishlist"),
  add: (data: any) => http.post("/wishlist", data),
  remove: (productId: string) => http.delete(`/wishlist/${productId}`),
  check: (productId: string) => http.get(`/wishlist/check/${productId}`),
  clear: () => http.delete("/wishlist"),
};

// ⭐ التقييمات
export const reviewApi = {
  getByProduct: (productId: string) =>
    http.get(`/reviews/product/${productId}`),
  create: (data: any) => http.post("/reviews", data),
  update: (id: string, data: any) => http.patch(`/reviews/${id}`, data),
  delete: (id: string) => http.delete(`/reviews/${id}`),
};

// 👤 المستخدمين
export const userApi = {
  getProfile: () => http.get("/users/me"),
  updateProfile: (data: any) => http.patch("/users/me", data),
  deleteProfile: () => http.delete("/users/me"),
  getAll: (params?: any) => http.get("/users/admin/all", { params }),
  getById: (id: string) => http.get(`/users/admin/${id}`),
  updateById: (id: string, data: any) => http.patch(`/users/admin/${id}`, data),
  updateRole: (id: string, data: any) =>
    http.patch(`/users/admin/${id}/role`, data),
  deleteById: (id: string) => http.delete(`/users/admin/${id}`),
};

// 📊 المدير
export const adminApi = {
  getDashboardStats: () => http.get("/admin/dashboard"),
  getSalesAnalytics: (days?: number) =>
    http.get("/admin/analytics/sales", { params: { days } }),
};
