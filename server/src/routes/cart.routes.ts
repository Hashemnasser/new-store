import { Router } from "express";
import {
  addToCartHandler,
  clearCartHandler,
  getCartHandler,
  removeFromCartHandler,
  updateCartItemHandler,
} from "../controllers/cart.controller";
import { authMiddleware } from "../middleware/auth.middleware";
import { validate } from "../middleware/validate.middleware";
import {
  addToCartSchema,
  updateCartItemSchema,
} from "../validators/cart.validator";

const router = Router();

// جميع مسارات السلة محمية (تتطلب مصادقة)
router.use(authMiddleware);

router.get("/", getCartHandler);
router.post("/", validate(addToCartSchema), addToCartHandler);
router.patch("/:id", validate(updateCartItemSchema), updateCartItemHandler);
router.delete("/:id", removeFromCartHandler);
router.delete("/", clearCartHandler);

export default router;
