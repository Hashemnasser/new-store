// src/controllers/admin.controller.ts

import { createError } from "@/errors/app-error";
import { Request, Response } from "express";
import {
  getDashboardStats,
  getLowStockProducts,
  getSalesAnalytics,
  replenishStock,
} from "../services/admin.service";
import { asyncHandler } from "../utils/asyncHandler";

export const getDashboardStatsHandler = asyncHandler(
  async (req: Request, res: Response) => {
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
    const { quantity = 10 } = req.body; // الكمية المضافة (افتراضي 10)

    if (!variantId) {
      throw createError("BAD_REQUEST", "Variant ID is required");
    }

    if (quantity <= 0) {
      throw createError("BAD_REQUEST", "Quantity must be greater than 0");
    }

    const result = await replenishStock(variantId as string, quantity);

    res.json({
      success: true,
      data: result,
      message: result.message,
    });
  }
);
