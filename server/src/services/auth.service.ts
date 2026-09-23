// src/services/auth.service.ts

import bcrypt from "bcrypt";
import crypto from "crypto"; // لإنشاء رمز عشوائي آمن
import jwt from "jsonwebtoken";
import { createError } from "../errors/app-error";
import { prisma } from "../lib/prisma";
import { sendEmail } from "../utils/email";

const JWT_SECRET = process.env.JWT_SECRET || "secret";

// ============================================================
// 🔐 دوال المصادقة (Service Layer)
// ============================================================

/**
 * تسجيل مستخدم جديد
 */
export async function registerUser(
  name: string,
  email: string,
  password: string
) {
  // 1. التحقق من وجود المستخدم مسبقاً
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    throw createError("CONFLICT", "Email already exists");
  }

  // 2. تشفير كلمة المرور
  const hashedPassword = await bcrypt.hash(password, 10);

  // 3. إنشاء المستخدم
  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      role: "USER",
    },
  });

  // 4. إنشاء توكن JWT
  const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: "7d" });

  // 5. إرجاع المستخدم (بدون كلمة المرور) مع التوكن
  const { password: _, ...userWithoutPassword } = user;
  return { user: userWithoutPassword, token };
}

/**
 * تسجيل الدخول
 */
export async function loginUser(email: string, password: string) {
  // 1. البحث عن المستخدم
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    throw createError("UNAUTHORIZED", "Invalid credentials");
  }

  // 2. التحقق من كلمة المرور
  const isValidPassword = await bcrypt.compare(password, user.password);
  if (!isValidPassword) {
    throw createError("UNAUTHORIZED", "Invalid credentials");
  }

  // 3. إنشاء توكن JWT
  const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: "7d" });

  // 4. إرجاع المستخدم (بدون كلمة المرور) مع التوكن
  const { password: _, ...userWithoutPassword } = user;
  return { user: userWithoutPassword, token };
}

/**
 * جلب الملف الشخصي للمستخدم
 */
export async function getProfile(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      image: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!user) {
    throw createError("NOT_FOUND", "User not found");
  }

  return user;
}

/**
 * تحديث الملف الشخصي
 */
export async function updateProfile(
  userId: string,
  data: { name?: string; image?: string }
) {
  const user = await prisma.user.update({
    where: { id: userId },
    data,
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      image: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return user;
}

/**
 * تغيير كلمة المرور
 */
export async function changePassword(
  userId: string,
  currentPassword: string,
  newPassword: string
) {
  // 1. جلب المستخدم مع كلمة المرور
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw createError("NOT_FOUND", "User not found");
  }

  // 2. التحقق من كلمة المرور الحالية
  const isValidPassword = await bcrypt.compare(currentPassword, user.password);
  if (!isValidPassword) {
    throw createError("UNAUTHORIZED", "Current password is incorrect");
  }

  // 3. تشفير كلمة المرور الجديدة
  const hashedPassword = await bcrypt.hash(newPassword, 10);

  // 4. تحديث كلمة المرور
  await prisma.user.update({
    where: { id: userId },
    data: { password: hashedPassword },
  });

  return { message: "Password updated successfully" };
}

// server/src/services/auth.service.ts

// ... (دوال registerUser, loginUser موجودة مسبقاً) ...

// ✅ دالة طلب إعادة تعيين كلمة المرور
export async function requestPasswordReset(email: string) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    // لأسباب أمنية، لا نخبر المستخدم إذا كان البريد غير موجود (نمنع هجمات التعداد)
    // نعيد نجاح وهمي
    return { message: "If your email exists, you will receive a reset link." };
  }

  // 1. إنشاء رمز عشوائي آمن (طول 32 بايت)
  const resetToken = crypto.randomBytes(32).toString("hex");

  // 2. تخزين هاش للرمز في قاعدة البيانات (أمان إضافي) مع صلاحية ساعة واحدة
  const hashedToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  const expiry = new Date(Date.now() + 60 * 60 * 1000); // ساعة واحدة

  await prisma.user.update({
    where: { id: user.id },
    data: {
      resetToken: hashedToken,
      resetTokenExpiry: expiry,
    },
  });

  // 3. بناء رابط إعادة التعيين (سيتم إرساله في الإيميل)
  const resetUrl = `${
    process.env.CLIENT_URL || "http://localhost:5173"
  }/reset-password/${resetToken}`;

  // 4. إرسال الإيميل
  await sendEmail({
    to: user.email,
    subject: "🔐 إعادة تعيين كلمة المرور - ProStore",
    html: `
      <h2>مرحباً ${user.name}،</h2>
      <p>لقد طلبت إعادة تعيين كلمة المرور لحسابك في ProStore.</p>
      <p>اضغط على الرابط أدناه لإكمال العملية (الرابط صالح لمدة ساعة واحدة):</p>
      <a href="${resetUrl}" style="display:inline-block;padding:10px 20px;background:#2563eb;color:#fff;text-decoration:none;border-radius:6px;">إعادة تعيين كلمة المرور</a>
      <p>إذا لم تطلب هذا، يرجى تجاهل هذا البريد الإلكتروني.</p>
    `,
  });

  return { message: "Reset link sent to your email." };
}

// ✅ دالة إعادة تعيين كلمة المرور (باستخدام التوكن)
export async function resetUserPassword(token: string, newPassword: string) {
  // 1. تجزئة التوكن الوارد لمقارنته مع المخزن
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  // 2. البحث عن المستخدم بالتوكن والتحقق من صلاحيته
  const user = await prisma.user.findFirst({
    where: {
      resetToken: hashedToken,
      resetTokenExpiry: { gt: new Date() }, // يجب أن يكون أكبر من الوقت الحالي
    },
  });

  if (!user) {
    throw createError("BAD_REQUEST", "Invalid or expired reset token.");
  }

  // 3. تشفير كلمة المرور الجديدة
  const hashedPassword = await bcrypt.hash(newPassword, 10);

  // 4. تحديث كلمة المرور وحذف التوكنات (للاستخدام لمرة واحدة)
  await prisma.user.update({
    where: { id: user.id },
    data: {
      password: hashedPassword,
      resetToken: null,
      resetTokenExpiry: null,
    },
  });

  return { message: "Password reset successfully. You can now login." };
}
