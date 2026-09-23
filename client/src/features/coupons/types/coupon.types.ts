// client/src/features/coupons/types/coupon.types.ts

// ============================================================
// 📦 أنواع الكوبونات والخصومات
// ============================================================

export type CouponDiscountType = "PERCENTAGE" | "FIXED";

export interface Coupon {
  id: string;
  code: string;
  description: string | null;
  discountType: CouponDiscountType;
  discountValue: number;
  minOrderValue: number | null;
  maxDiscount: number | null;
  startsAt: string | Date;
  expiresAt: string | Date;
  usageLimit: number | null;
  usedCount: number;
  isActive: boolean;
  createdAt: string | Date;
  updatedAt: string | Date;
}

// ✅ معاملات إنشاء كوبون جديد
export interface CreateCouponPayload {
  code: string;
  description?: string;
  discountType: CouponDiscountType;
  discountValue: number;
  minOrderValue?: number;
  maxDiscount?: number;
  startsAt: Date;
  expiresAt: Date;
  usageLimit?: number;
  isActive?: boolean;
}

// ✅ معاملات تحديث كوبون
export interface UpdateCouponPayload {
  code?: string;
  description?: string;
  discountType?: CouponDiscountType;
  discountValue?: number;
  minOrderValue?: number;
  maxDiscount?: number;
  startsAt?: Date;
  expiresAt?: Date;
  usageLimit?: number;
  isActive?: boolean;
}

// ✅ التحقق من صحة كوبون (الطلب)
export interface ValidateCouponRequest {
  code: string;
  orderAmount: number;
}

// ✅ التحقق من صحة كوبون (الاستجابة)
export interface ValidateCouponResponse {
  success: boolean;
  data: {
    coupon: Coupon;
    discountAmount: number;
    finalAmount: number;
  };
  message?: string;
}

// ✅ استجابة قائمة الكوبونات
export interface CouponsResponse {
  success: boolean;
  data: Coupon[];
  message?: string;
}
