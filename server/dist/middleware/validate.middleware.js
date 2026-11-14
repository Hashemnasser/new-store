"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = validate;
exports.validateQuery = validateQuery;
const zod_1 = require("zod");
function validate(schema) {
    return (req, _res, next) => {
        try {
            req.body = schema.parse(req.body);
            next();
        }
        catch (error) {
            if (error instanceof zod_1.ZodError) {
                return next(error);
            }
            return next(error);
        }
    };
}
// ✅ الدالة الجديدة الخاصة بالـ Query Params
function validateQuery(schema) {
    return (req, _res, next) => {
        try {
            // بنفحص الـ req.query باستخدام السكيما
            const parsedQuery = schema.parse(req.query);
            // بنحط النتيجة المفحوصة في مكان جديد عشان نتجنب مشاكل Express 5
            req.validatedQuery = parsedQuery;
            next();
        }
        catch (error) {
            if (error instanceof zod_1.ZodError) {
                return next(error);
            }
            next(error);
        }
    };
}
