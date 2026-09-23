// src/features/reviews/types/review.types.ts

import type { User } from "../../../types/common.types";
import type { Product } from "../../products/types/product.types";

// ============================================================
// ⭐ أنواع التقييمات
// ============================================================

export interface Review {
  id: string;
  rating: number;
  comment: string;
  userId: string;
  productId: string;
  user: Pick<User, "id" | "name" | "image">;
  product?: Pick<Product, "id" | "title" | "slug">;
  createdAt: string;
  updatedAt: string;
}

// معاملات إنشاء تقييم
export interface CreateReviewPayload {
  productId: string;
  rating: number;
  comment: string;
}

// معاملات تحديث تقييم
export interface UpdateReviewPayload {
  rating?: number;
  comment?: string;
}
