"use strict";
// import { z } from "zod";
// const imageSchema = z.object({
//   id: z.string().optional(),
Object.defineProperty(exports, "__esModule", { value: true });
exports.idParamsSchema = exports.slugParamsSchema = exports.updateProductSchema = exports.createProductSchema = exports.imageSchema = void 0;
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
const zod_1 = require("zod");
exports.imageSchema = zod_1.z.object({
    id: zod_1.z.string().optional(),
    url: zod_1.z.string().url(),
    alt: zod_1.z.string().optional(),
    order: zod_1.z.number().int().optional(),
    isPrimary: zod_1.z.boolean().optional(),
});
const variantSchema = zod_1.z.object({
    id: zod_1.z.string().optional(),
    sku: zod_1.z.string().min(3),
    size: zod_1.z.string().optional(),
    color: zod_1.z.string().optional(),
    price: zod_1.z.number().positive(),
    stock: zod_1.z.number().int().min(0),
});
// ============================================================
// 📦 CREATE PRODUCT SCHEMA (All fields required)
// ============================================================
exports.createProductSchema = zod_1.z.object({
    title: zod_1.z
        .string()
        .trim()
        .min(3, "Title must be at least 3 characters")
        .max(100),
    description: zod_1.z
        .string()
        .trim()
        .min(10, "Description must be at least 10 characters"),
    categoryId: zod_1.z.string().trim().min(1, "Category ID is required"),
    images: zod_1.z.array(exports.imageSchema).min(1, "At least one image is required"),
    variants: zod_1.z.array(variantSchema).min(1, "At least one variant is required"),
    featured: zod_1.z.boolean().optional().default(false),
    discountPercent: zod_1.z.number().min(0).max(100).optional().default(0),
});
// ============================================================
// 🔄 UPDATE PRODUCT SCHEMA (All fields optional)
// ============================================================
exports.updateProductSchema = zod_1.z.object({
    title: zod_1.z.string().trim().min(3).max(100).optional(),
    description: zod_1.z.string().trim().min(10).optional(),
    categoryId: zod_1.z.string().trim().min(1).optional(),
    images: zod_1.z.array(exports.imageSchema).optional(),
    variants: zod_1.z.array(variantSchema).optional(),
    deletedImageIds: zod_1.z.array(zod_1.z.string()).optional(),
    deletedVariantIds: zod_1.z.array(zod_1.z.string()).optional(),
    featured: zod_1.z.boolean().optional().default(false),
    discountPercent: zod_1.z.number().min(0).max(100).optional(),
});
// ✅ مخطط للـ slug
exports.slugParamsSchema = zod_1.z.object({
    slug: zod_1.z.string().min(1, "Slug is required"),
});
exports.idParamsSchema = zod_1.z.object({
    id: zod_1.z.string().min(1, "Id is required"),
});
