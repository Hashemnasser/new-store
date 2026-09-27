"use strict";
// src/routes/order.routes.ts
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const order_controller_1 = require("../controllers/order.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const validate_middleware_1 = require("../middleware/validate.middleware");
const order_validator_1 = require("../validators/order.validator");
const router = (0, express_1.Router)();
// ============================================================
// 👤 مسارات المستخدم (تتطلب مصادقة)
// ============================================================
router.use(auth_middleware_1.authMiddleware);
router.get("/", order_controller_1.getUserOrdersHandler);
router.get("/:id", order_controller_1.getOrderByIdHandler);
router.post("/", (0, validate_middleware_1.validate)(order_validator_1.createOrderSchema), order_controller_1.createOrderHandler);
// ============================================================
// 🔐 مسارات المدير (تتطلب مصادقة + صلاحيات مدير)
// ============================================================
router.get("/admin/all", auth_middleware_1.adminMiddleware, order_controller_1.getAllOrdersHandler);
router.patch("/admin/:id/status", auth_middleware_1.adminMiddleware, (0, validate_middleware_1.validate)(order_validator_1.updateOrderStatusSchema), order_controller_1.updateOrderStatusHandler);
router.delete("/admin/:id", auth_middleware_1.adminMiddleware, order_controller_1.deleteOrderByIdHandler);
exports.default = router;
