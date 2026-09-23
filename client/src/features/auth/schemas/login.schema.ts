// src/features/auth/schemas/login.schema.ts

import { z } from "zod";

// ============================================================
// 🔐 مخطط التحقق من تسجيل الدخول
// ============================================================

export const loginSchema = z.object({
  email: z.string().email("البريد الإلكتروني غير صحيح"),
  password: z.string().min(6, "كلمة المرور يجب أن تكون 6 أحرف على الأقل"),
});

export type LoginFormValues = z.infer<typeof loginSchema>;
