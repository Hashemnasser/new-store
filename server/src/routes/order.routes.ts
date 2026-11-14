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
router.get("/:id", getOrderByIdHandler); // لازم المسار المتغير يوضع بعد المسار الثابت لان اذا وضع قبل لا يمكن الوصول للمسار الثابت
router.post("/", validate(createOrderSchema), createOrderHandler);

// ============================================================
// 🔐 مسارات المدير (تتطلب مصادقة + صلاحيات مدير)
// ============================================================
router.use(adminMiddleware);

router.get("/admin/all", getAllOrdersHandler); //  router.get("/:id", getOrderByIdHandler)لو كان المسار من مقطع واحد كان يجب وضعه فوق
router.patch(
  "/admin/:id/status",
  validate(updateOrderStatusSchema),
  updateOrderStatusHandler
);
router.delete("/admin/:id", deleteOrderByIdHandler);

export default router;
