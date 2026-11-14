// src/controllers/order.controller.ts (تحديث)

import { getUserId, idParamsSchema } from "@/utils/request-helpers";
import { Request, Response } from "express";
import {
  createOrder,
  deleteOrder,
  getAllOrders,
  getOrderById,
  getUserOrders,
  updateOrderStatus,
} from "../services/order.service";
import { asyncHandler } from "../utils/asyncHandler";
import { updateOrderStatusSchema } from "../validators/order.validator";

// ============================================================
// 👤 دوال المستخدم (User)
// ============================================================

export const createOrderHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = getUserId(req);
    const data = req.body; //تم التحقق في ملف الروت بواسطة دالة validate;

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
    const userId = getUserId(req);

    const orders = await getUserOrders(userId);

    res.json({
      success: true,
      data: orders,
    });
  }
);

export const getOrderByIdHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = getUserId(req);
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

    const result = await updateOrderStatus(id, status);

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
