"use strict";
// src/routes/user.routes.ts
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_controller_1 = require("../controllers/user.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const validate_middleware_1 = require("../middleware/validate.middleware");
const user_validator_1 = require("../validators/user.validator");
const router = (0, express_1.Router)();
// ============================================================
// 👤 مسارات المستخدم الحالي (تتطلب مصادقة)
// ============================================================
router.use(auth_middleware_1.authMiddleware);
router.get("/me", user_controller_1.getCurrentUserHandler);
router.patch("/me", (0, validate_middleware_1.validate)(user_validator_1.updateUserSchema), user_controller_1.updateCurrentUserHandler);
router.delete("/me", user_controller_1.deleteCurrentUserHandler);
// ============================================================
// 🔐 مسارات المدير (تتطلب مصادقة + صلاحيات مدير)
// ============================================================
router.get("/admin/all", auth_middleware_1.adminMiddleware, user_controller_1.getAllUsersHandler);
router.get("/admin/:id", auth_middleware_1.adminMiddleware, user_controller_1.getUserByIdHandler);
router.patch("/admin/:id", auth_middleware_1.adminMiddleware, (0, validate_middleware_1.validate)(user_validator_1.updateUserSchema), user_controller_1.updateUserByIdHandler);
router.delete("/admin/:id", auth_middleware_1.adminMiddleware, user_controller_1.deleteUserByIdHandler);
router.patch("/admin/:id/role", auth_middleware_1.adminMiddleware, (0, validate_middleware_1.validate)(user_validator_1.changeUserRoleSchema), user_controller_1.changeUserRoleHandler);
exports.default = router;
