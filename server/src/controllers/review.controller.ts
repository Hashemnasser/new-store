// src/controllers/review.controller.ts

import { createError } from "@/errors/app-error";
import { Request, Response } from "express";
import z from "zod";
import {
  createReview,
  deleteReview,
  deleteReviewAsAdmin,
  getAllReviews,
  getProductReviews,
  getReviewById,
  getUserReviews,
  updateReview,
} from "../services/review.service";
import { asyncHandler } from "../utils/asyncHandler";
import {
  createReviewSchema,
  updateReviewSchema,
} from "../validators/review.validator";

// ============================================================
// 👤 دوال المستخدم
// ============================================================

const idParamsSchema = z.object({
  id: z.string(),
});

const productIdParamsSchema = z.object({
  productId: z.string(),
});

export const getProductReviewsHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const { productId } = productIdParamsSchema.parse(req.params);

    const reviews = await getProductReviews(productId);

    res.json({
      success: true,
      data: reviews,
    });
  }
);

export const getUserReviewsHandler = asyncHandler(
  async (req: Request, res: Response) => {
    // ✅ التحقق من وجود req.user
    if (!req.user || !req.user.id) {
      throw createError("UNAUTHORIZED", "User not authenticated");
    }
    const userId = req.user.id;

    const reviews = await getUserReviews(userId);

    res.json({
      success: true,
      data: reviews,
    });
  }
);

export const getReviewByIdHandler = asyncHandler(
  async (req: Request, res: Response) => {
    // ✅ التحقق من وجود req.user
    if (!req.user || !req.user.id) {
      throw createError("UNAUTHORIZED", "User not authenticated");
    }
    const userId = req.user.id;
    const { id } = idParamsSchema.parse(req.params);

    const review = await getReviewById(id, userId);

    res.json({
      success: true,
      data: review,
    });
  }
);

export const createReviewHandler = asyncHandler(
  async (req: Request, res: Response) => {
    // ✅ التحقق من وجود req.user
    if (!req.user || !req.user.id) {
      throw createError("UNAUTHORIZED", "User not authenticated");
    }
    const userId = req.user.id;
    const data = createReviewSchema.parse(req.body);

    const review = await createReview(userId, data);

    res.status(201).json({
      success: true,
      message: "Review created successfully",
      data: review,
    });
  }
);

export const updateReviewHandler = asyncHandler(
  async (req: Request, res: Response) => {
    // ✅ التحقق من وجود req.user
    if (!req.user || !req.user.id) {
      throw createError("UNAUTHORIZED", "User not authenticated");
    }
    const userId = req.user.id;
    const { id } = idParamsSchema.parse(req.params);
    const data = updateReviewSchema.parse(req.body);

    const review = await updateReview(userId, id, data);

    res.json({
      success: true,
      message: "Review updated successfully",
      data: review,
    });
  }
);

export const deleteReviewHandler = asyncHandler(
  async (req: Request, res: Response) => {
    // ✅ التحقق من وجود req.user
    if (!req.user || !req.user.id) {
      throw createError("UNAUTHORIZED", "User not authenticated");
    }
    const userId = req.user.id;

    const { id } = idParamsSchema.parse(req.params);

    const result = await deleteReview(userId, id);

    res.json({
      success: true,
      ...result,
    });
  }
);

// ============================================================
// 🔐 دوال المدير
// ============================================================

export const getAllReviewsHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const reviews = await getAllReviews();

    res.json({
      success: true,
      data: reviews,
    });
  }
);

export const deleteReviewAsAdminHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = idParamsSchema.parse(req.params);

    const result = await deleteReviewAsAdmin(id);

    res.json({
      success: true,
      ...result,
    });
  }
);
