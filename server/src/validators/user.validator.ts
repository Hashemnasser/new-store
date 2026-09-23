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
  email: z.string().email().optional(),
  image: z.string().url().optional(),
});

export const changeUserPasswordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z.string().min(6, "New password must be at least 6 characters"),
});

// استنتاج الأنواع
export type ChangeUserRoleInput = z.infer<typeof changeUserRoleSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
export type ChangeUserPasswordInput = z.infer<typeof changeUserPasswordSchema>;
