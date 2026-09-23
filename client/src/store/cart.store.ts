// src/store/cart.store.ts

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { Cart, CartItem } from "../features/cart/types/cart.types";

// ============================================================
// 🛒 Zustand Store لإدارة حالة السلة (محلياً)
// ============================================================

interface CartStore {
  // الحالة
  items: CartItem[];
  total: number;
  itemCount: number;

  // الإجراءات (Actions) - فقط لتحديث الحالة المحلية
  setCart: (cart: Cart) => void;
  addItem: (item: CartItem) => void;
  updateItem: (id: string, quantity: number) => void;
  removeItem: (id: string) => void;
  clearItems: () => void;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set) => ({
      // الحالة الأولية
      items: [],
      total: 0,
      itemCount: 0,

      // تعيين السلة بالكامل
      setCart: (cart: Cart) => {
        set({
          items: cart.items,
          total: cart.total,
          itemCount: cart.itemCount,
        });
      },

      // إضافة عنصر (تحديث محلي)
      addItem: (item: CartItem) => {
        set((state) => {
          const existingItem = state.items.find((i) => i.id === item.id);
          if (existingItem) {
            // إذا كان العنصر موجوداً، نحدث الكمية
            const updatedItems = state.items.map((i) =>
              i.id === item.id
                ? { ...i, quantity: i.quantity + item.quantity }
                : i
            );
            return {
              items: updatedItems,
              total: updatedItems.reduce(
                (sum, i) => sum + i.variant.price * i.quantity,
                0
              ),
              itemCount: updatedItems.reduce((sum, i) => sum + i.quantity, 0),
            };
          }
          // إذا كان جديداً، نضيفه
          const newItems = [...state.items, item];
          return {
            items: newItems,
            total: newItems.reduce(
              (sum, i) => sum + i.variant.price * i.quantity,
              0
            ),
            itemCount: newItems.reduce((sum, i) => sum + i.quantity, 0),
          };
        });
      },

      // تحديث كمية عنصر (تحديث محلي)
      updateItem: (id: string, quantity: number) => {
        set((state) => {
          const updatedItems = state.items.map((item) =>
            item.id === id ? { ...item, quantity } : item
          );
          return {
            items: updatedItems,
            total: updatedItems.reduce(
              (sum, i) => sum + i.variant.price * i.quantity,
              0
            ),
            itemCount: updatedItems.reduce((sum, i) => sum + i.quantity, 0),
          };
        });
      },

      // حذف عنصر (تحديث محلي)
      removeItem: (id: string) => {
        set((state) => {
          const updatedItems = state.items.filter((item) => item.id !== id);
          return {
            items: updatedItems,
            total: updatedItems.reduce(
              (sum, i) => sum + i.variant.price * i.quantity,
              0
            ),
            itemCount: updatedItems.reduce((sum, i) => sum + i.quantity, 0),
          };
        });
      },

      // تفريغ السلة (تحديث محلي)
      clearItems: () => {
        set({
          items: [],
          total: 0,
          itemCount: 0,
        });
      },
    }),
    {
      name: "cart-storage", // اسم المفتاح في localStorage
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        items: state.items,
        total: state.total,
        itemCount: state.itemCount,
      }),
    }
  )
);
