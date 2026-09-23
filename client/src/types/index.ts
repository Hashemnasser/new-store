// src/types/index.ts

// ============================================================
// 📦 الأنماط الأساسية (مطابقة للباك إند)
// ============================================================

// src/types/index.ts

// ============================================================
// 📦 تصدير جميع الأنواع من ملف واحد
// ============================================================

// الأنواع المشتركة (Common Types)
export * from "./common.types";

// أنواع API
export * from "./api.types";

// أنواع React Query (اختياري)
export * from "./react-query.types";

// ============================================================
// 📝 إعادة تصدير الأنواع من الميزات المختلفة
// ============================================================

// يمكن إضافة أنواع من features هنا إذا لزم الأمر
// لكن الأفضل استيرادها مباشرة من مجلداتها

// مثال:
// export type { User, Product, Category } from "../types/common.types";

export interface User {
  id: string;
  name: string;
  email: string;
  role: "USER" | "ADMIN";
  image: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProductImage {
  id: string;
  url: string;
  alt: string | null;
  order: number;
  isPrimary: boolean;
}

export interface ProductVariant {
  id: string;
  sku: string;
  size: string | null;
  color: string | null;
  price: number;
  stock: number;
}

export interface Product {
  id: string;
  title: string;
  description: string;
  slug: string;
  categoryId: string;
  category?: Category;
  images: ProductImage[];
  variants: ProductVariant[];
  averageRating: number;
  reviewsCount: number;
  isPublished: boolean;
  featured: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CartItem {
  id: string;
  cartId: string;
  productId: string;
  variantId: string;
  quantity: number;
  product: Product;
  variant: ProductVariant;
}

export interface Cart {
  id: string;
  userId: string;
  items: CartItem[];
  total: number;
  itemCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  id: string;
  orderId: string;
  variantId: string;
  quantity: number;
  price: number;
  variant: ProductVariant;
}

export interface Order {
  id: string;
  userId: string;
  status: "PENDING" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED";
  totalAmount: number;
  shippingAddress: {
    street: string;
    city: string;
    postalCode: string;
    country: string;
  };
  items: OrderItem[];
  createdAt: string;
  updatedAt: string;
}

export interface Review {
  id: string;
  rating: number;
  comment: string;
  userId: string;
  productId: string;
  user: {
    id: string;
    name: string;
    image: string | null;
  };
  product: Product;
  createdAt: string;
  updatedAt: string;
}

export interface WishlistItem {
  id: string;
  wishlistId: string;
  productId: string;
  product: Product;
  createdAt: string;
}

export interface Wishlist {
  id: string;
  userId: string;
  items: WishlistItem[];
  createdAt: string;
  updatedAt: string;
}

// ============================================================
// 🔐 أنواع الـ API Responses
// ============================================================

export interface ApiResponse<T = any> {
  success: boolean;
  data: T;
  message?: string;
}

export interface SignInResponse {
  token: string;
  user: User;
}

export interface SignUpResponse {
  user: User;
  token: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
