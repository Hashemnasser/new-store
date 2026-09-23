// src/features/wishlist/api/wishlist.api.ts

import http from "../../../services/http";
import type {
  AddToWishlistPayload,
  Wishlist,
  WishlistItem,
} from "../types/wishlist.types";

// ============================================================
// ❤️ دوال API الخاصة بقائمة الرغبات
// ============================================================

export const wishlistApi = {
  // جلب قائمة الرغبات
  getWishlist: (): Promise<Wishlist> => {
    return http.get<Wishlist>("/wishlist");
  },

  // إضافة منتج إلى قائمة الرغبات
  addToWishlist: (data: AddToWishlistPayload): Promise<WishlistItem> => {
    return http.post<WishlistItem>("/wishlist", data);
  },

  // حذف منتج من قائمة الرغبات
  removeFromWishlist: (productId: string): Promise<{ message: string }> => {
    return http.delete<{ message: string }>(`/wishlist/${productId}`);
  },

  // التحقق مما إذا كان المنتج في قائمة الرغبات
  checkInWishlist: (productId: string): Promise<{ exists: boolean }> => {
    return http.get<{ exists: boolean }>(`/wishlist/check/${productId}`);
  },

  // تفريغ قائمة الرغبات بالكامل
  clearWishlist: (): Promise<{ message: string }> => {
    return http.delete<{ message: string }>("/wishlist");
  },
};
