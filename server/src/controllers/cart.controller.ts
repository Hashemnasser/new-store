import { getUserId, idParamsSchema } from "@/utils/request-helpers";
import { Request, Response } from "express";
import {
  addToCart,
  clearCart,
  getCart,
  removeFromCart,
  updateCartItem,
} from "../services/cart.service";
import { asyncHandler } from "../utils/asyncHandler";
import {
  AddToCartInput,
  UpdateCartItemInput,
} from "../validators/cart.validator";

export const getCartHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = getUserId(req);
    const cart = await getCart(userId);
    res.json({ success: true, data: cart });
  }
);

export const addToCartHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = getUserId(req);

    const data: AddToCartInput = req.body;
    const item = await addToCart(userId, data);

    res.status(201).json({ success: true, data: item });
  }
);

export const updateCartItemHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = getUserId(req);

    const { id } = idParamsSchema.parse(req.params);
    const data: UpdateCartItemInput = req.body;
    const item = await updateCartItem(userId, id, data);
    res.json({ success: true, data: item });
  }
);

export const removeFromCartHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = getUserId(req);

    const { id } = idParamsSchema.parse(req.params);
    const result = await removeFromCart(userId, id);
    res.json({ success: true, ...result });
  }
);

export const clearCartHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = getUserId(req);

    const result = await clearCart(userId);
    res.json({ success: true, ...result });
  }
);
