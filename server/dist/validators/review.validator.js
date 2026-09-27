"use strict";
// src/validators/review.validator.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateReviewSchema = exports.createReviewSchema = void 0;
const zod_1 = require("zod");
exports.createReviewSchema = zod_1.z.object({
    productId: zod_1.z.string().min(1, "Product ID is required"),
    rating: zod_1.z.number().int().min(1).max(5, "Rating must be between 1 and 5"),
    comment: zod_1.z
        .string()
        .min(3, "Comment must be at least 3 characters")
        .max(500, "Comment too long"),
});
exports.updateReviewSchema = zod_1.z.object({
    rating: zod_1.z.number().int().min(1).max(5).optional(),
    comment: zod_1.z.string().min(3).max(500).optional(),
});
