// src/validators/user.validator.ts

import { z } from "zod";

// ============================================================
// 🔐 مخططات التحقق للمستخدمين
// ============================================================

export const changeUserRoleSchema = z.object({
  role: z.enum(["USER", "ADMIN"]),
});

export const updateUserSchema = z.object({
  name: z.string().trim().min(2).max(50).optional(),
  email: z.email().optional(),
  image: z.url().optional(),
});

export const changeUserPasswordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z.string().min(6, "New password must be at least 6 characters"),
});

// استنتاج الأنواع
export type ChangeUserRoleInput = z.infer<typeof changeUserRoleSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
export type ChangeUserPasswordInput = z.infer<typeof changeUserPasswordSchema>;

export const querySchema = z.object({
  limit: z.coerce
    .number()
    .int("Limit must be an integer")
    .positive("Limit must be positive")
    .default(12),

  // 5. رقم الصفحة (نفس الفكرة، وإذا ما بعت بيصير 1)
  page: z.coerce
    .number()
    .int("Page must be an integer")
    .positive("Page must be positive")
    .default(1),
});
