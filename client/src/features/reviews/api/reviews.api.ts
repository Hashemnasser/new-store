// src/features/reviews/api/reviews.api.ts

import http from "../../../services/http";
import type {
  CreateReviewPayload,
  Review,
  UpdateReviewPayload,
} from "../types/review.types";

// ============================================================
// ⭐ دوال API الخاصة بالتقييمات
// ============================================================

export const reviewsApi = {
  // جلب تقييمات منتج معين
  getProductReviews: (productId: string): Promise<Review[]> => {
    return http.get<Review[]>(`/reviews/product/${productId}`);
  },

  // جلب تقييمات المستخدم الحالي
  getUserReviews: (): Promise<Review[]> => {
    return http.get<Review[]>("/reviews/me");
  },

  // جلب تقييم محدد
  getReviewById: (id: string): Promise<Review> => {
    return http.get<Review>(`/reviews/${id}`);
  },

  // إنشاء تقييم جديد
  createReview: (data: CreateReviewPayload): Promise<Review> => {
    return http.post<Review>("/reviews", data);
  },

  // تحديث تقييم
  updateReview: (id: string, data: UpdateReviewPayload): Promise<Review> => {
    return http.patch<Review>(`/reviews/${id}`, data);
  },

  // حذف تقييم
  deleteReview: (id: string): Promise<{ message: string }> => {
    return http.delete<{ message: string }>(`/reviews/${id}`);
  },

  // ============================================================
  // 🔐 مسارات المدير (Admin)
  // ============================================================

  // جلب جميع التقييمات (للمدير)
  getAllReviews: (): Promise<Review[]> => {
    return http
      .get<{ success: boolean; data: Review[] }>("/reviews/admin/all")
      .then((res) => res.data);
  },

  // حذف تقييم (للمدير)
  deleteReviewAsAdmin: (id: string): Promise<{ message: string }> => {
    return http.delete<{ message: string }>(`/reviews/admin/${id}`);
  },
};
