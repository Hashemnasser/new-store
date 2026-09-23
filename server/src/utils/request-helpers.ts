// src/utils/request-helpers.ts

import { Request } from "express";
import { z } from "zod";
import { createError } from "../errors/app-error";

// ✅ مخططات موحدة لمعاملات المسار (Params)
export const idParamsSchema = z.object({
  id: z.string().min(1, "ID is required"),
});

export const productIdParamsSchema = z.object({
  productId: z.string().min(1, "Product ID is required"),
});

export const reviewIdParamsSchema = z.object({
  reviewId: z.string().min(1, "Review ID is required"),
});

// ✅ دالة مساعدة للحصول على userId بأمان
export function getUserId(req: Request): string {
  // 1. التحقق من وجود req.user
  if (!req.user || !req.user.id) {
    throw createError("UNAUTHORIZED", "User not authenticated");
  }

  // 2. إرجاع userId
  return req.user.id;
}

// ✅ دالة مساعدة للحصول على Params بأمان (مع التحقق)
export function getValidatedParams<T>(req: Request, schema: z.ZodSchema<T>): T {
  try {
    return schema.parse(req.params);
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw createError("BAD_REQUEST", "Invalid parameters");
    }
    throw error;
  }
}

// ✅ دالة مساعدة للحصول على Body بأمان (مع التحقق)
export function getValidatedBody<T>(req: Request, schema: z.ZodSchema<T>): T {
  try {
    return schema.parse(req.body);
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw createError("BAD_REQUEST", "Invalid request body");
    }
    throw error;
  }
}
