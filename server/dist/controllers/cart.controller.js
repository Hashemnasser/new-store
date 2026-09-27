"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.clearCartHandler = exports.removeFromCartHandler = exports.updateCartItemHandler = exports.addToCartHandler = exports.getCartHandler = void 0;
const app_error_1 = require("../errors/app-error.js");
const zod_1 = __importDefault(require("zod"));
const cart_service_1 = require("../services/cart.service");
const asyncHandler_1 = require("../utils/asyncHandler");
const cart_validator_1 = require("../validators/cart.validator");
const idParamsSchema = zod_1.default.object({
    id: zod_1.default.string(),
});
exports.getCartHandler = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    if (!req.user || !req.user.id) {
        throw (0, app_error_1.createError)("UNAUTHORIZED", "User not authenticated");
    }
    const userId = req.user.id;
    const cart = await (0, cart_service_1.getCart)(userId);
    res.json({ success: true, data: cart });
});
exports.addToCartHandler = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    console.log("req ......:!!", req.user);
    if (!req.user || !req.user.id) {
        throw (0, app_error_1.createError)("UNAUTHORIZED", "User not authenticated");
    }
    const userId = req.user.id;
    const data = cart_validator_1.addToCartSchema.parse(req.body);
    const item = await (0, cart_service_1.addToCart)(userId, data);
    res.status(201).json({ success: true, data: item });
});
exports.updateCartItemHandler = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    if (!req.user || !req.user.id) {
        throw (0, app_error_1.createError)("UNAUTHORIZED", "User not authenticated");
    }
    const userId = req.user.id;
    const { id } = idParamsSchema.parse(req.params);
    const data = cart_validator_1.updateCartItemSchema.parse(req.body);
    const item = await (0, cart_service_1.updateCartItem)(userId, id, data);
    res.json({ success: true, data: item });
});
exports.removeFromCartHandler = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    if (!req.user || !req.user.id) {
        throw (0, app_error_1.createError)("UNAUTHORIZED", "User not authenticated");
    }
    const userId = req.user.id;
    const { id } = idParamsSchema.parse(req.params);
    const result = await (0, cart_service_1.removeFromCart)(userId, id);
    res.json({ success: true, ...result });
});
exports.clearCartHandler = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    if (!req.user || !req.user.id) {
        throw (0, app_error_1.createError)("UNAUTHORIZED", "User not authenticated");
    }
    const userId = req.user.id;
    const result = await (0, cart_service_1.clearCart)(userId);
    res.json({ success: true, ...result });
});
