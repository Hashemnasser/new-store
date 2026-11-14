// src/controllers/wishlist.controller.ts

import { getUserId } from "@/utils/request-helpers";
import { Request, Response } from "express";
import z from "zod";
import {
  addToWishlist,
  clearWishlist,
  getWishlist,
  isInWishlist,
  removeFromWishlist,
} from "../services/wishlist.service";
import { asyncHandler } from "../utils/asyncHandler";
import { AddToWishlistInput } from "../validators/wishlist.validator";

const idParamsSchema = z.object({
  productId: z.string(),
});

export const getWishlistHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = getUserId(req);

    const wishlist = await getWishlist(userId);

    res.json({
      success: true,
      data: wishlist,
    });
  }
);

export const addToWishlistHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = getUserId(req);
    const data: AddToWishlistInput = req.body;

    const item = await addToWishlist(userId, data);

    res.status(201).json({
      success: true,
      message: "Product added to wishlist",
      data: item,
    });
  }
);

export const removeFromWishlistHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = getUserId(req);
    const { productId } = idParamsSchema.parse(req.params);

    const result = await removeFromWishlist(userId, productId);

    res.json({
      success: true,
      ...result,
    });
  }
);

export const clearWishlistHandler = asyncHandler(
  async (req: Request, res: Response) => {
    // ✅ التحقق من وجود req.user
    const userId = getUserId(req);

    const result = await clearWishlist(userId);

    res.json({
      success: true,
      ...result,
    });
  }
);

export const isInWishlistHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = getUserId(req);

    const { productId } = idParamsSchema.parse(req.params);

    const exists = await isInWishlist(userId, productId);

    res.json({
      success: true,
      data: { exists },
    });
  }
);
