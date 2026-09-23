// src/features/orders/api/orders.api.ts

import http from "../../../services/http";
import type {
  CreateOrderPayload,
  Order,
  OrdersResponse,
  UpdateOrderStatusPayload,
} from "../types/order.types";

// ============================================================
// 📦 دوال API الخاصة بالطلبات
// ============================================================
type paymentResult = {
  clientSecret?: string;
  redirectUrl?: string;
  qrCode?: string;
};
export const ordersApi = {
  // جلب جميع طلبات المستخدم الحالي
  getUserOrders: (): Promise<{ success: boolean; data: Order[] }> => {
    return http.get("/orders");
  },

  // جلب طلب محدد
  getOrderById: (id: string): Promise<Order> => {
    return http
      .get<{ success: boolean; data: Order }>(`/orders/${id}`)
      .then((res) => res.data);
  },

  // إنشاء طلب جديد
  createOrder: (
    data: CreateOrderPayload
  ): Promise<{
    success: boolean;
    data: { order: Order; paymentResult: paymentResult };
  }> => {
    return http.post("/orders", data);
  },

  // ============================================================
  // 🔐 مسارات المدير (Admin)
  // ============================================================

  // جلب جميع الطلبات (للمدير)
  getAllOrders: (): Promise<OrdersResponse> => {
    return http.get("/orders/admin/all");
  },

  // تحديث حالة طلب (للمدير)
  updateOrderStatus: (
    id: string,
    data: UpdateOrderStatusPayload
  ): Promise<Order> => {
    return http.patch(`/orders/admin/${id}/status`, data);
  },
  deleteOrderById: (
    id: string
  ): Promise<{ success: boolean; message: string }> =>
    http.delete<{ success: boolean; message: string }>(`/orders/admin/${id}`),
};
