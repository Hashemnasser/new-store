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
async function getAllUsers(page, limit) {
    // 1. احسب العدد الإجمالي للمستخدمين
    const total = await prisma_1.prisma.user.count();
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
    const users = await prisma_1.prisma.user.findMany({
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
async function deleteUser(targetUserId, currentUserId) {
    // ✅ الترانزأكشن من أول خطوة عشان نمنع أي تلاعب متزامن (Race Conditions)
    return await prisma_1.prisma.$transaction(async (tx) => {
        // 1. جلب المستخدم المستهدف (الضحية) - استعلام واحد فقط
        const targetUser = await tx.user.findUnique({
            where: { id: targetUserId },
        });
        if (!targetUser) {
            throw (0, app_error_1.createError)("NOT_FOUND", "User not found");
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
                    throw (0, app_error_1.createError)("FORBIDDEN", "Cannot delete the only admin user");
                }
            }
        }
        else {
            // ---- الحالة الثانية: شخص عم يحذف شخص تاني ----
            // هون إجبارياً لازم نجيب بيانات اللي عم ينفذ الحذف ونتأكد إنه أدمن
            const currentUser = await tx.user.findUnique({
                where: { id: currentUserId },
            });
            if (!currentUser || currentUser.role !== "ADMIN") {
                throw (0, app_error_1.createError)("FORBIDDEN", "You don't have permission to delete this user");
            }
            // وإذا كان الشخص المستهدف (الضحية) أدمن، لازم نتأكد إنه مش المدير الوحيد
            if (targetUser.role === "ADMIN") {
                const adminCount = await tx.user.count({ where: { role: "ADMIN" } });
                if (adminCount <= 1) {
                    throw (0, app_error_1.createError)("FORBIDDEN", "Cannot delete the only admin user");
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
