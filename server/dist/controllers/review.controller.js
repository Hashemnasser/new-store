"use strict";
// src/controllers/review.controller.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteReviewAsAdminHandler = exports.getAllReviewsHandler = exports.deleteReviewHandler = exports.updateReviewHandler = exports.createReviewHandler = exports.getReviewByIdHandler = exports.getUserReviewsHandler = exports.getProductReviewsHandler = void 0;
const app_error_1 = require("../errors/app-error.js");
const zod_1 = __importDefault(require("zod"));
const review_service_1 = require("../services/review.service");
const asyncHandler_1 = require("../utils/asyncHandler");
const review_validator_1 = require("../validators/review.validator");
// ============================================================
// 👤 دوال المستخدم
// ============================================================
const idParamsSchema = zod_1.default.object({
    id: zod_1.default.string(),
});
const productIdParamsSchema = zod_1.default.object({
    productId: zod_1.default.string(),
});
exports.getProductReviewsHandler = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { productId } = productIdParamsSchema.parse(req.params);
    const reviews = await (0, review_service_1.getProductReviews)(productId);
    res.json({
        success: true,
        data: reviews,
    });
});
exports.getUserReviewsHandler = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    // ✅ التحقق من وجود req.user
    if (!req.user || !req.user.id) {
        throw (0, app_error_1.createError)("UNAUTHORIZED", "User not authenticated");
    }
    const userId = req.user.id;
    const reviews = await (0, review_service_1.getUserReviews)(userId);
    res.json({
        success: true,
        data: reviews,
    });
});
exports.getReviewByIdHandler = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    // ✅ التحقق من وجود req.user
    if (!req.user || !req.user.id) {
        throw (0, app_error_1.createError)("UNAUTHORIZED", "User not authenticated");
    }
    const userId = req.user.id;
    const { id } = idParamsSchema.parse(req.params);
    const review = await (0, review_service_1.getReviewById)(id, userId);
    res.json({
        success: true,
        data: review,
    });
});
exports.createReviewHandler = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    // ✅ التحقق من وجود req.user
    if (!req.user || !req.user.id) {
        throw (0, app_error_1.createError)("UNAUTHORIZED", "User not authenticated");
    }
    const userId = req.user.id;
    const data = review_validator_1.createReviewSchema.parse(req.body);
    const review = await (0, review_service_1.createReview)(userId, data);
    res.status(201).json({
        success: true,
        message: "Review created successfully",
        data: review,
    });
});
exports.updateReviewHandler = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    // ✅ التحقق من وجود req.user
    if (!req.user || !req.user.id) {
        throw (0, app_error_1.createError)("UNAUTHORIZED", "User not authenticated");
    }
    const userId = req.user.id;
    const { id } = idParamsSchema.parse(req.params);
    const data = review_validator_1.updateReviewSchema.parse(req.body);
    const review = await (0, review_service_1.updateReview)(userId, id, data);
    res.json({
        success: true,
        message: "Review updated successfully",
        data: review,
    });
});
exports.deleteReviewHandler = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    // ✅ التحقق من وجود req.user
    if (!req.user || !req.user.id) {
        throw (0, app_error_1.createError)("UNAUTHORIZED", "User not authenticated");
    }
    const userId = req.user.id;
    const { id } = idParamsSchema.parse(req.params);
    const result = await (0, review_service_1.deleteReview)(userId, id);
    res.json({
        success: true,
        ...result,
    });
});
// ============================================================
// 🔐 دوال المدير
// ============================================================
exports.getAllReviewsHandler = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const reviews = await (0, review_service_1.getAllReviews)();
    res.json({
        success: true,
        data: reviews,
    });
});
exports.deleteReviewAsAdminHandler = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { id } = idParamsSchema.parse(req.params);
    const result = await (0, review_service_1.deleteReviewAsAdmin)(id);
    res.json({
        success: true,
        ...result,
    });
});
