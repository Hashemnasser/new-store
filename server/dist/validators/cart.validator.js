"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateCartItemSchema = exports.addToCartSchema = void 0;
const zod_1 = require("zod");
exports.addToCartSchema = zod_1.z.object({
    productId: zod_1.z.string().min(1, "Product ID is required"),
    variantId: zod_1.z.string().optional(),
    quantity: zod_1.z.number().int().positive().default(1),
    // images: z.array(imageSchema).optional(),
});
exports.updateCartItemSchema = zod_1.z.object({
    quantity: zod_1.z.number().int().positive("Quantity must be at least 1"),
});
