import { Router } from "express";

import {
  deleteOneCategory,
  getCategories,
  storeCategory,
  updateCategory,
} from "../controllers/category.controller";

import { validate } from "../middleware/validate.middleware";

import { adminMiddleware, authMiddleware } from "@/middleware/auth.middleware";
import { createCategorySchema } from "../validators/category.validator";

const router = Router();

router.get("/", getCategories);

// ✅ كل اللي تحت هون لازم يكون مسجل دخول + أدمن
router.use(authMiddleware, adminMiddleware);

router.post("/", validate(createCategorySchema), storeCategory);
router.patch("/:id", validate(createCategorySchema), updateCategory);
router.delete("/:id", deleteOneCategory);
export default router;
