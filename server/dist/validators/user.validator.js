"use strict";
// src/validators/user.validator.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.changeUserPasswordSchema = exports.updateUserSchema = exports.changeUserRoleSchema = void 0;
const zod_1 = require("zod");
// ============================================================
// 🔐 مخططات التحقق للمستخدمين
// ============================================================
exports.changeUserRoleSchema = zod_1.z.object({
    role: zod_1.z.enum(["USER", "ADMIN"]),
});
exports.updateUserSchema = zod_1.z.object({
    name: zod_1.z.string().trim().min(2).max(50).optional(),
    email: zod_1.z.string().email().optional(),
    image: zod_1.z.string().url().optional(),
});
exports.changeUserPasswordSchema = zod_1.z.object({
    currentPassword: zod_1.z.string().min(1, "Current password is required"),
    newPassword: zod_1.z.string().min(6, "New password must be at least 6 characters"),
});
