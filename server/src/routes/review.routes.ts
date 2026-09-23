// src/routes/review.routes.ts

import { Router } from "express";
import {
  createReviewHandler,
  deleteReviewAsAdminHandler,
  deleteReviewHandler,
  getAllReviewsHandler,
  getProductReviewsHandler,
  getReviewByIdHandler,
  getUserReviewsHandler,
  updateReviewHandler,
} from "../controllers/review.controller";
import { adminMiddleware, authMiddleware } from "../middleware/auth.middleware";
import { validate } from "../middleware/validate.middleware";
import {
  createReviewSchema,
  updateReviewSchema,
} from "../validators/review.validator";

const router = Router();

// ============================================================
// مسارات عامة (لا تحتاج مصادقة)
// ============================================================
router.get("/product/:productId", getProductReviewsHandler);

// ============================================================
// مسارات المستخدم (تتطلب مصادقة)
// ============================================================
router.use(authMiddleware);

router.get("/me", getUserReviewsHandler);
router.get("/:id", getReviewByIdHandler);
router.post("/", validate(createReviewSchema), createReviewHandler);
router.patch("/:id", validate(updateReviewSchema), updateReviewHandler);
router.delete("/:id", deleteReviewHandler);

// ============================================================
// مسارات المدير (تتطلب مصادقة + صلاحيات مدير)
// ============================================================
router.get("/admin/all", adminMiddleware, getAllReviewsHandler);
router.delete("/admin/:id", adminMiddleware, deleteReviewAsAdminHandler);

export default router;
