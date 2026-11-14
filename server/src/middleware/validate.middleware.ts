import { NextFunction, Request, Response } from "express";
import { ZodError, z } from "zod";

export function validate(schema: z.ZodType) {
  return (req: Request, _res: Response, next: NextFunction) => {
    try {
      req.body = schema.parse(req.body);

      next();
    } catch (error) {
      if (error instanceof ZodError) {
        return next(error);
      }

      return next(error);
    }
  };
}

// ✅ الدالة الجديدة الخاصة بالـ Query Params
export function validateQuery(schema: z.ZodType) {
  return (req: Request, _res: Response, next: NextFunction) => {
    try {
      // بنفحص الـ req.query باستخدام السكيما
      const parsedQuery = schema.parse(req.query);

      // بنحط النتيجة المفحوصة في مكان جديد عشان نتجنب مشاكل Express 5
      req.validatedQuery = parsedQuery;

      next();
    } catch (error) {
      if (error instanceof ZodError) {
        return next(error);
      }
      next(error);
    }
  };
}
