// src/features/products/types/product.types.ts

import type { Category } from "../../../types/common.types";
import type { SortOption } from "../constants/sort.constants";

// ============================================================
// 🛍️ أنواع المنتجات
// ============================================================

export interface ProductImage {
  id: string;
  url: string;
  alt: string | null;
  order: number;
  isPrimary: boolean;
}

export interface ProductVariant {
  id: string;
  sku: string;
  size: string | null;
  color: string | null;
  price: number;
  stock: number;
}

export interface Product {
  id: string;
  title: string;
  description: string;
  slug: string;
  price: number;

  categoryId: string;
  category?: Category;
  images: ProductImage[];
  variants: ProductVariant[];
  averageRating: number;
  reviewsCount: number;
  isPublished: boolean;
  featured: boolean;
  createdAt: string;
  updatedAt: string;
  discountPercent: number;
  originalPrice?: number;
  discountedPrice?: number;
}

// ============================================================
// 📄 معاملات التصفية والترقيم
// ============================================================

export interface ProductsFilters {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  sort?: SortOption;
  featured?: boolean;
  isOnSale?: boolean;
  includeOutOfStock?: boolean;
}

export interface ProductsResponse {
  data: Product[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

// ============================================================
// 📝 نماذج الإضافة والتحديث
// ============================================================

export interface CreateProductInput {
  title: string;
  description: string;
  categoryId: string;
  images: Omit<ProductImage, "id">[];
  variants: Omit<ProductVariant, "id">[];
  discountPercent?: number;
}

export interface UpdateProductInput {
  title?: string;
  description?: string;
  categoryId?: string;
  images?: Omit<ProductImage, "id">[];
  variants?: Omit<ProductVariant, "id">[];
  deletedImageIds?: string[];
  deletedVariantIds?: string[];
  discountPercent?: number;
}
