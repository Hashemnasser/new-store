// client/src/features/coupons/api/coupons.api.ts

import http from "../../../services/http";
import type {
  Coupon,
  CouponsResponse,
  CreateCouponPayload,
  UpdateCouponPayload,
  ValidateCouponRequest,
  ValidateCouponResponse,
} from "../types/coupon.types";

// ============================================================
// 📦 دوال API الخاصة بالكوبونات
// ============================================================

export const couponsApi = {
  // 🔍 التحقق من صحة كوبون (للاستخدام في صفحة الدفع)
  validateCoupon: (
    data: ValidateCouponRequest
  ): Promise<ValidateCouponResponse> => {
    return http.post<ValidateCouponResponse>("/coupons/validate", data);
  },

  // 📋 جلب جميع الكوبونات (للمدير)
  getAllCoupons: (): Promise<CouponsResponse> => {
    return http.get<CouponsResponse>("/admin/coupons");
  },

  // 🔍 جلب كوبون محدد (للمدير)
  getCouponById: (id: string): Promise<{ success: boolean; data: Coupon }> => {
    return http.get<{ success: boolean; data: Coupon }>(`/admin/coupons/${id}`);
  },

  // ➕ إنشاء كوبون جديد (للمدير)
  createCoupon: (
    data: CreateCouponPayload
  ): Promise<{ success: boolean; data: Coupon }> => {
    return http.post<{ success: boolean; data: Coupon }>(
      "/admin/coupons",
      data
    );
  },

  // ✏️ تحديث كوبون (للمدير)
  updateCoupon: (
    id: string,
    data: UpdateCouponPayload
  ): Promise<{ success: boolean; data: Coupon }> => {
    return http.patch<{ success: boolean; data: Coupon }>(
      `/admin/coupons/${id}`,
      data
    );
  },

  // 🗑️ حذف كوبون (للمدير)
  deleteCoupon: (
    id: string
  ): Promise<{ success: boolean; message: string }> => {
    return http.delete<{ success: boolean; message: string }>(
      `/admin/coupons/${id}`
    );
  },
};
