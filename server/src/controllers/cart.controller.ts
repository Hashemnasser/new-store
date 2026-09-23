import { createError } from "@/errors/app-error";
import { Request, Response } from "express";
import z from "zod";
import {
  addToCart,
  clearCart,
  getCart,
  removeFromCart,
  updateCartItem,
} from "../services/cart.service";
import { asyncHandler } from "../utils/asyncHandler";
import {
  addToCartSchema,
  updateCartItemSchema,
} from "../validators/cart.validator";

const idParamsSchema = z.object({
  id: z.string(),
});

export const getCartHandler = asyncHandler(
  async (req: Request, res: Response) => {
    if (!req.user || !req.user.id) {
      throw createError("UNAUTHORIZED", "User not authenticated");
    }

    const userId = req.user.id;
    const cart = await getCart(userId);
    res.json({ success: true, data: cart });
  }
);

export const addToCartHandler = asyncHandler(
  async (req: Request, res: Response) => {
    console.log("req ......:!!", req.user);
    if (!req.user || !req.user.id) {
      throw createError("UNAUTHORIZED", "User not authenticated");
    }

    const userId = req.user.id;
    const data = addToCartSchema.parse(req.body);
    const item = await addToCart(userId, data);

    res.status(201).json({ success: true, data: item });
  }
);

export const updateCartItemHandler = asyncHandler(
  async (req: Request, res: Response) => {
    if (!req.user || !req.user.id) {
      throw createError("UNAUTHORIZED", "User not authenticated");
    }

    const userId = req.user.id;
    const { id } = idParamsSchema.parse(req.params);
    const data = updateCartItemSchema.parse(req.body);
    const item = await updateCartItem(userId, id, data);
    res.json({ success: true, data: item });
  }
);

export const removeFromCartHandler = asyncHandler(
  async (req: Request, res: Response) => {
    if (!req.user || !req.user.id) {
      throw createError("UNAUTHORIZED", "User not authenticated");
    }

    const userId = req.user.id;
    const { id } = idParamsSchema.parse(req.params);
    const result = await removeFromCart(userId, id);
    res.json({ success: true, ...result });
  }
);

export const clearCartHandler = asyncHandler(
  async (req: Request, res: Response) => {
    if (!req.user || !req.user.id) {
      throw createError("UNAUTHORIZED", "User not authenticated");
    }

    const userId = req.user.id;
    const result = await clearCart(userId);
    res.json({ success: true, ...result });
  }
);
