// src/services/coupon.service.ts

import { Coupon, CouponDiscountType } from "@/generated/prisma/client";
import { Decimal } from "@prisma/client/runtime/library";
import { createError } from "../errors/app-error";
import { prisma } from "../lib/prisma";

// ============================================================
// 🔍 التحقق من صحة الكوبون
// ============================================================
export async function validateCoupon(
  code: string,
  orderAmount: number | Decimal
): Promise<Coupon | null> {
  // 1. البحث عن الكوبون بالكود (مع تجاهل حالة الأحرف)
  const coupon = await prisma.coupon.findUnique({
    where: { code: code.toUpperCase().trim() },
  });

  if (!coupon) {
    return null;
  }

  const now = new Date();

  // 2. التحقق من النشاط
  if (!coupon.isActive) {
    return null;
  }

  // 3. التحقق من تاريخ البدء والانتهاء
  if (coupon.startsAt > now || coupon.expiresAt < now) {
    return null;
  }

  // 4. التحقق من عدد مرات الاستخدام
  if (coupon.usageLimit !== null && coupon.usedCount >= coupon.usageLimit) {
    return null;
  }

  // 5. التحقق من الحد الأدنى للطلب
  if (coupon.minOrderValue !== null) {
    const amount =
      typeof orderAmount === "number" ? new Decimal(orderAmount) : orderAmount;
    if (amount.lessThan(coupon.minOrderValue)) {
      return null;
    }
  }

  return coupon;
}

// ============================================================
// 💰 حساب مبلغ الخصم
// ============================================================
export function calculateDiscount(
  orderAmount: Decimal,
  coupon: Coupon
): Decimal {
  let discount = new Decimal(0);

  if (coupon.discountType === "PERCENTAGE") {
    discount = orderAmount.mul(coupon.discountValue).div(100);
    if (
      coupon.maxDiscount !== null &&
      discount.greaterThan(coupon.maxDiscount)
    ) {
      discount = new Decimal(coupon.maxDiscount);
    }
  } else if (coupon.discountType === "FIXED") {
    discount = new Decimal(coupon.discountValue);
    if (discount.greaterThan(orderAmount)) {
      discount = orderAmount;
    }
  }

  return discount;
}

// ============================================================
// 🆕 إنشاء كوبون جديد (للمدير)
// ============================================================
export async function createCoupon(data: {
  code: string;
  discountType: CouponDiscountType;
  discountValue: number;
  description?: string;
  minOrderValue?: number;
  maxDiscount?: number;
  startsAt?: Date;
  expiresAt: Date;
  usageLimit?: number;
  isActive?: boolean;
}) {
  const existing = await prisma.coupon.findUnique({
    where: { code: data.code.toUpperCase().trim() },
  });
  if (existing) {
    throw createError("CONFLICT", "Coupon code already exists");
  }

  return prisma.coupon.create({
    data: {
      code: data.code.toUpperCase().trim(),
      discountType: data.discountType,
      discountValue: data.discountValue,
      description: data.description,
      minOrderValue: data.minOrderValue,
      maxDiscount: data.maxDiscount,
      startsAt: data.startsAt || new Date(),
      expiresAt: data.expiresAt,
      usageLimit: data.usageLimit,
      isActive: data.isActive ?? true,
    },
  });
}

// ============================================================
// ✏️ تحديث كوبون (للمدير)
// ============================================================
export async function updateCoupon(
  id: string,
  data: Partial<{
    code: string;
    discountType: CouponDiscountType;
    discountValue: number;
    description?: string;
    minOrderValue?: number;
    maxDiscount?: number;
    startsAt?: Date;
    expiresAt?: Date;
    usageLimit?: number;
    isActive?: boolean;
  }>
) {
  const coupon = await prisma.coupon.findUnique({ where: { id } });
  if (!coupon) {
    throw createError("NOT_FOUND", "Coupon not found");
  }

  if (data.code) {
    const existing = await prisma.coupon.findFirst({
      where: {
        code: data.code.toUpperCase().trim(),
        NOT: { id },
      },
    });
    if (existing) {
      throw createError("CONFLICT", "Coupon code already exists");
    }
    data.code = data.code.toUpperCase().trim();
  }

  return prisma.coupon.update({
    where: { id },
    data,
  });
}

// ============================================================
// 🗑️ حذف كوبون (للمدير)
// ============================================================
export async function deleteCoupon(id: string) {
  const coupon = await prisma.coupon.findUnique({ where: { id } });
  if (!coupon) {
    throw createError("NOT_FOUND", "Coupon not found");
  }

  await prisma.coupon.delete({ where: { id } });
  return { message: "Coupon deleted successfully" };
}

// ============================================================
// 📋 جلب جميع الكوبونات (للمدير)
// ============================================================
export async function getAllCoupons() {
  return prisma.coupon.findMany({
    orderBy: { createdAt: "desc" },
  });
}

// ============================================================
// 🔍 جلب كوبون بواسطة ID (للمدير)
// ============================================================
export async function getCouponById(id: string) {
  const coupon = await prisma.coupon.findUnique({
    where: { id },
  });

  if (!coupon) {
    throw createError("NOT_FOUND", "Coupon not found");
  }

  return coupon;
}

// ============================================================
// 🔢 زيادة عدد استخدامات الكوبون
// ============================================================
export async function incrementCouponUsage(id: string) {
  return prisma.coupon.update({
    where: { id },
    data: { usedCount: { increment: 1 } },
  });
}
