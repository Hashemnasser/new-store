"use strict";
// server/src/routes/coupon.routes.ts
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const coupon_controller_1 = require("../controllers/coupon.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const validate_middleware_1 = require("../middleware/validate.middleware");
const coupon_validator_1 = require("../validators/coupon.validator");
const router = (0, express_1.Router)();
// ============================================================
// 🛒 مسار التحقق من الكوبون (للمستخدمين المسجلين)
// ============================================================
router.post("/validate", auth_middleware_1.authMiddleware, (0, validate_middleware_1.validate)(coupon_validator_1.validateCouponSchema), coupon_controller_1.validateCouponHandler);
// ============================================================
// 🔐 مسارات المدير (Admin)
// ============================================================
router.use(auth_middleware_1.authMiddleware, auth_middleware_1.adminMiddleware);
router.get("/", coupon_controller_1.getAllCouponsHandler);
router.get("/:id", coupon_controller_1.getCouponByIdHandler);
router.post("/", (0, validate_middleware_1.validate)(coupon_validator_1.createCouponSchema), coupon_controller_1.createCouponHandler);
router.patch("/:id", (0, validate_middleware_1.validate)(coupon_validator_1.updateCouponSchema), coupon_controller_1.updateCouponHandler);
router.delete("/:id", coupon_controller_1.deleteCouponHandler);
exports.default = router;
