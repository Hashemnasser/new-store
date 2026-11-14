// import { z } from "zod";
// const imageSchema = z.object({
//   id: z.string().optional(),

//   url: z.string().url(),

//   alt: z.string().optional(),

//   order: z.number().int().optional(),

//   isPrimary: z.boolean().optional(),
// });

// const variantSchema = z.object({
//   sku: z.string().min(3),
//   size: z.string().optional(),
//   color: z.string().optional(),
//   price: z.number().positive(),
//   stock: z.number().int().min(0),
// });
// export const createProductSchema = z.object({
//   title: z
//     .string()
//     .trim()
//     .min(3, "Title must be at least 3 characters")
//     .max(100),

//   description: z
//     .string()
//     .trim()
//     .min(10, "Description must be at least 10 characters"),

//   categoryId: z.string().trim().min(1),
//   images: z.array(imageSchema).min(1).default([]),

//   variants: z.array(variantSchema).min(1).default([]),
// });

// export type CreateProductInput = z.infer<typeof createProductSchema>;

// export const updateProductSchema = createProductSchema.partial().extend({
//   deletedImageIds: z.array(z.string()).optional(),

//   deletedVariantIds: z.array(z.string()).optional(),
// });

// export type UpdateProductInput = z.infer<typeof updateProductSchema>;

// src/validators/product.validator.ts

import { z } from "zod";

export const imageSchema = z.object({
  id: z.string().optional(),
  url: z.string().url(),
  alt: z.string().optional(),
  order: z.number().int().optional(),
  isPrimary: z.boolean().optional(),
});

const variantSchema = z.object({
  id: z.string().optional(),
  sku: z.string().min(3),
  size: z.string().optional(),
  color: z.string().optional(),
  price: z.number().positive(),
  stock: z.number().int().min(0),
});

// ============================================================
// 📦 CREATE PRODUCT SCHEMA (All fields required)
// ============================================================
export const createProductSchema = z.object({
  title: z
    .string()
    .trim()
    .min(3, "Title must be at least 3 characters")
    .max(100),
  description: z
    .string()
    .trim()
    .min(10, "Description must be at least 10 characters"),
  categoryId: z.string().trim().min(1, "Category ID is required"),
  images: z.array(imageSchema).min(1, "At least one image is required"),
  variants: z.array(variantSchema).min(1, "At least one variant is required"),
  featured: z.boolean().optional().default(false),
  discountPercent: z.number().min(0).max(100).optional().default(0),
});

export type CreateProductInput = z.infer<typeof createProductSchema>;

// ============================================================
// 🔄 UPDATE PRODUCT SCHEMA (All fields optional)
// ============================================================

export const updateProductSchema = createProductSchema
  .omit({ featured: true, discountPercent: true })

  .extend({
    deletedImageIds: z.array(z.string()),
    deletedVariantIds: z.array(z.string()),
    featured: z.boolean(),
    discountPercent: z.number().min(0).max(100),
  })
  .partial();

export type UpdateProductInput = z.infer<typeof updateProductSchema>;

// ✅ مخطط للـ slug
export const slugParamsSchema = z.object({
  slug: z.string().min(1, "Slug is required"),
});
export const idParamsSchema = z.object({
  id: z.string().min(1, "Id is required"),
});

export const getProductsSchema = z.object({
  // 1. البحث (اختياري تماماً، وإذا موجود ما بيصير فاضي)
  search: z.string().trim().min(1, "Search cannot be empty").optional(),

  // 2. الفئة (اختياري، وإذا ما بعت، بيصير "ALL")
  category: z.string().trim().min(1).optional(),

  // 3. الترتيب (اختياري، وإذا ما بعت، بيصير "newest")
  sort: z
    .enum(["newest", "price-asc", "price-desc", "title-asc", "title-desc"])
    .default("newest"),

  // 4. الحد الأقصى (بنستخدم coerce عشان نحول النص لرقم، وإذا ما بعت بيصير 12)
  limit: z.coerce
    .number()
    .int("Limit must be an integer")
    .positive("Limit must be positive")
    .default(12),

  // 5. رقم الصفحة (نفس الفكرة، وإذا ما بعت بيصير 1)
  page: z.coerce
    .number()
    .int("Page must be an integer")
    .positive("Page must be positive")
    .default(1),

  // 6. هل عليه خصم؟ (بنستخدم stringbool عشان نحول النص لـ Boolean بأمان)
  isOnSale: z
    .stringbool() // أو z.enum(["true", "false"]).transform(v => v === "true")
    .optional(),
});

export type GetProductsInput = z.infer<typeof getProductsSchema>;

export const limitSchema = z.object({
  limit: z.coerce.number().int().positive().default(8),
});
