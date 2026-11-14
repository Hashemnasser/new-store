"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateCartItemSchema = exports.addToCartSchema = void 0;
const zod_1 = require("zod");
exports.addToCartSchema = zod_1.z.object({
    productId: zod_1.z.cuid2("Invalid Product ID"),
    variantId: zod_1.z.cuid2("Invalid variant ID").optional(),
    quantity: zod_1.z.number().int().positive("Quantity must be at least 1").default(1),
    // images: z.array(imageSchema).optional(),
});
exports.updateCartItemSchema = zod_1.z.object({
    quantity: zod_1.z.number().int().positive("Quantity must be at least 1"),
});
