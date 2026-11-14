"use strict";
// src/routes/admin.routes.ts
Object.defineProperty(exports, "__esModule", { value: true });
const validate_middleware_1 = require("../middleware/validate.middleware.js");
const admin_validator_1 = require("../validators/admin.validator.js");
const express_1 = require("express");
const admin_controller_1 = require("../controllers/admin.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = (0, express_1.Router)();
// جميع مسارات المدير تتطلب مصادقة وصلاحيات مدير
router.use(auth_middleware_1.authMiddleware, auth_middleware_1.adminMiddleware);
router.get("/dashboard", admin_controller_1.getDashboardStatsHandler);
router.get("/analytics/sales", admin_controller_1.getSalesAnalyticsHandler);
router.get("/low-stock", admin_controller_1.getLowStockProductsHandler); // ✅ أضف هذا السطر
router.patch("/replenish/:variantId", (0, validate_middleware_1.validate)(admin_validator_1.replenishStockSchema), admin_controller_1.replenishStockHandler); // ✅ أضف هذا السطر
exports.default = router;
