"use strict";
// src/routes/review.routes.ts
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const review_controller_1 = require("../controllers/review.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const validate_middleware_1 = require("../middleware/validate.middleware");
const review_validator_1 = require("../validators/review.validator");
const router = (0, express_1.Router)();
// ============================================================
// مسارات عامة (لا تحتاج مصادقة)
// ============================================================
router.get("/product/:productId", review_controller_1.getProductReviewsHandler);
// ============================================================
// مسارات المستخدم (تتطلب مصادقة)
// ============================================================
router.use(auth_middleware_1.authMiddleware);
router.get("/me", review_controller_1.getUserReviewsHandler);
router.get("/:id", review_controller_1.getReviewByIdHandler);
router.post("/", (0, validate_middleware_1.validate)(review_validator_1.createReviewSchema), review_controller_1.createReviewHandler);
router.patch("/:id", (0, validate_middleware_1.validate)(review_validator_1.updateReviewSchema), review_controller_1.updateReviewHandler);
router.delete("/:id", review_controller_1.deleteReviewHandler);
// ============================================================
// مسارات المدير (تتطلب مصادقة + صلاحيات مدير)
// ============================================================
router.get("/admin/all", auth_middleware_1.adminMiddleware, review_controller_1.getAllReviewsHandler);
router.delete("/admin/:id", auth_middleware_1.adminMiddleware, review_controller_1.deleteReviewAsAdminHandler);
exports.default = router;
