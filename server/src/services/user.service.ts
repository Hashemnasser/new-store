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
export async function getAllUsers(page: number = 1, limit: number = 10) {
  const skip = (page - 1) * limit;

  const [users, total] = await Promise.all([
    prisma.user.findMany({
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
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    }),
    prisma.user.count(),
  ]);

  return {
    users,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
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
export async function deleteUser(userId: string, currentUserId?: string) {
  // إذا تم تمرير currentUserId، نتحقق من عدم حذف المدير الوحيد لنفسه
  if (currentUserId && userId === currentUserId) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });
    if (!user) throw createError("NOT_FOUND", "User not found");

    if (user.role === "ADMIN") {
      const adminCount = await prisma.user.count({
        where: { role: "ADMIN" },
      });
      if (adminCount === 1) {
        throw createError("BAD_REQUEST", "Cannot delete the only admin user");
      }
    }
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw createError("NOT_FOUND", "User not found");
  }

  // منع حذف المدير الوحيد (إذا لم يتم التحقق من قبل)
  if (user.role === "ADMIN" && !currentUserId) {
    const adminCount = await prisma.user.count({
      where: { role: "ADMIN" },
    });
    if (adminCount === 1) {
      throw createError("BAD_REQUEST", "Cannot delete the only admin user");
    }
  }

  await prisma.user.delete({
    where: { id: userId },
  });

  return { message: "User deleted successfully" };
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
