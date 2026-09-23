// src/routes/order.routes.ts

import { Router } from "express";
import {
  createOrderHandler,
  deleteOrderByIdHandler,
  getAllOrdersHandler,
  getOrderByIdHandler,
  getUserOrdersHandler,
  updateOrderStatusHandler,
} from "../controllers/order.controller";
import { adminMiddleware, authMiddleware } from "../middleware/auth.middleware";
import { validate } from "../middleware/validate.middleware";
import {
  createOrderSchema,
  updateOrderStatusSchema,
} from "../validators/order.validator";

const router = Router();

// ============================================================
// 👤 مسارات المستخدم (تتطلب مصادقة)
// ============================================================
router.use(authMiddleware);

router.get("/", getUserOrdersHandler);
router.get("/:id", getOrderByIdHandler);
router.post("/", validate(createOrderSchema), createOrderHandler);

// ============================================================
// 🔐 مسارات المدير (تتطلب مصادقة + صلاحيات مدير)
// ============================================================
router.get("/admin/all", adminMiddleware, getAllOrdersHandler);
router.patch(
  "/admin/:id/status",
  adminMiddleware,
  validate(updateOrderStatusSchema),
  updateOrderStatusHandler
);
router.delete("/admin/:id", adminMiddleware, deleteOrderByIdHandler);

export default router;
