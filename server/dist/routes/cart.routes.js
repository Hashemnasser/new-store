"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const cart_controller_1 = require("../controllers/cart.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const validate_middleware_1 = require("../middleware/validate.middleware");
const cart_validator_1 = require("../validators/cart.validator");
const router = (0, express_1.Router)();
// جميع مسارات السلة محمية (تتطلب مصادقة)
router.use(auth_middleware_1.authMiddleware);
router.get("/", cart_controller_1.getCartHandler);
router.post("/", (0, validate_middleware_1.validate)(cart_validator_1.addToCartSchema), cart_controller_1.addToCartHandler);
router.patch("/:id", (0, validate_middleware_1.validate)(cart_validator_1.updateCartItemSchema), cart_controller_1.updateCartItemHandler);
router.delete("/:id", cart_controller_1.removeFromCartHandler);
router.delete("/", cart_controller_1.clearCartHandler);
exports.default = router;
