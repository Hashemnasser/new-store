// src/routes/auth.routes.ts

import { validate } from "@/middleware/validate.middleware";
import {
  changePasswordSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  signInSchema,
  signUpSchema,
  updateProfileSchema,
} from "@/validators/auth.validator";
import { Router } from "express";
import {
  changePasswordHandler,
  forgotPassword,
  getProfileHandler,
  resetPassword,
  signIn,
  signUp,
  updateProfileHandler,
} from "../controllers/auth.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const router = Router();

// ============================================================
// 📝 المسارات العامة (لا تحتاج مصادقة)
// ============================================================

/**
 * @route POST /api/auth/signup
 * @desc تسجيل مستخدم جديد
 * @access Public
 */
router.post("/signup", validate(signUpSchema), signUp);
/**
 * @route POST /api/auth/signin
 * @desc تسجيل الدخول
 * @access Public
 */
router.post("/login", validate(signInSchema), signIn);

// ============================================================
// 🔒 المسارات المحمية (تحتاج مصادقة)
// ============================================================

/**
 * @route GET /api/auth/profile
 * @desc جلب الملف الشخصي للمستخدم الحالي
 * @access Private (requires authentication)
 */
// ✅ مسارات محمية (تتطلب مصادقة) مع التحقق من البيانات
router.get("/profile", authMiddleware, getProfileHandler);
router.patch(
  "/profile",
  authMiddleware,
  validate(updateProfileSchema),
  updateProfileHandler
);
router.post(
  "/change-password",
  authMiddleware,
  validate(changePasswordSchema),
  changePasswordHandler
);

router.post("/forgot-password", validate(forgotPasswordSchema), forgotPassword);
router.post(
  "/reset-password/:token",
  validate(resetPasswordSchema),
  resetPassword
);

export default router;
