// src/routes/product.routes.ts

import {
  createOneProduct,
  deleteOneProduct,
  getAllProducts,
  getFeaturedProductsHandler,
  getOneProduct,
  getTopSellingProductsHandler,
  updateOneProduct,
} from "@/controllers/product.controller";
import { validate } from "@/middleware/validate.middleware";
import {
  createProductSchema,
  updateProductSchema,
} from "@/validators/product.validator";
import { Router } from "express";

const router = Router();

router.get("/", getAllProducts);
// ✅ مسارات جديدة للمنتجات الديناميكية
router.get("/featured", getFeaturedProductsHandler);
router.get("/top-selling", getTopSellingProductsHandler);
router.get("/:slug", getOneProduct);
router.post("/", validate(createProductSchema), createOneProduct);
// router.patch("/:id", validate(updateProductSchema), updateOneProduct);
router.delete("/:id", deleteOneProduct);

// ✅ استخدام slug بدلاً من id
router.patch("/:slug", validate(updateProductSchema), updateOneProduct);

// ✅ استخدام slug بدلاً من id
// router.delete("/:slug", deleteOneProduct);
export default router;
