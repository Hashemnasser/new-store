// server/src/validators/coupon.validator.ts

import { z } from "zod";

export const createCouponSchema = z.object({
  code: z.string().min(3, "كود الخصم يجب أن يكون 3 أحرف على الأقل").max(50),
  description: z.string().optional(),
  discountType: z.enum(["PERCENTAGE", "FIXED"]),
  discountValue: z.number().positive("قيمة الخصم يجب أن تكون موجبة"),
  minOrderValue: z.number().positive().optional(),
  maxDiscount: z.number().positive().optional(),
  startsAt: z.string().datetime({ offset: true }),
  expiresAt: z.string().datetime({ offset: true }),
  usageLimit: z.number().int().positive().optional(),
  isActive: z.boolean().optional(),
});

export const validateCouponSchema = z.object({
  code: z.string().min(1, "كود الخصم مطلوب"),
  orderAmount: z.number("المبلغ الاجمالي للطلب مطلوبة"),
});

export const updateCouponSchema = createCouponSchema.partial();
