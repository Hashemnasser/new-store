"use strict";
// src/controllers/review.controller.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteReviewAsAdminHandler = exports.getAllReviewsHandler = exports.deleteReviewHandler = exports.updateReviewHandler = exports.createReviewHandler = exports.getReviewByIdHandler = exports.getUserReviewsHandler = exports.getProductReviewsHandler = void 0;
const request_helpers_1 = require("../utils/request-helpers.js");
const review_service_1 = require("../services/review.service");
const asyncHandler_1 = require("../utils/asyncHandler");
const review_validator_1 = require("../validators/review.validator");
// ============================================================
// 👤 دوال المستخدم
// ============================================================
exports.getProductReviewsHandler = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { productId } = request_helpers_1.productIdParamsSchema.parse(req.params);
    const reviews = await (0, review_service_1.getProductReviews)(productId);
    res.json({
        success: true,
        data: reviews,
    });
});
exports.getUserReviewsHandler = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const userId = (0, request_helpers_1.getUserId)(req);
    const reviews = await (0, review_service_1.getUserReviews)(userId);
    res.json({
        success: true,
        data: reviews,
    });
});
exports.getReviewByIdHandler = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const userId = (0, request_helpers_1.getUserId)(req);
    const { id } = request_helpers_1.idParamsSchema.parse(req.params);
    const review = await (0, review_service_1.getReviewById)(id, userId);
    res.json({
        success: true,
        data: review,
    });
});
exports.createReviewHandler = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const userId = (0, request_helpers_1.getUserId)(req);
    const data = review_validator_1.createReviewSchema.parse(req.body);
    const review = await (0, review_service_1.createReview)(userId, data);
    res.status(201).json({
        success: true,
        message: "Review created successfully",
        data: review,
    });
});
exports.updateReviewHandler = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const userId = (0, request_helpers_1.getUserId)(req);
    const { id } = request_helpers_1.idParamsSchema.parse(req.params);
    const data = req.body;
    const review = await (0, review_service_1.updateReview)(userId, id, data);
    res.json({
        success: true,
        message: "Review updated successfully",
        data: review,
    });
});
exports.deleteReviewHandler = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const userId = (0, request_helpers_1.getUserId)(req);
    const { id } = request_helpers_1.idParamsSchema.parse(req.params);
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
    const { id } = request_helpers_1.idParamsSchema.parse(req.params);
    const result = await (0, review_service_1.deleteReviewAsAdmin)(id);
    res.json({
        success: true,
        ...result,
    });
});
