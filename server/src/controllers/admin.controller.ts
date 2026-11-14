import { ReplenishStock } from "./../validators/admin.validator";
// src/controllers/admin.controller.ts

import { createError } from "@/errors/app-error";
import { Request, Response } from "express";
import z from "zod";
import {
  getDashboardStats,
  getLowStockProducts,
  getSalesAnalytics,
  replenishStock,
} from "../services/admin.service";
import { asyncHandler } from "../utils/asyncHandler";

export const getDashboardStatsHandler = asyncHandler(
  async (_req: Request, res: Response) => {
    const stats = await getDashboardStats();

    res.json({
      success: true,
      data: stats,
    });
  }
);

export const getSalesAnalyticsHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const days = req.query.days ? parseInt(req.query.days as string, 10) : 30;
    const analytics = await getSalesAnalytics(days);

    res.json({
      success: true,
      data: analytics,
    });
  }
);

export const getLowStockProductsHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const threshold = req.query.threshold
      ? parseInt(req.query.threshold as string, 10)
      : 5;

    const products = await getLowStockProducts(threshold);

    res.json({
      success: true,
      data: products,
    });
  }
);

export const replenishStockHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const { variantId } = req.params;
    const { quantity }: ReplenishStock = req.body; // (الـ body صار مفحوص بـ Zod)

    // فحص يدوي للـ Params (بس هالمرة استخدم Zod عشان ما تكرر if)
    const parsedId = z.cuid2("Invalid variant ID").safeParse(variantId);
    if (!parsedId.success) {
      throw createError("BAD_REQUEST", parsedId.error.issues[0].message);
    }

    const result = await replenishStock(parsedId.data, quantity);

    res.json({
      success: true,
      data: result,
      message: result.message,
    });
  }
);
