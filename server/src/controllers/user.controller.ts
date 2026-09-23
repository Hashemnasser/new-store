// src/controllers/user.controller.ts

import { Request, Response } from "express";
import {
  changeMyPassword,
  changeUserRole,
  deleteUser,
  getAllUsers,
  getUserById,
  updateUser,
} from "../services/user.service";
import { asyncHandler } from "../utils/asyncHandler";
import {
  getUserId,
  getValidatedBody,
  getValidatedParams,
  idParamsSchema,
} from "../utils/request-helpers";
import {
  changeUserPasswordSchema,
  changeUserRoleSchema,
  updateUserSchema,
} from "../validators/user.validator";

// ============================================================
// 👤 دوال المستخدم الحالي
// ============================================================

export const getCurrentUserHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = getUserId(req);
    const user = await getUserById(userId);

    res.json({
      success: true,
      data: user,
    });
  }
);

export const updateCurrentUserHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = getUserId(req);
    const data = getValidatedBody(req, updateUserSchema);

    const user = await updateUser(userId, data);

    res.json({
      success: true,
      message: "Profile updated successfully",
      data: user,
    });
  }
);

export const changeMyPasswordHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = getUserId(req);
    const { currentPassword, newPassword } = getValidatedBody(
      req,
      changeUserPasswordSchema
    );

    const result = await changeMyPassword(userId, currentPassword, newPassword);

    res.json({
      success: true,
      ...result,
    });
  }
);

export const deleteCurrentUserHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = getUserId(req);
    // تمرير userId كـ currentUserId لمنع المدير الوحيد من حذف نفسه
    const result = await deleteUser(userId, userId);

    res.json({
      success: true,
      ...result,
    });
  }
);

// ============================================================
// 🔐 دوال المدير (Admin) - إدارة جميع المستخدمين
// ============================================================

export const getAllUsersHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    const result = await getAllUsers(page, limit);
    console.log("all users", result);
    res.json({
      success: true,
      data: result.users,
      pagination: {
        total: result.total,
        page: result.page,
        limit: result.limit,
        totalPages: result.totalPages,
      },
    });
  }
);

export const getUserByIdHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = getValidatedParams(req, idParamsSchema);

    const user = await getUserById(id);

    res.json({
      success: true,
      data: user,
    });
  }
);

export const updateUserByIdHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = getValidatedParams(req, idParamsSchema);
    const data = getValidatedBody(req, updateUserSchema);

    const user = await updateUser(id, data);

    res.json({
      success: true,
      message: "User updated successfully",
      data: user,
    });
  }
);

export const deleteUserByIdHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = getValidatedParams(req, idParamsSchema);
    // لا نمرر currentUserId، لأن المدير يمكنه حذف أي مستخدم (مع منع حذف المدير الوحيد)
    const result = await deleteUser(id);

    res.json({
      success: true,
      ...result,
    });
  }
);

export const changeUserRoleHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = getValidatedParams(req, idParamsSchema);
    const data = getValidatedBody(req, changeUserRoleSchema);

    const user = await changeUserRole(id, data);

    res.json({
      success: true,
      message: "User role updated successfully",
      data: user,
    });
  }
);
