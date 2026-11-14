"use strict";
// src/controllers/order.controller.ts (تحديث)
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteOrderByIdHandler = exports.updateOrderStatusHandler = exports.getAllOrdersHandler = exports.getOrderByIdHandler = exports.getUserOrdersHandler = exports.createOrderHandler = void 0;
const request_helpers_1 = require("../utils/request-helpers.js");
const order_service_1 = require("../services/order.service");
const asyncHandler_1 = require("../utils/asyncHandler");
const order_validator_1 = require("../validators/order.validator");
// ============================================================
// 👤 دوال المستخدم (User)
// ============================================================
exports.createOrderHandler = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const userId = (0, request_helpers_1.getUserId)(req);
    const data = req.body; //تم التحقق في ملف الروت بواسطة دالة validate;
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
    const userId = (0, request_helpers_1.getUserId)(req);
    const orders = await (0, order_service_1.getUserOrders)(userId);
    res.json({
        success: true,
        data: orders,
    });
});
exports.getOrderByIdHandler = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const userId = (0, request_helpers_1.getUserId)(req);
    const { id } = request_helpers_1.idParamsSchema.parse(req.params);
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
    const { id } = request_helpers_1.idParamsSchema.parse(req.params);
    const { status } = order_validator_1.updateOrderStatusSchema.parse(req.body);
    const result = await (0, order_service_1.updateOrderStatus)(id, status);
    res.json({
        success: true,
        data: result,
    });
});
exports.deleteOrderByIdHandler = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { id } = request_helpers_1.idParamsSchema.parse(req.params);
    const result = await (0, order_service_1.deleteOrder)(id);
    res.json({
        success: true,
        ...result,
    });
});
