"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const category_controller_1 = require("../controllers/category.controller");
const validate_middleware_1 = require("../middleware/validate.middleware");
const auth_middleware_1 = require("../middleware/auth.middleware.js");
const category_validator_1 = require("../validators/category.validator");
const router = (0, express_1.Router)();
router.get("/", category_controller_1.getCategories);
// ✅ كل اللي تحت هون لازم يكون مسجل دخول + أدمن
router.use(auth_middleware_1.authMiddleware, auth_middleware_1.adminMiddleware);
router.post("/", (0, validate_middleware_1.validate)(category_validator_1.createCategorySchema), category_controller_1.storeCategory);
router.patch("/:id", (0, validate_middleware_1.validate)(category_validator_1.createCategorySchema), category_controller_1.updateCategory);
router.delete("/:id", category_controller_1.deleteOneCategory);
exports.default = router;
