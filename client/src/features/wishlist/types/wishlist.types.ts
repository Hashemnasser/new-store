// src/features/wishlist/types/wishlist.types.ts

import { Product } from "../../products/types/product.types";

// ============================================================
// ❤️ أنواع قائمة الرغبات
// ============================================================

// عنصر في قائمة الرغبات
export interface WishlistItem {
  id: string;
  wishlistId: string;
  productId: string;
  product: Pick<
    Product,
    | "id"
    | "title"
    | "slug"
    | "images"
    | "price"
    | "averageRating"
    | "reviewsCount"
    | "variants"
  >;
  createdAt: string;
}

// قائمة الرغبات الكاملة
export interface Wishlist {
  id: string;
  userId: string;

  items: WishlistItem[];
  createdAt: string;
  updatedAt: string;
}

// معاملات الإضافة إلى قائمة الرغبات
export interface AddToWishlistPayload {
  productId: string;
}
