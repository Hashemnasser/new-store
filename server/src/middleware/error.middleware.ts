import { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";

import { Prisma } from "@/generated/prisma/client";
import { isAppError } from "../errors/app-error";

export function errorHandler(
  error: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  // أخطاء Zod
  if (error instanceof ZodError) {
    return res.status(400).json({
      success: false,
      code: "VALIDATION_ERROR",
      message: "Validation failed",
      errors: error.issues,
    });
  }

  // أخطاؤنا المخصصة
  if (isAppError(error)) {
    return res.status(error.statusCode).json({
      success: false,
      code: error.code,
      message: error.message,
    });
  }

  // Prisma Errors
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    switch (error.code) {
      case "P2002":
        return res.status(409).json({
          success: false,
          code: "CONFLICT",
          message: "Resource already exists",
        });

      case "P2025":
        return res.status(404).json({
          success: false,
          code: "NOT_FOUND",
          message: "Resource not found",
        });

      default:
        console.error(error);

        return res.status(500).json({
          success: false,
          code: "DATABASE_ERROR",
          message: "Database error",
        });
    }
  }

  // أي خطأ غير متوقع
  console.error(error);

  return res.status(500).json({
    success: false,
    code: "INTERNAL_SERVER_ERROR",
    message: "Internal Server Error",
  });
}
