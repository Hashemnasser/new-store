"use strict";
// server/src/controllers/coupon.controller.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateCouponHandler = exports.deleteCouponHandler = exports.updateCouponHandler = exports.createCouponHandler = exports.getCouponByIdHandler = exports.getAllCouponsHandler = void 0;
const app_error_1 = require("../errors/app-error.js");
const product_validator_1 = require("../validators/product.validator.js");
const library_1 = require("@prisma/client/runtime/library");
const coupon_service_1 = require("../services/coupon.service");
const asyncHandler_1 = require("../utils/asyncHandler");
// ============================================================
// 📋 دوال المدير (إدارة الكوبونات)
// ============================================================
exports.getAllCouponsHandler = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const coupons = await (0, coupon_service_1.getAllCoupons)();
    res.json({ success: true, data: coupons });
});
exports.getCouponByIdHandler = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { id } = product_validator_1.idParamsSchema.parse(req.params);
    const coupon = await (0, coupon_service_1.getCouponById)(id);
    res.json({ success: true, data: coupon });
});
exports.createCouponHandler = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const data = req.body;
    // تحويل التواريخ من string إلى Date
    const couponData = {
        ...data,
        startsAt: new Date(data.startsAt),
        expiresAt: new Date(data.expiresAt),
    };
    const coupon = await (0, coupon_service_1.createCoupon)(couponData);
    res.status(201).json({ success: true, data: coupon });
});
exports.updateCouponHandler = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { id } = product_validator_1.idParamsSchema.parse(req.params);
    const data = req.body;
    // تحويل التواريخ إن وجدت
    if (data.startsAt)
        data.startsAt = new Date(data.startsAt);
    if (data.expiresAt)
        data.expiresAt = new Date(data.expiresAt);
    const coupon = await (0, coupon_service_1.updateCoupon)(id, data);
    res.json({ success: true, data: coupon });
});
exports.deleteCouponHandler = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { id } = product_validator_1.idParamsSchema.parse(req.params);
    const result = await (0, coupon_service_1.deleteCoupon)(id);
    res.json({ success: true, ...result });
});
// ============================================================
// 🛒 دوال العميل (التحقق من الكوبون)
// ============================================================
exports.validateCouponHandler = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { code, orderAmount } = req.body; // نمرر إجمالي السلة من العميل
    if (!code || typeof code !== "string") {
        throw (0, app_error_1.createError)("BAD_REQUEST", "كود الخصم مطلوب");
    }
    if (orderAmount === undefined || typeof orderAmount !== "number") {
        throw (0, app_error_1.createError)("BAD_REQUEST", "إجمالي السلة مطلوب");
    }
    const coupon = await (0, coupon_service_1.validateCoupon)(code, orderAmount);
    if (!coupon) {
        throw (0, app_error_1.createError)("BAD_REQUEST", "كوبون غير صالح أو منتهي الصلاحية");
    }
    // ✅ حساب مبلغ الخصم هنا
    const discountAmount = (0, coupon_service_1.calculateDiscount)(new library_1.Decimal(orderAmount), coupon);
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
});
