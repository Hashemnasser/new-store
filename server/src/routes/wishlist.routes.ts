// src/routes/wishlist.routes.ts

import { Router } from "express";
import {
  addToWishlistHandler,
  clearWishlistHandler,
  getWishlistHandler,
  isInWishlistHandler,
  removeFromWishlistHandler,
} from "../controllers/wishlist.controller";
import { authMiddleware } from "../middleware/auth.middleware";
import { validate } from "../middleware/validate.middleware";
import { addToWishlistSchema } from "../validators/wishlist.validator";

const router = Router();

// جميع مسارات قائمة الرغبات محمية (تتطلب مصادقة)
router.use(authMiddleware);

router.get("/", getWishlistHandler);
router.post("/", validate(addToWishlistSchema), addToWishlistHandler);
router.get("/check/:productId", isInWishlistHandler); // التحقق من وجود المنتج في القائمة
router.delete("/:productId", removeFromWishlistHandler);
router.delete("/", clearWishlistHandler);

export default router;
