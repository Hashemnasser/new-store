// src/features/orders/types/order.types.ts

import type { ProductVariant } from "../../products/types/product.types";

// ============================================================
// 📦 أنواع الطلبات
// ============================================================

// حالة الطلب (متطابقة مع الباك إند)
export type OrderStatus =
  | "PENDING"
  | "PROCESSING"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELLED";

// عنوان الشحن
export interface ShippingAddress {
  street: string;
  city: string;
  postalCode: string;
  country: string;
}

// عنصر في الطلب
export interface OrderItem {
  id: string;
  orderId: string;
  variantId: string;
  quantity: number;
  price: number;
  variant: Pick<ProductVariant, "id" | "sku" | "size" | "color" | "price"> & {
    product: {
      id: string;
      title: string;
      slug: string;
      images: { url: string; isPrimary: boolean; alt: string }[];
    };
  };
}

// الطلب الكامل
export interface Order {
  id: string;
  userId: string;
  status: OrderStatus;
  totalAmount: number;
  shippingAddress: ShippingAddress;
  items: OrderItem[];
  createdAt: string;
  updatedAt: string;
  stripePaymentIntentId: string;
  user?: {
    // ✅ اختياري (قد لا يكون موجوداً من الباك إند)
    id: string;
    name: string;
    email: string;
  };
}

// طلب مختصر (للعرض في القائمة)
export interface OrderSummary {
  id: string;
  status: OrderStatus;
  totalAmount: number;
  itemsCount: number;
  createdAt: string;
}

// ============================================================
// 📥 نماذج الطلبات
// ============================================================

// طلب إنشاء طلب
export interface CreateOrderPayload {
  shippingAddress: ShippingAddress;
  paymentMethod: "CASH" | "CARD" | "BANK_TRANSFER";
  couponCode: string | undefined;
}

// طلب تحديث حالة الطلب
export interface UpdateOrderStatusPayload {
  status: OrderStatus;
}

// استجابة إنشاء الطلب
export interface CreateOrderResponse {
  success: boolean;
  data: Order;
  message?: string;
}

// استجابة قائمة الطلبات
export interface OrdersResponse {
  success: boolean;
  data: Order[];
}
