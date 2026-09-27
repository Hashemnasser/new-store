"use strict";
// src/routes/product.routes.ts
Object.defineProperty(exports, "__esModule", { value: true });
const product_controller_1 = require("../controllers/product.controller.js");
const validate_middleware_1 = require("../middleware/validate.middleware.js");
const product_validator_1 = require("../validators/product.validator.js");
const express_1 = require("express");
const router = (0, express_1.Router)();
router.get("/", product_controller_1.getAllProducts);
// ✅ مسارات جديدة للمنتجات الديناميكية
router.get("/featured", product_controller_1.getFeaturedProductsHandler);
router.get("/top-selling", product_controller_1.getTopSellingProductsHandler);
router.get("/:slug", product_controller_1.getOneProduct);
router.post("/", (0, validate_middleware_1.validate)(product_validator_1.createProductSchema), product_controller_1.createOneProduct);
// router.patch("/:id", validate(updateProductSchema), updateOneProduct);
router.delete("/:id", product_controller_1.deleteOneProduct);
// ✅ استخدام slug بدلاً من id
router.patch("/:slug", (0, validate_middleware_1.validate)(product_validator_1.updateProductSchema), product_controller_1.updateOneProduct);
// ✅ استخدام slug بدلاً من id
// router.delete("/:slug", deleteOneProduct);
exports.default = router;
