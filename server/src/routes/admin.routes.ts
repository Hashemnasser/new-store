// src/routes/admin.routes.ts

import { Router } from "express";
import {
  getDashboardStatsHandler,
  getLowStockProductsHandler,
  getSalesAnalyticsHandler,
  replenishStockHandler,
} from "../controllers/admin.controller";
import { adminMiddleware, authMiddleware } from "../middleware/auth.middleware";

const router = Router();

// جميع مسارات المدير تتطلب مصادقة وصلاحيات مدير
router.use(authMiddleware, adminMiddleware);

router.get("/dashboard", getDashboardStatsHandler);
router.get("/analytics/sales", getSalesAnalyticsHandler);
router.get("/low-stock", getLowStockProductsHandler); // ✅ أضف هذا السطر
router.patch("/replenish/:variantId", replenishStockHandler); // ✅ أضف هذا السطر
export default router;
