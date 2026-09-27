"use strict";
// src/utils/request-helpers.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.reviewIdParamsSchema = exports.productIdParamsSchema = exports.idParamsSchema = void 0;
exports.getUserId = getUserId;
exports.getValidatedParams = getValidatedParams;
exports.getValidatedBody = getValidatedBody;
const zod_1 = require("zod");
const app_error_1 = require("../errors/app-error");
// ✅ مخططات موحدة لمعاملات المسار (Params)
exports.idParamsSchema = zod_1.z.object({
    id: zod_1.z.string().min(1, "ID is required"),
});
exports.productIdParamsSchema = zod_1.z.object({
    productId: zod_1.z.string().min(1, "Product ID is required"),
});
exports.reviewIdParamsSchema = zod_1.z.object({
    reviewId: zod_1.z.string().min(1, "Review ID is required"),
});
// ✅ دالة مساعدة للحصول على userId بأمان
function getUserId(req) {
    // 1. التحقق من وجود req.user
    if (!req.user || !req.user.id) {
        throw (0, app_error_1.createError)("UNAUTHORIZED", "User not authenticated");
    }
    // 2. إرجاع userId
    return req.user.id;
}
// ✅ دالة مساعدة للحصول على Params بأمان (مع التحقق)
function getValidatedParams(req, schema) {
    try {
        return schema.parse(req.params);
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            throw (0, app_error_1.createError)("BAD_REQUEST", "Invalid parameters");
        }
        throw error;
    }
}
// ✅ دالة مساعدة للحصول على Body بأمان (مع التحقق)
function getValidatedBody(req, schema) {
    try {
        return schema.parse(req.body);
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            throw (0, app_error_1.createError)("BAD_REQUEST", "Invalid request body");
        }
        throw error;
    }
}
