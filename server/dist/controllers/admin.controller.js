"use strict";
// src/controllers/admin.controller.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.replenishStockHandler = exports.getLowStockProductsHandler = exports.getSalesAnalyticsHandler = exports.getDashboardStatsHandler = void 0;
const app_error_1 = require("../errors/app-error.js");
const admin_service_1 = require("../services/admin.service");
const asyncHandler_1 = require("../utils/asyncHandler");
exports.getDashboardStatsHandler = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const stats = await (0, admin_service_1.getDashboardStats)();
    res.json({
        success: true,
        data: stats,
    });
});
exports.getSalesAnalyticsHandler = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const days = req.query.days ? parseInt(req.query.days, 10) : 30;
    const analytics = await (0, admin_service_1.getSalesAnalytics)(days);
    res.json({
        success: true,
        data: analytics,
    });
});
exports.getLowStockProductsHandler = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const threshold = req.query.threshold
        ? parseInt(req.query.threshold, 10)
        : 5;
    const products = await (0, admin_service_1.getLowStockProducts)(threshold);
    res.json({
        success: true,
        data: products,
    });
});
exports.replenishStockHandler = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { variantId } = req.params;
    const { quantity = 10 } = req.body; // الكمية المضافة (افتراضي 10)
    if (!variantId) {
        throw (0, app_error_1.createError)("BAD_REQUEST", "Variant ID is required");
    }
    if (quantity <= 0) {
        throw (0, app_error_1.createError)("BAD_REQUEST", "Quantity must be greater than 0");
    }
    const result = await (0, admin_service_1.replenishStock)(variantId, quantity);
    res.json({
        success: true,
        data: result,
        message: result.message,
    });
});
