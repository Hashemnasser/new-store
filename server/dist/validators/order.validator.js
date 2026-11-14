"use strict";
// src/validators/order.validator.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateOrderStatusSchema = exports.createOrderSchema = void 0;
const enums_1 = require("../generated/prisma/enums.js");
const zod_1 = require("zod");
exports.createOrderSchema = zod_1.z.object({
    shippingAddress: zod_1.z.object({
        street: zod_1.z.string().min(1, "Street is required"),
        city: zod_1.z.string().min(1, "City is required"),
        postalCode: zod_1.z.string().min(1, "Postal code is required"),
        country: zod_1.z.string().min(1, "Country is required"),
    }),
    paymentMethod: zod_1.z.enum(["CASH", "CARD", "BANK_TRANSFER"]).default("CASH"),
    couponCode: zod_1.z.string().optional(), // ✅ أضف هذا
});
exports.updateOrderStatusSchema = zod_1.z.object({
    status: zod_1.z.enum(enums_1.OrderStatus),
});
