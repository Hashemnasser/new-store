"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.clearCartHandler = exports.removeFromCartHandler = exports.updateCartItemHandler = exports.addToCartHandler = exports.getCartHandler = void 0;
const request_helpers_1 = require("../utils/request-helpers.js");
const cart_service_1 = require("../services/cart.service");
const asyncHandler_1 = require("../utils/asyncHandler");
exports.getCartHandler = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const userId = (0, request_helpers_1.getUserId)(req);
    const cart = await (0, cart_service_1.getCart)(userId);
    res.json({ success: true, data: cart });
});
exports.addToCartHandler = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const userId = (0, request_helpers_1.getUserId)(req);
    const data = req.body;
    const item = await (0, cart_service_1.addToCart)(userId, data);
    res.status(201).json({ success: true, data: item });
});
exports.updateCartItemHandler = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const userId = (0, request_helpers_1.getUserId)(req);
    const { id } = request_helpers_1.idParamsSchema.parse(req.params);
    const data = req.body;
    const item = await (0, cart_service_1.updateCartItem)(userId, id, data);
    res.json({ success: true, data: item });
});
exports.removeFromCartHandler = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const userId = (0, request_helpers_1.getUserId)(req);
    const { id } = request_helpers_1.idParamsSchema.parse(req.params);
    const result = await (0, cart_service_1.removeFromCart)(userId, id);
    res.json({ success: true, ...result });
});
exports.clearCartHandler = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const userId = (0, request_helpers_1.getUserId)(req);
    const result = await (0, cart_service_1.clearCart)(userId);
    res.json({ success: true, ...result });
});
