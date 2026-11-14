"use strict";
// import { z } from "zod";
// const imageSchema = z.object({
//   id: z.string().optional(),
Object.defineProperty(exports, "__esModule", { value: true });
exports.limitSchema = exports.getProductsSchema = exports.idParamsSchema = exports.slugParamsSchema = exports.updateProductSchema = exports.createProductSchema = exports.imageSchema = void 0;
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
exports.updateProductSchema = exports.createProductSchema
    .omit({ featured: true, discountPercent: true })
    .extend({
    deletedImageIds: zod_1.z.array(zod_1.z.string()),
    deletedVariantIds: zod_1.z.array(zod_1.z.string()),
    featured: zod_1.z.boolean(),
    discountPercent: zod_1.z.number().min(0).max(100),
})
    .partial();
// ✅ مخطط للـ slug
exports.slugParamsSchema = zod_1.z.object({
    slug: zod_1.z.string().min(1, "Slug is required"),
});
exports.idParamsSchema = zod_1.z.object({
    id: zod_1.z.string().min(1, "Id is required"),
});
exports.getProductsSchema = zod_1.z.object({
    // 1. البحث (اختياري تماماً، وإذا موجود ما بيصير فاضي)
    search: zod_1.z.string().trim().min(1, "Search cannot be empty").optional(),
    // 2. الفئة (اختياري، وإذا ما بعت، بيصير "ALL")
    category: zod_1.z.string().trim().min(1).optional(),
    // 3. الترتيب (اختياري، وإذا ما بعت، بيصير "newest")
    sort: zod_1.z
        .enum(["newest", "price-asc", "price-desc", "title-asc", "title-desc"])
        .default("newest"),
    // 4. الحد الأقصى (بنستخدم coerce عشان نحول النص لرقم، وإذا ما بعت بيصير 12)
    limit: zod_1.z.coerce
        .number()
        .int("Limit must be an integer")
        .positive("Limit must be positive")
        .default(12),
    // 5. رقم الصفحة (نفس الفكرة، وإذا ما بعت بيصير 1)
    page: zod_1.z.coerce
        .number()
        .int("Page must be an integer")
        .positive("Page must be positive")
        .default(1),
    // 6. هل عليه خصم؟ (بنستخدم stringbool عشان نحول النص لـ Boolean بأمان)
    isOnSale: zod_1.z
        .stringbool() // أو z.enum(["true", "false"]).transform(v => v === "true")
        .optional(),
});
exports.limitSchema = zod_1.z.object({
    limit: zod_1.z.coerce.number().int().positive().default(8),
});
