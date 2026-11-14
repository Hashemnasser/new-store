"use strict";
// src/controllers/wishlist.controller.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isInWishlistHandler = exports.clearWishlistHandler = exports.removeFromWishlistHandler = exports.addToWishlistHandler = exports.getWishlistHandler = void 0;
const request_helpers_1 = require("../utils/request-helpers.js");
const zod_1 = __importDefault(require("zod"));
const wishlist_service_1 = require("../services/wishlist.service");
const asyncHandler_1 = require("../utils/asyncHandler");
const idParamsSchema = zod_1.default.object({
    productId: zod_1.default.string(),
});
exports.getWishlistHandler = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const userId = (0, request_helpers_1.getUserId)(req);
    const wishlist = await (0, wishlist_service_1.getWishlist)(userId);
    res.json({
        success: true,
        data: wishlist,
    });
});
exports.addToWishlistHandler = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const userId = (0, request_helpers_1.getUserId)(req);
    const data = req.body;
    const item = await (0, wishlist_service_1.addToWishlist)(userId, data);
    res.status(201).json({
        success: true,
        message: "Product added to wishlist",
        data: item,
    });
});
exports.removeFromWishlistHandler = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const userId = (0, request_helpers_1.getUserId)(req);
    const { productId } = idParamsSchema.parse(req.params);
    const result = await (0, wishlist_service_1.removeFromWishlist)(userId, productId);
    res.json({
        success: true,
        ...result,
    });
});
exports.clearWishlistHandler = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    // ✅ التحقق من وجود req.user
    const userId = (0, request_helpers_1.getUserId)(req);
    const result = await (0, wishlist_service_1.clearWishlist)(userId);
    res.json({
        success: true,
        ...result,
    });
});
exports.isInWishlistHandler = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const userId = (0, request_helpers_1.getUserId)(req);
    const { productId } = idParamsSchema.parse(req.params);
    const exists = await (0, wishlist_service_1.isInWishlist)(userId, productId);
    res.json({
        success: true,
        data: { exists },
    });
});
