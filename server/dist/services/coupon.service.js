"use strict";
// src/services/coupon.service.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateCoupon = validateCoupon;
exports.calculateDiscount = calculateDiscount;
exports.createCoupon = createCoupon;
exports.updateCoupon = updateCoupon;
exports.deleteCoupon = deleteCoupon;
exports.getAllCoupons = getAllCoupons;
exports.getCouponById = getCouponById;
exports.incrementCouponUsage = incrementCouponUsage;
const library_1 = require("@prisma/client/runtime/library");
const app_error_1 = require("../errors/app-error");
const prisma_1 = require("../lib/prisma");
// ============================================================
// 🔍 التحقق من صحة الكوبون
// ============================================================
async function validateCoupon(code, orderAmount) {
    // 1. البحث عن الكوبون بالكود (مع تجاهل حالة الأحرف)
    const coupon = await prisma_1.prisma.coupon.findUnique({
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
        const amount = typeof orderAmount === "number" ? new library_1.Decimal(orderAmount) : orderAmount;
        if (amount.lessThan(coupon.minOrderValue)) {
            return null;
        }
    }
    return coupon;
}
// ============================================================
// 💰 حساب مبلغ الخصم
// ============================================================
function calculateDiscount(orderAmount, coupon) {
    let discount = new library_1.Decimal(0);
    if (coupon.discountType === "PERCENTAGE") {
        discount = orderAmount.mul(coupon.discountValue).div(100);
        if (coupon.maxDiscount !== null &&
            discount.greaterThan(coupon.maxDiscount)) {
            discount = new library_1.Decimal(coupon.maxDiscount);
        }
    }
    else if (coupon.discountType === "FIXED") {
        discount = new library_1.Decimal(coupon.discountValue);
        if (discount.greaterThan(orderAmount)) {
            discount = orderAmount;
        }
    }
    return discount;
}
// ============================================================
// 🆕 إنشاء كوبون جديد (للمدير)
// ============================================================
async function createCoupon(data) {
    const existing = await prisma_1.prisma.coupon.findUnique({
        where: { code: data.code.toUpperCase().trim() },
    });
    if (existing) {
        throw (0, app_error_1.createError)("CONFLICT", "Coupon code already exists");
    }
    return prisma_1.prisma.coupon.create({
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
async function updateCoupon(id, data) {
    const coupon = await prisma_1.prisma.coupon.findUnique({ where: { id } });
    if (!coupon) {
        throw (0, app_error_1.createError)("NOT_FOUND", "Coupon not found");
    }
    if (data.code) {
        const existing = await prisma_1.prisma.coupon.findFirst({
            where: {
                code: data.code.toUpperCase().trim(),
                NOT: { id },
            },
        });
        if (existing) {
            throw (0, app_error_1.createError)("CONFLICT", "Coupon code already exists");
        }
        data.code = data.code.toUpperCase().trim();
    }
    return prisma_1.prisma.coupon.update({
        where: { id },
        data,
    });
}
// ============================================================
// 🗑️ حذف كوبون (للمدير)
// ============================================================
async function deleteCoupon(id) {
    const coupon = await prisma_1.prisma.coupon.findUnique({ where: { id } });
    if (!coupon) {
        throw (0, app_error_1.createError)("NOT_FOUND", "Coupon not found");
    }
    await prisma_1.prisma.coupon.delete({ where: { id } });
    return { message: "Coupon deleted successfully" };
}
// ============================================================
// 📋 جلب جميع الكوبونات (للمدير)
// ============================================================
async function getAllCoupons() {
    return prisma_1.prisma.coupon.findMany({
        orderBy: { createdAt: "desc" },
    });
}
// ============================================================
// 🔍 جلب كوبون بواسطة ID (للمدير)
// ============================================================
async function getCouponById(id) {
    const coupon = await prisma_1.prisma.coupon.findUnique({
        where: { id },
    });
    if (!coupon) {
        throw (0, app_error_1.createError)("NOT_FOUND", "Coupon not found");
    }
    return coupon;
}
// ============================================================
// 🔢 زيادة عدد استخدامات الكوبون
// ============================================================
async function incrementCouponUsage(id) {
    return prisma_1.prisma.coupon.update({
        where: { id },
        data: { usedCount: { increment: 1 } },
    });
}
