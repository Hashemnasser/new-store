// server/src/validators/coupon.validator.ts

import { z } from "zod";

const baseCouponSchema = z.object({
  code: z.string().min(3, "كود الخصم يجب أن يكون 3 أحرف على الأقل").max(50),
  description: z.string().optional(),
  discountType: z.enum(["PERCENTAGE", "FIXED"]),
  discountValue: z.number().positive("قيمة الخصم يجب أن تكون موجبة"),
  minOrderValue: z.number().positive().optional(),
  maxDiscount: z.number().positive().optional(),

  startsAt: z.coerce.date({ message: "تاريخ البدء غير صالح" }),
  expiresAt: z.coerce.date({ message: "تاريخ الانتهاء غير صالح" }),
  usageLimit: z.number().int().positive().optional(),
  isActive: z.boolean().optional(),
});
export const createCouponSchema = baseCouponSchema.refine(
  (data) => data.expiresAt > data.startsAt,
  {
    message: "تاريخ الانتهاء غير صالح",
  }
);

export const validateCouponSchema = z.object({
  code: z.string().min(1, "كود الخصم مطلوب"),
  orderAmount: z.number("المبلغ مطلوب").positive(),
});

export const updateCouponSchema = baseCouponSchema.partial();

export type CreateCoupon = z.infer<typeof createCouponSchema>;

export type UpdateCoupon = z.infer<typeof updateCouponSchema>;
