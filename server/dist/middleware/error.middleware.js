"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = errorHandler;
const zod_1 = require("zod");
const client_1 = require("../generated/prisma/client.js");
const app_error_1 = require("../errors/app-error");
function errorHandler(error, _req, res, _next) {
    // أخطاء Zod
    if (error instanceof zod_1.ZodError) {
        return res.status(400).json({
            success: false,
            code: "VALIDATION_ERROR",
            message: "Validation failed",
            errors: error.issues,
        });
    }
    // أخطاؤنا المخصصة
    if ((0, app_error_1.isAppError)(error)) {
        return res.status(error.statusCode).json({
            success: false,
            code: error.code,
            message: error.message,
        });
    }
    // Prisma Errors
    if (error instanceof client_1.Prisma.PrismaClientKnownRequestError) {
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
