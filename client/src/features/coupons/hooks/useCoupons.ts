// client/src/features/coupons/hooks/useCoupons.ts

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { couponsApi } from "../api/coupons.api";
import type {
  CreateCouponPayload,
  UpdateCouponPayload,
  ValidateCouponRequest,
} from "../types/coupon.types";

// ============================================================
// 🪝 Hooks الخاصة بالكوبونات
// ============================================================

// 🔍 التحقق من صحة كوبون (للاستخدام في صفحة الدفع)
export const useValidateCoupon = () => {
  return useMutation({
    mutationFn: (data: ValidateCouponRequest) =>
      couponsApi.validateCoupon(data),
  });
};

// 📋 جلب جميع الكوبونات (للمدير)
export const useAllCoupons = () => {
  return useQuery({
    queryKey: ["coupons", "admin", "all"],
    queryFn: () => couponsApi.getAllCoupons(),
    staleTime: 2 * 60 * 1000, // 2 دقائق
  });
};

// 🔍 جلب كوبون محدد (للمدير)
export const useCouponById = (id: string) => {
  return useQuery({
    queryKey: ["coupons", id],
    queryFn: () => couponsApi.getCouponById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
};

// ➕ إنشاء كوبون جديد (للمدير)
export const useCreateCoupon = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateCouponPayload) => couponsApi.createCoupon(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["coupons", "admin", "all"] });
      toast.success("تم إنشاء الكوبون بنجاح");
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message || "حدث خطأ أثناء إنشاء الكوبون"
      );
    },
  });
};

// ✏️ تحديث كوبون (للمدير)
export const useUpdateCoupon = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateCouponPayload }) =>
      couponsApi.updateCoupon(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["coupons", "admin", "all"] });
      toast.success("تم تحديث الكوبون بنجاح");
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message || "حدث خطأ أثناء تحديث الكوبون"
      );
    },
  });
};

// 🗑️ حذف كوبون (للمدير)
export const useDeleteCoupon = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => couponsApi.deleteCoupon(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["coupons", "admin", "all"] });
      toast.success("تم حذف الكوبون بنجاح");
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message || "حدث خطأ أثناء حذف الكوبون"
      );
    },
  });
};
