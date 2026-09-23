// server/src/controllers/coupon.controller.ts

import { createError } from "@/errors/app-error";
import { idParamsSchema } from "@/validators/product.validator";
import { Decimal } from "@prisma/client/runtime/library";
import { Request, Response } from "express";
import {
  calculateDiscount,
  createCoupon,
  deleteCoupon,
  getAllCoupons,
  getCouponById,
  updateCoupon,
  validateCoupon,
} from "../services/coupon.service";
import { asyncHandler } from "../utils/asyncHandler";

// ============================================================
// 📋 دوال المدير (إدارة الكوبونات)
// ============================================================

export const getAllCouponsHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const coupons = await getAllCoupons();
    res.json({ success: true, data: coupons });
  }
);

export const getCouponByIdHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = idParamsSchema.parse(req.params);
    const coupon = await getCouponById(id);
    res.json({ success: true, data: coupon });
  }
);

export const createCouponHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const data = req.body;
    // تحويل التواريخ من string إلى Date
    const couponData = {
      ...data,
      startsAt: new Date(data.startsAt),
      expiresAt: new Date(data.expiresAt),
    };
    const coupon = await createCoupon(couponData);
    res.status(201).json({ success: true, data: coupon });
  }
);

export const updateCouponHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = idParamsSchema.parse(req.params);
    const data = req.body;
    // تحويل التواريخ إن وجدت
    if (data.startsAt) data.startsAt = new Date(data.startsAt);
    if (data.expiresAt) data.expiresAt = new Date(data.expiresAt);
    const coupon = await updateCoupon(id, data);
    res.json({ success: true, data: coupon });
  }
);

export const deleteCouponHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = idParamsSchema.parse(req.params);
    const result = await deleteCoupon(id);
    res.json({ success: true, ...result });
  }
);

// ============================================================
// 🛒 دوال العميل (التحقق من الكوبون)
// ============================================================

export const validateCouponHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const { code, orderAmount } = req.body; // نمرر إجمالي السلة من العميل
    if (!code || typeof code !== "string") {
      throw createError("BAD_REQUEST", "كود الخصم مطلوب");
    }
    if (orderAmount === undefined || typeof orderAmount !== "number") {
      throw createError("BAD_REQUEST", "إجمالي السلة مطلوب");
    }

    const coupon = await validateCoupon(code, orderAmount);
    if (!coupon) {
      throw createError("BAD_REQUEST", "كوبون غير صالح أو منتهي الصلاحية");
    }
    // ✅ حساب مبلغ الخصم هنا
    const discountAmount = calculateDiscount(new Decimal(orderAmount), coupon);

    res.json({
      success: true,
      data: {
        code: coupon.code,
        discountAmount: discountAmount,
        discountType: coupon.discountType,
        discountValue: coupon.discountValue,
        message: `تم تطبيق الخصم بنجاح!`,
      },
    });
  }
);
