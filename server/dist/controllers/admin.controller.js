"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.replenishStockHandler = exports.getLowStockProductsHandler = exports.getSalesAnalyticsHandler = exports.getDashboardStatsHandler = void 0;
// src/controllers/admin.controller.ts
const app_error_1 = require("../errors/app-error.js");
const zod_1 = __importDefault(require("zod"));
const admin_service_1 = require("../services/admin.service");
const asyncHandler_1 = require("../utils/asyncHandler");
exports.getDashboardStatsHandler = (0, asyncHandler_1.asyncHandler)(async (_req, res) => {
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
    const { quantity } = req.body; // (الـ body صار مفحوص بـ Zod)
    // فحص يدوي للـ Params (بس هالمرة استخدم Zod عشان ما تكرر if)
    const parsedId = zod_1.default.cuid2("Invalid variant ID").safeParse(variantId);
    if (!parsedId.success) {
        throw (0, app_error_1.createError)("BAD_REQUEST", parsedId.error.issues[0].message);
    }
    const result = await (0, admin_service_1.replenishStock)(parsedId.data, quantity);
    res.json({
        success: true,
        data: result,
        message: result.message,
    });
});
