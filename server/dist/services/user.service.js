"use strict";
// src/services/user.service.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllUsers = getAllUsers;
exports.getUserById = getUserById;
exports.updateUser = updateUser;
exports.changeMyPassword = changeMyPassword;
exports.deleteUser = deleteUser;
exports.changeUserRole = changeUserRole;
const bcrypt_1 = __importDefault(require("bcrypt"));
const app_error_1 = require("../errors/app-error");
const prisma_1 = require("../lib/prisma");
// ============================================================
// 📋 جلب جميع المستخدمين (مع ترقيم الصفحات)
// ============================================================
async function getAllUsers(page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    const [users, total] = await Promise.all([
        prisma_1.prisma.user.findMany({
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
        prisma_1.prisma.user.count(),
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
async function getUserById(userId) {
    const user = await prisma_1.prisma.user.findUnique({
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
        throw (0, app_error_1.createError)("NOT_FOUND", "User not found");
    }
    return user;
}
// ============================================================
// ✏️ تحديث بيانات المستخدم (عام)
// ============================================================
async function updateUser(userId, data) {
    const existingUser = await prisma_1.prisma.user.findUnique({
        where: { id: userId },
    });
    if (!existingUser) {
        throw (0, app_error_1.createError)("NOT_FOUND", "User not found");
    }
    // التحقق من عدم وجود بريد إلكتروني مكرر
    if (data.email) {
        const userWithEmail = await prisma_1.prisma.user.findFirst({
            where: {
                email: data.email,
                NOT: { id: userId },
            },
        });
        if (userWithEmail) {
            throw (0, app_error_1.createError)("CONFLICT", "Email already in use by another user");
        }
    }
    const updatedUser = await prisma_1.prisma.user.update({
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
async function changeMyPassword(userId, currentPassword, newPassword) {
    const user = await prisma_1.prisma.user.findUnique({
        where: { id: userId },
    });
    if (!user) {
        throw (0, app_error_1.createError)("NOT_FOUND", "User not found");
    }
    const isValid = await bcrypt_1.default.compare(currentPassword, user.password);
    if (!isValid) {
        throw (0, app_error_1.createError)("UNAUTHORIZED", "Current password is incorrect");
    }
    const hashedPassword = await bcrypt_1.default.hash(newPassword, 10);
    await prisma_1.prisma.user.update({
        where: { id: userId },
        data: { password: hashedPassword },
    });
    return { message: "Password changed successfully" };
}
// ============================================================
// 🗑️ حذف مستخدم (مع حماية المدير الوحيد)
// ============================================================
async function deleteUser(userId, currentUserId) {
    // إذا تم تمرير currentUserId، نتحقق من عدم حذف المدير الوحيد لنفسه
    if (currentUserId && userId === currentUserId) {
        const user = await prisma_1.prisma.user.findUnique({
            where: { id: userId },
        });
        if (!user)
            throw (0, app_error_1.createError)("NOT_FOUND", "User not found");
        if (user.role === "ADMIN") {
            const adminCount = await prisma_1.prisma.user.count({
                where: { role: "ADMIN" },
            });
            if (adminCount === 1) {
                throw (0, app_error_1.createError)("BAD_REQUEST", "Cannot delete the only admin user");
            }
        }
    }
    const user = await prisma_1.prisma.user.findUnique({
        where: { id: userId },
    });
    if (!user) {
        throw (0, app_error_1.createError)("NOT_FOUND", "User not found");
    }
    // منع حذف المدير الوحيد (إذا لم يتم التحقق من قبل)
    if (user.role === "ADMIN" && !currentUserId) {
        const adminCount = await prisma_1.prisma.user.count({
            where: { role: "ADMIN" },
        });
        if (adminCount === 1) {
            throw (0, app_error_1.createError)("BAD_REQUEST", "Cannot delete the only admin user");
        }
    }
    await prisma_1.prisma.user.delete({
        where: { id: userId },
    });
    return { message: "User deleted successfully" };
}
// ============================================================
// 🔐 تغيير دور المستخدم (للمدير فقط)
// ============================================================
async function changeUserRole(userId, data) {
    const user = await prisma_1.prisma.user.findUnique({
        where: { id: userId },
    });
    if (!user) {
        throw (0, app_error_1.createError)("NOT_FOUND", "User not found");
    }
    // منع تغيير دور المدير الوحيد
    if (user.role === "ADMIN" && data.role !== "ADMIN") {
        const adminCount = await prisma_1.prisma.user.count({
            where: { role: "ADMIN" },
        });
        if (adminCount === 1) {
            throw (0, app_error_1.createError)("BAD_REQUEST", "Cannot change role of the only admin user");
        }
    }
    const updatedUser = await prisma_1.prisma.user.update({
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
