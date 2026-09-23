// src/features/reviews/hooks/useReviews.ts

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { reviewsApi } from "../api/reviews.api";
import type {
  CreateReviewPayload,
  Review,
  UpdateReviewPayload,
} from "../types/review.types";

// ============================================================
// ⭐ Hooks الخاصة بالتقييمات
// ============================================================

// جلب تقييمات منتج
export const useProductReviews = (productId: string) => {
  return useQuery<Review[]>({
    queryKey: ["reviews", "product", productId],
    queryFn: () => reviewsApi.getProductReviews(productId),
    enabled: !!productId,
    staleTime: 5 * 60 * 1000,
  });
};

// جلب تقييمات المستخدم الحالي
export const useUserReviews = () => {
  return useQuery<Review[]>({
    queryKey: ["reviews", "me"],
    queryFn: () => reviewsApi.getUserReviews(),
    staleTime: 5 * 60 * 1000,
  });
};

// جلب جميع التقييمات (للمدير)
export const useAllReviews = () => {
  return useQuery<Review[]>({
    queryKey: ["reviews", "admin", "all"],
    queryFn: () => reviewsApi.getAllReviews(),
    staleTime: 2 * 60 * 1000,
  });
};

// إنشاء تقييم جديد (مع معالجة أفضل للأخطاء)
export const useCreateReview = () => {
  const queryClient = useQueryClient();

  return useMutation<Review, Error, CreateReviewPayload>({
    mutationFn: (data) => reviewsApi.createReview(data),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["reviews", "product", variables.productId],
      });
      toast.success("تم إضافة تقييمك بنجاح");
    },
    onError: (error: any) => {
      // ✅ استخراج رسالة الخطأ من الباك إند
      const message =
        error?.response?.data?.message ||
        error.message ||
        "حدث خطأ أثناء إضافة التقييم";
      toast.error(message);
    },
  });
};

// تحديث تقييم
export const useUpdateReview = () => {
  const queryClient = useQueryClient();

  return useMutation<Review, Error, { id: string; data: UpdateReviewPayload }>({
    mutationFn: ({ id, data }) => reviewsApi.updateReview(id, data),
    onSuccess: (_data) => {
      queryClient.invalidateQueries({ queryKey: ["reviews"] });
      toast.success("تم تحديث التقييم بنجاح");
    },
    onError: (error: Error) => {
      toast.error(error.message || "حدث خطأ أثناء تحديث التقييم");
    },
  });
};

// حذف تقييم
export const useDeleteReview = () => {
  const queryClient = useQueryClient();

  return useMutation<{ message: string }, Error, string>({
    mutationFn: (id: string) => reviewsApi.deleteReview(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reviews"] });
      toast.success("تم حذف التقييم بنجاح");
    },
    onError: (error: Error) => {
      toast.error(error.message || "حدث خطأ أثناء حذف التقييم");
    },
  });
};

// حذف تقييم (للمدير)
export const useDeleteReviewAsAdmin = () => {
  const queryClient = useQueryClient();

  return useMutation<{ message: string }, Error, string>({
    mutationFn: (id: string) => reviewsApi.deleteReviewAsAdmin(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reviews", "admin", "all"] });
      toast.success("تم حذف التقييم بنجاح");
    },
    onError: (error: Error) => {
      toast.error(error.message || "حدث خطأ أثناء حذف التقييم");
    },
  });
};
