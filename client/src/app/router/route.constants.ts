// src/app/router/route.constants.ts

// ============================================================
// 🔗 ثوابت المسارات (Routes Constants)
// ============================================================
// استخدام as const لتأمين القيم ومنع التعديل
// ============================================================

export const ROUTES = {
  // ============================================================
  // 🌐 المسارات العامة (Public Routes)
  // ============================================================
  HOME: "/",
  PRODUCTS: "/products",
  PRODUCT_DETAILS: (slug: string) => `/product/${slug}`,
  SEARCH: "/search",
  CATEGORIES: "/categories",
  ABOUT: "/about",
  CONTACT: "/contact",
  // ============================================================
  // 🔐 مسارات المصادقة (Auth Routes)
  // ============================================================
  LOGIN: "/login",
  REGISTER: "/register",
  FORGOT_PASSWORD: "/forgot-password",
  RESET_PASSWORD: "/reset-password/:token",

  // ============================================================
  // 👤 مسارات المستخدم (Protected Routes)
  // ============================================================
  CART: "/cart",
  CHECKOUT: "/checkout",
  CHECKOUT_SUCCESS: "/checkout/success",
  PROFILE: "/profile",
  ORDERS: "/orders",
  ORDER_DETAILS: (id: string) => `/orders/${id}`,
  WISHLIST: "/wishlist",
  SETTINGS: "/settings",
  REVIEWS: "/reviews",
  CHECKOUT_FAILED: "/checkout/failed",
  // ============================================================
  // 🔐 مسارات المدير (Admin Routes)
  // ============================================================
  ADMIN: "/admin",
  ADMIN_DASHBOARD: "/admin",
  ADMIN_PRODUCTS: "/admin/products",
  ADMIN_PRODUCTS_CREATE: "/admin/product/create",

  ADMIN_PRODUCT_EDIT: (slug: string) => `/admin/product/${slug}/edit`, // ✅ استخدام slug  ADMIN_CATEGORIES: "/admin/categories",
  ADMIN_CATEGORIES: "/admin/categories", // ✅ إضافة المسار المفقود
  ADMIN_ORDERS: "/admin/orders",
  ADMIN_USERS: "/admin/users",
  ADMIN_REVIEWS: "/admin/reviews",
  ADMIN_SETTINGS: "/admin/settings",
  ADMIN_COUPONS: "/admin/coupons",
  // ============================================================
  // 🚫 صفحات الخطأ
  // ============================================================
  NOT_FOUND: "/404",
  ERROR: "/error",
} as const;

// ============================================================
// 🧩 أنواع المسارات (للاستخدام في TypeScript)
// ============================================================
export type AppRoutes = typeof ROUTES;
export type RouteKey = keyof AppRoutes;

// ============================================================
// 📋 تجميع المسارات حسب النوع
// ============================================================

// المسارات العامة (لا تحتاج مصادقة)
export const PUBLIC_ROUTES = [
  ROUTES.HOME,
  ROUTES.PRODUCTS,
  ROUTES.SEARCH,
  ROUTES.CATEGORIES,
  ROUTES.LOGIN,
  ROUTES.REGISTER,
  ROUTES.FORGOT_PASSWORD,
  ROUTES.RESET_PASSWORD,
] as const;

// المسارات المحمية (تتطلب مصادقة)
export const PROTECTED_ROUTES = [
  ROUTES.CART,
  ROUTES.CHECKOUT,
  ROUTES.PROFILE,
  ROUTES.ORDERS,
  ROUTES.WISHLIST,
  ROUTES.SETTINGS,
  ROUTES.REVIEWS,
] as const;

// مسارات المدير (تتطلب صلاحيات Admin)
export const ADMIN_ROUTES = [
  ROUTES.ADMIN,
  ROUTES.ADMIN_DASHBOARD,
  ROUTES.ADMIN_PRODUCTS,
  ROUTES.ADMIN_PRODUCTS_CREATE,
  ROUTES.ADMIN_PRODUCT_EDIT,
  ROUTES.ADMIN_CATEGORIES,
  ROUTES.ADMIN_ORDERS,
  ROUTES.ADMIN_USERS,
  ROUTES.ADMIN_REVIEWS,
  ROUTES.ADMIN_COUPONS,
] as const;

// ============================================================
// 🔍 دوال مساعدة للتحقق من المسارات
// ============================================================

/**
 * التحقق مما إذا كان المسار عاماً (Public)
 */
export function isPublicRoute(path: string): boolean {
  return PUBLIC_ROUTES.some((route) => {
    // التعامل مع المسارات الديناميكية (مثل /products/:slug)
    if (route.includes(":")) {
      return path.startsWith(route.split(":")[0]);
    }
    return path === route;
  });
}

/**
 * التحقق مما إذا كان المسار محمياً (Protected)
 */
export function isProtectedRoute(path: string): boolean {
  return PROTECTED_ROUTES.some((route) => path === route);
}

/**
 * التحقق مما إذا كان المسار خاصاً بالمدير (Admin)
 */
export function isAdminRoute(path: string): boolean {
  return ADMIN_ROUTES.some((route) => {
    if (route === "/admin") return path === route || path.startsWith("/admin/");
    return path === route;
  });
}
