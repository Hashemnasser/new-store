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
export const updateProductSchema = z.object({
  title: z.string().trim().min(3).max(100).optional(),
  description: z.string().trim().min(10).optional(),
  categoryId: z.string().trim().min(1).optional(),
  images: z.array(imageSchema).optional(),
  variants: z.array(variantSchema).optional(),
  deletedImageIds: z.array(z.string()).optional(),
  deletedVariantIds: z.array(z.string()).optional(),
  featured: z.boolean().optional().default(false),
  discountPercent: z.number().min(0).max(100).optional(),
});

export type UpdateProductInput = z.infer<typeof updateProductSchema>;

// ✅ مخطط للـ slug
export const slugParamsSchema = z.object({
  slug: z.string().min(1, "Slug is required"),
});
export const idParamsSchema = z.object({
  id: z.string().min(1, "Id is required"),
});
