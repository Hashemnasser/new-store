"use strict";
// src/routes/wishlist.routes.ts
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const wishlist_controller_1 = require("../controllers/wishlist.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const validate_middleware_1 = require("../middleware/validate.middleware");
const wishlist_validator_1 = require("../validators/wishlist.validator");
const router = (0, express_1.Router)();
// جميع مسارات قائمة الرغبات محمية (تتطلب مصادقة)
router.use(auth_middleware_1.authMiddleware);
router.get("/", wishlist_controller_1.getWishlistHandler);
router.post("/", (0, validate_middleware_1.validate)(wishlist_validator_1.addToWishlistSchema), wishlist_controller_1.addToWishlistHandler);
router.get("/check/:productId", wishlist_controller_1.isInWishlistHandler); // التحقق من وجود المنتج في القائمة
router.delete("/:productId", wishlist_controller_1.removeFromWishlistHandler);
router.delete("/", wishlist_controller_1.clearWishlistHandler);
exports.default = router;
