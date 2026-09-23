// src/controllers/order.controller.ts (تحديث)

import { createError } from "@/errors/app-error";
import { Request, Response } from "express";
import z from "zod";
import { OrderStatus } from "../generated/prisma/enums"; // ✅ استيراد الـ Enum
import {
  createOrder,
  deleteOrder,
  getAllOrders,
  getOrderById,
  getUserOrders,
  updateOrderStatus,
} from "../services/order.service";
import { asyncHandler } from "../utils/asyncHandler";
import {
  createOrderSchema,
  updateOrderStatusSchema,
} from "../validators/order.validator";

// ============================================================
// 👤 دوال المستخدم (User)
// ============================================================
const idParamsSchema = z.object({
  id: z.string(),
});
export const createOrderHandler = asyncHandler(
  async (req: Request, res: Response) => {
    // ✅ التحقق من وجود req.user
    if (!req.user || !req.user.id) {
      throw createError("UNAUTHORIZED", "User not authenticated");
    }
    const userId = req.user.id;
    const data = createOrderSchema.parse(req.body);

    const { order, paymentResult } = await createOrder(userId, data);

    // ✅ رسالة نجاح توضح حالة الدفع
    const message =
      data.paymentMethod === "CASH"
        ? "Order created successfully. Awaiting payment confirmation."
        : "Order created and payment confirmed successfully.";

    res.status(201).json({
      success: true,
      message,
      data: { order, paymentResult },
    });
  }
);

export const getUserOrdersHandler = asyncHandler(
  async (req: Request, res: Response) => {
    // ✅ التحقق من وجود req.user
    if (!req.user || !req.user.id) {
      throw createError("UNAUTHORIZED", "User not authenticated");
    }
    const userId = req.user.id;

    const orders = await getUserOrders(userId);

    res.json({
      success: true,
      data: orders,
    });
  }
);

export const getOrderByIdHandler = asyncHandler(
  async (req: Request, res: Response) => {
    // ✅ التحقق من وجود req.user
    if (!req.user || !req.user.id) {
      throw createError("UNAUTHORIZED", "User not authenticated");
    }
    const userId = req.user.id;
    const { id } = idParamsSchema.parse(req.params);

    const order = await getOrderById(id, userId);

    res.json({
      success: true,
      data: order,
    });
  }
);

// ============================================================
// 🔐 دوال المدير (Admin)
// ============================================================

export const getAllOrdersHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const orders = await getAllOrders();

    res.json({
      success: true,
      data: orders,
    });
  }
);

export const updateOrderStatusHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = idParamsSchema.parse(req.params);
    const { status } = updateOrderStatusSchema.parse(req.body);

    // ✅ تحويل النص إلى Enum
    const enumStatus = status as OrderStatus;
    const result = await updateOrderStatus(id, enumStatus);

    res.json({
      success: true,
      data: result,
    });
  }
);

export const deleteOrderByIdHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = idParamsSchema.parse(req.params);
    const result = await deleteOrder(id);

    res.json({
      success: true,
      ...result,
    });
  }
);
