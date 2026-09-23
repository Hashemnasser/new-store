// src/features/wishlist/hooks/useWishlist.ts

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { wishlistApi } from "../api/wishlist.api";
import type {
  AddToWishlistPayload,
  WishlistItem,
} from "../types/wishlist.types";

// ============================================================
// ❤️ Hooks الخاصة بقائمة الرغبات
// ============================================================

export const useWishlist = () => {
  const queryClient = useQueryClient();

  // جلب قائمة الرغبات
  const {
    data: wishlist,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["wishlist"],
    queryFn: () => wishlistApi.getWishlist(),
    staleTime: 5 * 60 * 1000,
  });

  // إضافة إلى قائمة الرغبات
  const addToWishlistMutation = useMutation({
    mutationFn: (data: AddToWishlistPayload) => wishlistApi.addToWishlist(data),
    onSuccess: (_newItem) => {
      queryClient.invalidateQueries({ queryKey: ["wishlist"] });
      toast.success("تم إضافة المنتج إلى قائمة الرغبات");
    },
    onError: (error: Error) => {
      toast.error(error.message || "حدث خطأ أثناء الإضافة");
    },
  });

  // حذف من قائمة الرغبات
  const removeFromWishlistMutation = useMutation({
    mutationFn: (productId: string) =>
      wishlistApi.removeFromWishlist(productId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wishlist"] });
      // queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success("تم إزالة المنتج من قائمة الرغبات");
    },
    onError: (error: Error) => {
      toast.error(error.message || "حدث خطأ أثناء الإزالة");
    },
  });

  // ✅ التحقق من وجود المنتج في القائمة (مع التحقق من وجود wishlist و items)
  const checkInWishlist = (productId: string): boolean => {
    if (!wishlist || !wishlist.data.items) return false;
    return wishlist.data.items.some(
      (item: WishlistItem) => item.productId === productId
    );
  };

  // تفريغ القائمة
  const clearWishlistMutation = useMutation({
    mutationFn: () => wishlistApi.clearWishlist(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wishlist"] });
      toast.success("تم تفريغ قائمة الرغبات");
    },
    onError: (error: Error) => {
      toast.error(error.message || "حدث خطأ أثناء التفريغ");
    },
  });

  return {
    // البيانات
    wishlist,
    items: wishlist?.data?.items || [],
    isLoading,
    error,

    // الإجراءات
    addToWishlist: addToWishlistMutation.mutate,
    removeFromWishlist: removeFromWishlistMutation.mutate,
    clearWishlist: clearWishlistMutation.mutate,
    isInWishlist: checkInWishlist,

    // حالات التحميل
    isAdding: addToWishlistMutation.isPending,
    isRemoving: removeFromWishlistMutation.isPending,
    isClearing: clearWishlistMutation.isPending,
  };
};
