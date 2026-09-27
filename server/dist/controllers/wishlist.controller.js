"use strict";
// src/controllers/wishlist.controller.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isInWishlistHandler = exports.clearWishlistHandler = exports.removeFromWishlistHandler = exports.addToWishlistHandler = exports.getWishlistHandler = void 0;
const app_error_1 = require("../errors/app-error.js");
const zod_1 = __importDefault(require("zod"));
const wishlist_service_1 = require("../services/wishlist.service");
const asyncHandler_1 = require("../utils/asyncHandler");
const wishlist_validator_1 = require("../validators/wishlist.validator");
const idParamsSchema = zod_1.default.object({
    productId: zod_1.default.string(),
});
exports.getWishlistHandler = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    // ✅ التحقق من وجود req.user
    if (!req.user || !req.user.id) {
        throw (0, app_error_1.createError)("UNAUTHORIZED", "User not authenticated");
    }
    const userId = req.user.id;
    const wishlist = await (0, wishlist_service_1.getWishlist)(userId);
    res.json({
        success: true,
        data: wishlist,
    });
});
exports.addToWishlistHandler = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    // ✅ التحقق من وجود req.user
    if (!req.user || !req.user.id) {
        throw (0, app_error_1.createError)("UNAUTHORIZED", "User not authenticated");
    }
    const userId = req.user.id;
    const data = wishlist_validator_1.addToWishlistSchema.parse(req.body);
    const item = await (0, wishlist_service_1.addToWishlist)(userId, data);
    res.status(201).json({
        success: true,
        message: "Product added to wishlist",
        data: item,
    });
});
exports.removeFromWishlistHandler = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    // ✅ التحقق من وجود req.user
    if (!req.user || !req.user.id) {
        throw (0, app_error_1.createError)("UNAUTHORIZED", "User not authenticated");
    }
    const userId = req.user.id;
    const { productId } = idParamsSchema.parse(req.params);
    const result = await (0, wishlist_service_1.removeFromWishlist)(userId, productId);
    res.json({
        success: true,
        ...result,
    });
});
exports.clearWishlistHandler = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    // ✅ التحقق من وجود req.user
    if (!req.user || !req.user.id) {
        throw (0, app_error_1.createError)("UNAUTHORIZED", "User not authenticated");
    }
    const userId = req.user.id;
    const result = await (0, wishlist_service_1.clearWishlist)(userId);
    res.json({
        success: true,
        ...result,
    });
});
exports.isInWishlistHandler = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    // ✅ التحقق من وجود req.user
    if (!req.user || !req.user.id) {
        throw (0, app_error_1.createError)("UNAUTHORIZED", "User not authenticated");
    }
    const userId = req.user.id;
    const { productId } = idParamsSchema.parse(req.params);
    const exists = await (0, wishlist_service_1.isInWishlist)(userId, productId);
    res.json({
        success: true,
        data: { exists },
    });
});
