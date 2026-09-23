// src/features/cart/hooks/useCart.ts

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useCartStore } from "../../../store/cart.store";
import { cartApi } from "../api/cart.api";
import type { AddToCartPayload } from "../types/cart.types";

// ============================================================
// 🪝 Hook مخصص للتعامل مع السلة
// ============================================================

export const useCart = () => {
  const queryClient = useQueryClient();
  const {
    setCart,
    addItem,
    updateItem,
    removeItem,
    clearItems,
    items,
    total,
    itemCount,
  } = useCartStore();
  // ============================================================
  // 📥 جلب السلة (باستخدام React Query)
  // ============================================================
  const {
    data: cart,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["cart"],
    queryFn: async () => {
      const data = await cartApi.getCart();
      const cartData = data.data;
      setCart(cartData); // تحديث الـ Store المحلي
      console.log("cartData2222@@::", cartData);
      console.log("items####", total);

      return cartData;
    },
    staleTime: 5 * 60 * 1000, // 5 دقائق
  });

  // ============================================================
  // ➕ إضافة عنصر إلى السلة
  // ============================================================
  const addToCartMutation = useMutation({
    mutationFn: (data: AddToCartPayload) => cartApi.addToCart(data),
    onSuccess: (newItem) => {
      // تحديث الـ Store المحلي
      console.log("newItem...::", newItem);
      addItem(newItem.data);
      // إبطال Query لجلب البيانات من جديد (للتأكد من التزامن)
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      toast.success("تم إضافة المنتج إلى السلة");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "حدث خطأ أثناء الإضافة");
    },
  });

  // ============================================================
  // 🔄 تحديث كمية عنصر في السلة
  // ============================================================
  const updateCartItemMutation = useMutation({
    mutationFn: ({ id, quantity }: { id: string; quantity: number }) =>
      cartApi.updateCartItem(id, quantity),
    onSuccess: (updatedItem) => {
      // تحديث الـ Store المحلي
      updateItem(updatedItem.id, updatedItem.quantity);
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "حدث خطأ أثناء التحديث");
    },
  });

  // ============================================================
  // ❌ حذف عنصر من السلة
  // ============================================================
  const removeFromCartMutation = useMutation({
    mutationFn: (id: string) => cartApi.removeFromCart(id),
    onSuccess: (_, id) => {
      // تحديث الـ Store المحلي
      removeItem(id);
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      toast.success("تم حذف المنتج من السلة");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "حدث خطأ أثناء الحذف");
    },
  });

  // ============================================================
  // 🗑️ تفريغ السلة بالكامل
  // ============================================================
  const clearCartMutation = useMutation({
    mutationFn: () => cartApi.clearCart(),
    onSuccess: () => {
      // تحديث الـ Store المحلي
      clearItems();
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      toast.success("تم تفريغ السلة");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "حدث خطأ أثناء التفريغ");
    },
  });

  // ============================================================
  // 📦 القيم المصدرة
  // ============================================================
  return {
    // الحالة من الـ Store المحلي
    items,
    total,
    itemCount,

    // الحالة من React Query
    cart,
    isLoading,
    error,

    // الإجراءات
    addToCart: addToCartMutation.mutate,
    updateCartItem: updateCartItemMutation.mutate,
    removeFromCart: removeFromCartMutation.mutate,
    clearCart: clearCartMutation.mutate,

    // حالات التحميل
    isAdding: addToCartMutation.isPending,
    isUpdating: updateCartItemMutation.isPending,
    isRemoving: removeFromCartMutation.isPending,
    isClearing: clearCartMutation.isPending,
  };
};
