// src/services/user.service.ts

import bcrypt from "bcrypt";
import { createError } from "../errors/app-error";
import { prisma } from "../lib/prisma";
import type {
  ChangeUserRoleInput,
  UpdateUserInput,
} from "../validators/user.validator";

// ============================================================
// 📋 جلب جميع المستخدمين (مع ترقيم الصفحات)
// ============================================================

export async function getAllUsers(page: number, limit: number) {
  // 1. احسب العدد الإجمالي للمستخدمين
  const total = await prisma.user.count();

  // 2. لو مافي ولا مستخدم، ارجع استجابة فاضية بشكل آمن
  if (total === 0) {
    return { users: [], total: 0, page: 1, totalPages: 0 };
  }

  // 3. احسب عدد الصفحات
  const totalPages = Math.ceil(total / limit);

  // 4. Capping: لو طلب صفحة أكبر من المتاح، رجعه لآخر صفحة
  const safePage = Math.min(page, totalPages);
  const skip = (safePage - 1) * limit;

  // 5. جلب البيانات مع الـ select المخصص
  const users = await prisma.user.findMany({
    skip,
    take: limit,
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      image: true,
      createdAt: true,
      updatedAt: true,
      // ✅ جلب عدد الطلبات وعدد التقييمات لكل مستخدم
      _count: {
        select: {
          orders: true,
          reviews: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc", // ← الأحدث أولاً (اختياري، بس مفيد للوحة التحكم)
    },
  });

  return { users, total, page: safePage, totalPages };
}

// ============================================================
// 👤 جلب مستخدم بواسطة ID
// ============================================================
export async function getUserById(userId: string) {
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
      _count: {
        select: {
          orders: true,
          reviews: true,
        },
      },
    },
  });

  if (!user) {
    throw createError("NOT_FOUND", "User not found");
  }

  return user;
}

// ============================================================
// ✏️ تحديث بيانات المستخدم (عام)
// ============================================================
export async function updateUser(userId: string, data: UpdateUserInput) {
  const existingUser = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!existingUser) {
    throw createError("NOT_FOUND", "User not found");
  }

  // التحقق من عدم وجود بريد إلكتروني مكرر
  if (data.email) {
    const userWithEmail = await prisma.user.findFirst({
      where: {
        email: data.email,
        NOT: { id: userId },
      },
    });

    if (userWithEmail) {
      throw createError("CONFLICT", "Email already in use by another user");
    }
  }

  const updatedUser = await prisma.user.update({
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

  return updatedUser;
}

// ============================================================
// 🔑 تغيير كلمة المرور (للمستخدم نفسه)
// ============================================================
export async function changeMyPassword(
  userId: string,
  currentPassword: string,
  newPassword: string
) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw createError("NOT_FOUND", "User not found");
  }

  const isValid = await bcrypt.compare(currentPassword, user.password);
  if (!isValid) {
    throw createError("UNAUTHORIZED", "Current password is incorrect");
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  await prisma.user.update({
    where: { id: userId },
    data: { password: hashedPassword },
  });

  return { message: "Password changed successfully" };
}

// ============================================================
// 🗑️ حذف مستخدم (مع حماية المدير الوحيد)
// ============================================================
export async function deleteUser(targetUserId: string, currentUserId: string) {
  // ✅ الترانزأكشن من أول خطوة عشان نمنع أي تلاعب متزامن (Race Conditions)
  return await prisma.$transaction(async (tx) => {
    // 1. جلب المستخدم المستهدف (الضحية) - استعلام واحد فقط
    const targetUser = await tx.user.findUnique({
      where: { id: targetUserId },
    });

    if (!targetUser) {
      throw createError("NOT_FOUND", "User not found");
    }

    // 2. الفحص الذكي: هل المستخدم عم يحذف حسابه بنفسه؟
    const isDeletingSelf = targetUserId === currentUserId;

    if (isDeletingSelf) {
      // ---- الحالة الأولى: حذف النفس ----
      // إحنا هون وفرنا استعلام جلب بيانات currentUser، لأننا أصلاً هو!

      // بس بنتأكد: إذا كان أدمن، هل هو المدير الوحيد؟
      if (targetUser.role === "ADMIN") {
        const adminCount = await tx.user.count({ where: { role: "ADMIN" } });
        if (adminCount <= 1) {
          throw createError("FORBIDDEN", "Cannot delete the only admin user");
        }
      }
    } else {
      // ---- الحالة الثانية: شخص عم يحذف شخص تاني ----
      // هون إجبارياً لازم نجيب بيانات اللي عم ينفذ الحذف ونتأكد إنه أدمن

      const currentUser = await tx.user.findUnique({
        where: { id: currentUserId },
      });

      if (!currentUser || currentUser.role !== "ADMIN") {
        throw createError(
          "FORBIDDEN",
          "You don't have permission to delete this user"
        );
      }

      // وإذا كان الشخص المستهدف (الضحية) أدمن، لازم نتأكد إنه مش المدير الوحيد
      if (targetUser.role === "ADMIN") {
        const adminCount = await tx.user.count({ where: { role: "ADMIN" } });
        if (adminCount <= 1) {
          throw createError("FORBIDDEN", "Cannot delete the only admin user");
        }
      }
    }

    // 3. تنفيذ الحذف (بعد ما تأكدنا من كل الشروط)
    await tx.user.delete({
      where: { id: targetUserId },
    });

    return { message: "User deleted successfully" };
  });
}
// ============================================================
// 🔐 تغيير دور المستخدم (للمدير فقط)
// ============================================================
export async function changeUserRole(
  userId: string,
  data: ChangeUserRoleInput
) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw createError("NOT_FOUND", "User not found");
  }

  // منع تغيير دور المدير الوحيد
  if (user.role === "ADMIN" && data.role !== "ADMIN") {
    const adminCount = await prisma.user.count({
      where: { role: "ADMIN" },
    });
    if (adminCount === 1) {
      throw createError(
        "BAD_REQUEST",
        "Cannot change role of the only admin user"
      );
    }
  }

  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: { role: data.role },
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

  return updatedUser;
}
