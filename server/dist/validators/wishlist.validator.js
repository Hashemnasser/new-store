"use strict";
// src/validators/wishlist.validator.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.addToWishlistSchema = void 0;
const zod_1 = require("zod");
exports.addToWishlistSchema = zod_1.z.object({
    productId: zod_1.z.string().min(1, "Product ID is required"),
});
