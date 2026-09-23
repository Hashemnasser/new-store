// src/features/cart/api/cart.api.ts

import http from "../../../services/http";
import type { AddToCartPayload, Cart, CartItem } from "../types/cart.types";

// ============================================================
// 🛒 دوال API الخاصة بالسلة
// ============================================================

export const cartApi = {
  // جلب السلة
  getCart: (): Promise<{ success: boolean; data: Cart }> => {
    return http.get("/cart");
  },

  // إضافة عنصر إلى السلة
  addToCart: (
    data: AddToCartPayload
  ): Promise<{ success: boolean; data: CartItem }> => {
    return http.post("/cart", data);
  },

  // تحديث كمية عنصر في السلة
  updateCartItem: (id: string, quantity: number): Promise<CartItem> => {
    return http.patch(`/cart/${id}`, { quantity });
  },

  // حذف عنصر من السلة
  removeFromCart: (id: string): Promise<{ message: string }> => {
    return http.delete(`/cart/${id}`);
  },

  // تفريغ السلة بالكامل
  clearCart: (): Promise<{ message: string }> => {
    return http.delete("/cart");
  },
};
