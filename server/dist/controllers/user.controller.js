"use strict";
// src/controllers/user.controller.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.changeUserRoleHandler = exports.deleteUserByIdHandler = exports.updateUserByIdHandler = exports.getUserByIdHandler = exports.getAllUsersHandler = exports.deleteCurrentUserHandler = exports.changeMyPasswordHandler = exports.updateCurrentUserHandler = exports.getCurrentUserHandler = void 0;
const user_service_1 = require("../services/user.service");
const asyncHandler_1 = require("../utils/asyncHandler");
const request_helpers_1 = require("../utils/request-helpers");
const user_validator_1 = require("../validators/user.validator");
// ============================================================
// 👤 دوال المستخدم الحالي
// ============================================================
exports.getCurrentUserHandler = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const userId = (0, request_helpers_1.getUserId)(req);
    const user = await (0, user_service_1.getUserById)(userId);
    res.json({
        success: true,
        data: user,
    });
});
exports.updateCurrentUserHandler = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const userId = (0, request_helpers_1.getUserId)(req);
    const data = (0, request_helpers_1.getValidatedBody)(req, user_validator_1.updateUserSchema);
    const user = await (0, user_service_1.updateUser)(userId, data);
    res.json({
        success: true,
        message: "Profile updated successfully",
        data: user,
    });
});
exports.changeMyPasswordHandler = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const userId = (0, request_helpers_1.getUserId)(req);
    const { currentPassword, newPassword } = (0, request_helpers_1.getValidatedBody)(req, user_validator_1.changeUserPasswordSchema);
    const result = await (0, user_service_1.changeMyPassword)(userId, currentPassword, newPassword);
    res.json({
        success: true,
        ...result,
    });
});
exports.deleteCurrentUserHandler = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const userId = (0, request_helpers_1.getUserId)(req);
    // تمرير userId كـ currentUserId لمنع المدير الوحيد من حذف نفسه
    const result = await (0, user_service_1.deleteUser)(userId, userId);
    res.json({
        success: true,
        ...result,
    });
});
// ============================================================
// 🔐 دوال المدير (Admin) - إدارة جميع المستخدمين
// ============================================================
exports.getAllUsersHandler = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const result = await (0, user_service_1.getAllUsers)(page, limit);
    console.log("all users", result);
    res.json({
        success: true,
        data: result.users,
        pagination: {
            total: result.total,
            page: result.page,
            limit: result.limit,
            totalPages: result.totalPages,
        },
    });
});
exports.getUserByIdHandler = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { id } = (0, request_helpers_1.getValidatedParams)(req, request_helpers_1.idParamsSchema);
    const user = await (0, user_service_1.getUserById)(id);
    res.json({
        success: true,
        data: user,
    });
});
exports.updateUserByIdHandler = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { id } = (0, request_helpers_1.getValidatedParams)(req, request_helpers_1.idParamsSchema);
    const data = (0, request_helpers_1.getValidatedBody)(req, user_validator_1.updateUserSchema);
    const user = await (0, user_service_1.updateUser)(id, data);
    res.json({
        success: true,
        message: "User updated successfully",
        data: user,
    });
});
exports.deleteUserByIdHandler = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { id } = (0, request_helpers_1.getValidatedParams)(req, request_helpers_1.idParamsSchema);
    // لا نمرر currentUserId، لأن المدير يمكنه حذف أي مستخدم (مع منع حذف المدير الوحيد)
    const result = await (0, user_service_1.deleteUser)(id);
    res.json({
        success: true,
        ...result,
    });
});
exports.changeUserRoleHandler = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { id } = (0, request_helpers_1.getValidatedParams)(req, request_helpers_1.idParamsSchema);
    const data = (0, request_helpers_1.getValidatedBody)(req, user_validator_1.changeUserRoleSchema);
    const user = await (0, user_service_1.changeUserRole)(id, data);
    res.json({
        success: true,
        message: "User role updated successfully",
        data: user,
    });
});
