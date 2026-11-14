import { z } from "zod";

export const addToCartSchema = z.object({
  productId: z.cuid2("Invalid Product ID"),
  variantId: z.cuid2("Invalid variant ID").optional(),
  quantity: z.number().int().positive("Quantity must be at least 1").default(1),
  // images: z.array(imageSchema).optional(),
});

export const updateCartItemSchema = z.object({
  quantity: z.number().int().positive("Quantity must be at least 1"),
});

export type AddToCartInput = z.infer<typeof addToCartSchema>;
export type UpdateCartItemInput = z.infer<typeof updateCartItemSchema>;
