// src/features/orders/hooks/useOrders.ts

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { ordersApi } from "../api/orders.api";
import type { CreateOrderPayload, OrderStatus } from "../types/order.types";

// ============================================================
// 🪝 Hook لجلب طلبات المستخدم
// ============================================================

export const useOrders = () => {
  return useQuery({
    queryKey: ["orders"],
    queryFn: () => {
      const orders = ordersApi.getUserOrders();
      console.log("odrer useOrder.....::", orders);
      return orders;
    },
    staleTime: 5 * 60 * 1000, // 5 دقائق
  });
};

// ============================================================
// 🪝 Hook لجلب طلب محدد
// ============================================================

export const useOrder = (id: string) => {
  return useQuery({
    queryKey: ["orders", id],
    queryFn: () => ordersApi.getOrderById(id),
    enabled: !!id,
    staleTime: 10 * 60 * 1000, // 10 دقائق
  });
};

// ============================================================
// 🪝 Hook لجلب جميع الطلبات (للمدير)
// ============================================================

export const useAllOrders = () => {
  return useQuery({
    queryKey: ["orders", "admin", "all"],
    queryFn: () => ordersApi.getAllOrders(),
    staleTime: 2 * 60 * 1000, // 2 دقائق
  });
};

// ============================================================
// 🪝 Hook لإنشاء طلب جديد
// ============================================================

export const useCreateOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateOrderPayload) => ordersApi.createOrder(data),
    onSuccess: (_data) => {
      // إبطال Query لجلب الطلبات من جديد
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      toast.success("تم إنشاء الطلب بنجاح");
    },
    onError: (error: unknown) => {
      const message =
        error instanceof Error ? error.message : "حدث خطأ أثناء إنشاء الطلب";
      toast.error(message);
    },
  });
};

// ============================================================
// 🪝 Hook لتحديث حالة الطلب (للمدير)
// ============================================================

export const useUpdateOrderStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: OrderStatus }) =>
      ordersApi.updateOrderStatus(id, { status }),
    onSuccess: (_, variables) => {
      // إبطال Query لجلب الطلبات من جديد
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      queryClient.invalidateQueries({ queryKey: ["orders", variables.id] });
      queryClient.invalidateQueries({ queryKey: ["orders", "admin", "all"] });
      toast.success("تم تحديث حالة الطلب بنجاح");
    },
    onError: (error: unknown) => {
      const message =
        error instanceof Error
          ? error.message
          : "حدث خطأ أثناء تحديث حالة الطلب";
      toast.error(message);
    },
  });
};

export const useDeleteOrderById = () => {
  const queryClient = useQueryClient();

  return useMutation<{ message: string }, Error, string>({
    mutationFn: (id: string) => ordersApi.deleteOrderById(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders", "admin", "all"] });
      toast.success("تم حذف الطلب بنجاح");
    },
    onError: (error: Error) => {
      toast.error(error.message || "حدث خطأ أثناءحذف الطلب");
    },
  });
};
