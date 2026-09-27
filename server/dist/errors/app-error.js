"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createError = createError;
exports.isAppError = isAppError;
const STATUS_CODES = {
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    CONFLICT: 409,
    INTERNAL_SERVER_ERROR: 500,
    PAYMENT_FAILED: 600,
};
function createError(code, message) {
    return {
        code,
        statusCode: STATUS_CODES[code],
        message,
    };
}
function isAppError(error) {
    return (typeof error === "object" &&
        error !== null &&
        "code" in error &&
        "statusCode" in error &&
        "message" in error);
}
