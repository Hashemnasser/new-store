"use strict";
// src/validators/user.validator.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.querySchema = exports.changeUserPasswordSchema = exports.updateUserSchema = exports.changeUserRoleSchema = void 0;
const zod_1 = require("zod");
// ============================================================
// 🔐 مخططات التحقق للمستخدمين
// ============================================================
exports.changeUserRoleSchema = zod_1.z.object({
    role: zod_1.z.enum(["USER", "ADMIN"]),
});
exports.updateUserSchema = zod_1.z.object({
    name: zod_1.z.string().trim().min(2).max(50).optional(),
    email: zod_1.z.email().optional(),
    image: zod_1.z.url().optional(),
});
exports.changeUserPasswordSchema = zod_1.z.object({
    currentPassword: zod_1.z.string().min(1, "Current password is required"),
    newPassword: zod_1.z.string().min(6, "New password must be at least 6 characters"),
});
exports.querySchema = zod_1.z.object({
    limit: zod_1.z.coerce
        .number()
        .int("Limit must be an integer")
        .positive("Limit must be positive")
        .default(12),
    // 5. رقم الصفحة (نفس الفكرة، وإذا ما بعت بيصير 1)
    page: zod_1.z.coerce
        .number()
        .int("Page must be an integer")
        .positive("Page must be positive")
        .default(1),
});
