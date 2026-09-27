"use strict";
// server/src/validators/coupon.validator.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateCouponSchema = exports.validateCouponSchema = exports.createCouponSchema = void 0;
const zod_1 = require("zod");
exports.createCouponSchema = zod_1.z.object({
    code: zod_1.z.string().min(3, "كود الخصم يجب أن يكون 3 أحرف على الأقل").max(50),
    description: zod_1.z.string().optional(),
    discountType: zod_1.z.enum(["PERCENTAGE", "FIXED"]),
    discountValue: zod_1.z.number().positive("قيمة الخصم يجب أن تكون موجبة"),
    minOrderValue: zod_1.z.number().positive().optional(),
    maxDiscount: zod_1.z.number().positive().optional(),
    startsAt: zod_1.z.string().datetime({ offset: true }),
    expiresAt: zod_1.z.string().datetime({ offset: true }),
    usageLimit: zod_1.z.number().int().positive().optional(),
    isActive: zod_1.z.boolean().optional(),
});
exports.validateCouponSchema = zod_1.z.object({
    code: zod_1.z.string().min(1, "كود الخصم مطلوب"),
    orderAmount: zod_1.z.number("المبلغ الاجمالي للطلب مطلوبة"),
});
exports.updateCouponSchema = exports.createCouponSchema.partial();
