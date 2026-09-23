// server/src/routes/coupon.routes.ts

import { Router } from "express";
import {
  createCouponHandler,
  deleteCouponHandler,
  getAllCouponsHandler,
  getCouponByIdHandler,
  updateCouponHandler,
  validateCouponHandler,
} from "../controllers/coupon.controller";
import { adminMiddleware, authMiddleware } from "../middleware/auth.middleware";
import { validate } from "../middleware/validate.middleware";
import {
  createCouponSchema,
  updateCouponSchema,
  validateCouponSchema,
} from "../validators/coupon.validator";

const router = Router();

// ============================================================
// 🛒 مسار التحقق من الكوبون (للمستخدمين المسجلين)
// ============================================================
router.post(
  "/validate",
  authMiddleware,
  validate(validateCouponSchema),
  validateCouponHandler
);

// ============================================================
// 🔐 مسارات المدير (Admin)
// ============================================================
router.use(authMiddleware, adminMiddleware);

router.get("/", getAllCouponsHandler);
router.get("/:id", getCouponByIdHandler);
router.post("/", validate(createCouponSchema), createCouponHandler);
router.patch("/:id", validate(updateCouponSchema), updateCouponHandler);
router.delete("/:id", deleteCouponHandler);

export default router;
