// src/features/cart/types/cart.types.ts

import type { Product } from "../../products/types/product.types";

// ============================================================
// 🛒 أنواع السلة
// ============================================================

// عنصر في السلة (يأتي من الباك إند)
export interface CartItem {
  id: string;
  cartId: string;
  productId: string;
  variantId: string;
  quantity: number;
  product: Pick<Product, "id" | "title" | "slug" | "images" | "averageRating">;
  variant: {
    id: string;
    price: number;
    stock: number;
    size?: string;
    color?: string;
    sku: string;
  };
}

// السلة الكاملة (يأتي من الباك إند)
export interface Cart {
  id: string;
  userId: string;
  items: CartItem[];
  total: number;
  itemCount: number;
}

// المعاملات المطلوبة للإضافة إلى السلة
export interface AddToCartPayload {
  productId: string;
  variantId: string;
  quantity: number;
}

// المعاملات المطلوبة لتحديث كمية عنصر
export interface UpdateCartItemPayload {
  quantity: number;
}
