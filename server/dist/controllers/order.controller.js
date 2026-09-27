"use strict";
// src/controllers/order.controller.ts (تحديث)
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteOrderByIdHandler = exports.updateOrderStatusHandler = exports.getAllOrdersHandler = exports.getOrderByIdHandler = exports.getUserOrdersHandler = exports.createOrderHandler = void 0;
const app_error_1 = require("../errors/app-error.js");
const zod_1 = __importDefault(require("zod"));
const order_service_1 = require("../services/order.service");
const asyncHandler_1 = require("../utils/asyncHandler");
const order_validator_1 = require("../validators/order.validator");
// ============================================================
// 👤 دوال المستخدم (User)
// ============================================================
const idParamsSchema = zod_1.default.object({
    id: zod_1.default.string(),
});
exports.createOrderHandler = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    // ✅ التحقق من وجود req.user
    if (!req.user || !req.user.id) {
        throw (0, app_error_1.createError)("UNAUTHORIZED", "User not authenticated");
    }
    const userId = req.user.id;
    const data = order_validator_1.createOrderSchema.parse(req.body);
    const { order, paymentResult } = await (0, order_service_1.createOrder)(userId, data);
    // ✅ رسالة نجاح توضح حالة الدفع
    const message = data.paymentMethod === "CASH"
        ? "Order created successfully. Awaiting payment confirmation."
        : "Order created and payment confirmed successfully.";
    res.status(201).json({
        success: true,
        message,
        data: { order, paymentResult },
    });
});
exports.getUserOrdersHandler = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    // ✅ التحقق من وجود req.user
    if (!req.user || !req.user.id) {
        throw (0, app_error_1.createError)("UNAUTHORIZED", "User not authenticated");
    }
    const userId = req.user.id;
    const orders = await (0, order_service_1.getUserOrders)(userId);
    res.json({
        success: true,
        data: orders,
    });
});
exports.getOrderByIdHandler = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    // ✅ التحقق من وجود req.user
    if (!req.user || !req.user.id) {
        throw (0, app_error_1.createError)("UNAUTHORIZED", "User not authenticated");
    }
    const userId = req.user.id;
    const { id } = idParamsSchema.parse(req.params);
    const order = await (0, order_service_1.getOrderById)(id, userId);
    res.json({
        success: true,
        data: order,
    });
});
// ============================================================
// 🔐 دوال المدير (Admin)
// ============================================================
exports.getAllOrdersHandler = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const orders = await (0, order_service_1.getAllOrders)();
    res.json({
        success: true,
        data: orders,
    });
});
exports.updateOrderStatusHandler = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { id } = idParamsSchema.parse(req.params);
    const { status } = order_validator_1.updateOrderStatusSchema.parse(req.body);
    // ✅ تحويل النص إلى Enum
    const enumStatus = status;
    const result = await (0, order_service_1.updateOrderStatus)(id, enumStatus);
    res.json({
        success: true,
        data: result,
    });
});
exports.deleteOrderByIdHandler = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { id } = idParamsSchema.parse(req.params);
    const result = await (0, order_service_1.deleteOrder)(id);
    res.json({
        success: true,
        ...result,
    });
});
