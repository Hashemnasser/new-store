"use strict";
// src/routes/auth.routes.ts
Object.defineProperty(exports, "__esModule", { value: true });
const validate_middleware_1 = require("../middleware/validate.middleware.js");
const auth_validator_1 = require("../validators/auth.validator.js");
const express_1 = require("express");
const auth_controller_1 = require("../controllers/auth.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = (0, express_1.Router)();
// ============================================================
// 📝 المسارات العامة (لا تحتاج مصادقة)
// ============================================================
/**
 * @route POST /api/auth/signup
 * @desc تسجيل مستخدم جديد
 * @access Public
 */
router.post("/signup", (0, validate_middleware_1.validate)(auth_validator_1.signUpSchema), auth_controller_1.signUp);
/**
 * @route POST /api/auth/signin
 * @desc تسجيل الدخول
 * @access Public
 */
router.post("/login", (0, validate_middleware_1.validate)(auth_validator_1.signInSchema), auth_controller_1.signIn);
// ============================================================
// 🔒 المسارات المحمية (تحتاج مصادقة)
// ============================================================
/**
 * @route GET /api/auth/profile
 * @desc جلب الملف الشخصي للمستخدم الحالي
 * @access Private (requires authentication)
 */
// ✅ مسارات محمية (تتطلب مصادقة) مع التحقق من البيانات
router.get("/profile", auth_middleware_1.authMiddleware, auth_controller_1.getProfileHandler);
router.patch("/profile", auth_middleware_1.authMiddleware, (0, validate_middleware_1.validate)(auth_validator_1.updateProfileSchema), auth_controller_1.updateProfileHandler);
router.post("/change-password", auth_middleware_1.authMiddleware, (0, validate_middleware_1.validate)(auth_validator_1.changePasswordSchema), auth_controller_1.changePasswordHandler);
router.post("/forgot-password", (0, validate_middleware_1.validate)(auth_validator_1.forgotPasswordSchema), auth_controller_1.forgotPassword);
router.post("/reset-password/:token", (0, validate_middleware_1.validate)(auth_validator_1.resetPasswordSchema), auth_controller_1.resetPassword);
exports.default = router;
