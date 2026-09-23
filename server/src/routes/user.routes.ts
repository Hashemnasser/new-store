// src/routes/user.routes.ts

import { Router } from "express";
import {
  changeUserRoleHandler,
  deleteCurrentUserHandler,
  deleteUserByIdHandler,
  getAllUsersHandler,
  getCurrentUserHandler,
  getUserByIdHandler,
  updateCurrentUserHandler,
  updateUserByIdHandler,
} from "../controllers/user.controller";
import { adminMiddleware, authMiddleware } from "../middleware/auth.middleware";
import { validate } from "../middleware/validate.middleware";
import {
  changeUserRoleSchema,
  updateUserSchema,
} from "../validators/user.validator";

const router = Router();

// ============================================================
// 👤 مسارات المستخدم الحالي (تتطلب مصادقة)
// ============================================================
router.use(authMiddleware);

router.get("/me", getCurrentUserHandler);
router.patch("/me", validate(updateUserSchema), updateCurrentUserHandler);
router.delete("/me", deleteCurrentUserHandler);

// ============================================================
// 🔐 مسارات المدير (تتطلب مصادقة + صلاحيات مدير)
// ============================================================
router.get("/admin/all", adminMiddleware, getAllUsersHandler);
router.get("/admin/:id", adminMiddleware, getUserByIdHandler);
router.patch(
  "/admin/:id",
  adminMiddleware,
  validate(updateUserSchema),
  updateUserByIdHandler
);
router.delete("/admin/:id", adminMiddleware, deleteUserByIdHandler);
router.patch(
  "/admin/:id/role",
  adminMiddleware,
  validate(changeUserRoleSchema),
  changeUserRoleHandler
);

export default router;
