// src/app/router/index.tsx

import { createBrowserRouter } from "react-router-dom";
import { AdminGuard } from "../guards/AdminGuard";
import { AuthGuard } from "../guards/AuthGuard";
import { GuestGuard } from "../guards/GuestGuard";
import { AuthLayout } from "../layouts/AuthLayout";
import { DashboardLayout } from "../layouts/DashboardLayout";
import { MainLayout } from "../layouts/MainLayout";

// 📄 استيراد الصفحات العامة
import { LoginPage } from "../../pages/auth/LoginPage";
import { RegisterPage } from "../../pages/auth/RegisterPage";
import { HomePage } from "../../pages/home/HomePage";
import { NotFoundPage } from "../../pages/not-found/NotFoundPage";
import { ProductPage } from "../../pages/product/ProductPage";
import { ProductsPage } from "../../pages/products/ProductsPage";

// 📄 استيراد صفحات المستخدم (Protected)
import { CartPage } from "../../pages/cart/CartPage";
import { CheckoutPage } from "../../pages/checkout/CheckoutPage";
import { SuccessPage } from "../../pages/checkout/SuccessPage";
import { OrdersPage } from "../../pages/user/OrdersPage";
import { WishlistPage } from "../../pages/user/WishlistPage";

// 📄 استيراد صفحات المدير (Admin)
import { AdminDashboardPage } from "../../pages/admin/DashboardPage";
import { AdminOrdersPage } from "../../pages/admin/OrdersPage";
import { AdminProductsPage } from "../../pages/admin/ProductsPage";
import { AdminReviewsPage } from "../../pages/admin/ReviewsPage";
import { AdminUsersPage } from "../../pages/admin/UsersPage";

// 🔗 استيراد ثوابت المسارات
import { AboutPage } from "../../pages/about/AboutPage";
import { AdminCouponsPage } from "../../pages/admin/AdminCouponsPage";
import { AdminSettingsPage } from "../../pages/admin/AdminSettingsPage";
import { CategoriesPage } from "../../pages/admin/CategoriesPage";
import { ProductFormPage } from "../../pages/admin/ProductFormPage";
import { ForgotPasswordPage } from "../../pages/auth/ForgotPasswordPage";
import { ResetPasswordPage } from "../../pages/auth/ResetPasswordPage";
import { CheckoutFailedPage } from "../../pages/checkout/CheckoutFailedPage";
import { ContactPage } from "../../pages/contact/ContactPage";
import { MyReviewsPage } from "../../pages/user/MyReviewsPage";
import { OrderDetailsPage } from "../../pages/user/OrderDetailsPage";
import { ProfilePage } from "../../pages/user/ProfilePage";
import { SettingsPage } from "../../pages/user/SettingsPage";
import { ROUTES } from "./route.constants";

export const router = createBrowserRouter([
  // ============================================================
  // 🌐 المسارات العامة (لا تحتاج مصادقة)
  // ============================================================
  {
    path: ROUTES.HOME,
    element: <MainLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: ROUTES.PRODUCTS, element: <ProductsPage /> },
      { path: "product/:slug", element: <ProductPage /> },
      { path: ROUTES.ABOUT, element: <AboutPage /> }, // ✅ جديد
      { path: ROUTES.CONTACT, element: <ContactPage /> },
    ],
  },

  // ============================================================
  // 🔐 مسارات المصادقة (مع GuestGuard - تمنع الوصول إذا كان مسجلاً)
  // ============================================================
  {
    element: <GuestGuard />,
    children: [
      {
        path: ROUTES.LOGIN,
        element: <AuthLayout />,
        children: [{ index: true, element: <LoginPage /> }],
      },
      {
        path: ROUTES.REGISTER,
        element: <AuthLayout />,
        children: [{ index: true, element: <RegisterPage /> }],
      },
      { path: ROUTES.FORGOT_PASSWORD, element: <ForgotPasswordPage /> },
      { path: ROUTES.RESET_PASSWORD, element: <ResetPasswordPage /> },
    ],
  },

  // ============================================================
  // 🛡️ المسارات المحمية (مع AuthGuard)
  // ============================================================
  {
    element: <AuthGuard />,
    children: [
      {
        path: ROUTES.SETTINGS,
        element: <MainLayout />,
        children: [{ index: true, element: <SettingsPage /> }],
      },
      {
        path: ROUTES.PROFILE,
        element: <MainLayout />,
        children: [{ index: true, element: <ProfilePage /> }],
      },

      {
        path: ROUTES.WISHLIST,
        element: <MainLayout />,
        children: [{ index: true, element: <WishlistPage /> }],
      },
      {
        path: ROUTES.CART,
        element: <MainLayout />,
        children: [{ index: true, element: <CartPage /> }],
      },
      {
        path: ROUTES.ORDERS,
        element: <MainLayout />,
        children: [
          { index: true, element: <OrdersPage /> },
          { path: ":id", element: <OrderDetailsPage /> }, // ✅ المسار الجديد
        ],
      },
      {
        path: ROUTES.CHECKOUT,
        element: <MainLayout />,
        children: [{ index: true, element: <CheckoutPage /> }],
      },
      {
        path: ROUTES.CHECKOUT_SUCCESS,
        element: <MainLayout />,
        children: [{ index: true, element: <SuccessPage /> }],
      },
      {
        path: ROUTES.CHECKOUT_FAILED,
        element: <MainLayout />,
        children: [{ index: true, element: <CheckoutFailedPage /> }],
      },
      {
        path: ROUTES.REVIEWS,
        element: <MainLayout />,
        children: [{ index: true, element: <MyReviewsPage /> }],
      },
    ],
  },

  // ============================================================
  // 🔐 مسارات المدير (مع AdminGuard)
  // ============================================================
  {
    element: <AdminGuard />,
    children: [
      {
        path: ROUTES.ADMIN,
        element: <DashboardLayout />,
        children: [
          { index: true, element: <AdminDashboardPage /> },
          {
            path: "categories",
            element: <CategoriesPage />,
          },
          { path: "products", element: <AdminProductsPage /> },
          { path: "orders", element: <AdminOrdersPage /> },
          { path: "users", element: <AdminUsersPage /> },
          { path: "reviews", element: <AdminReviewsPage /> },
          { path: "product/create", element: <ProductFormPage /> }, // ✅ إضافة هذا المسار
          {
            path: "product/:slug/edit", // ✅ استخدام slug بدلاً من id
            element: <ProductFormPage />,
          },
          { path: "settings", element: <AdminSettingsPage /> }, // ✅ جديد
          { path: "coupons", element: <AdminCouponsPage /> }, // ✅ مسار إدارة الكوبونات
        ],
      },
    ],
  },

  // ============================================================
  // 🚫 صفحة غير موجودة (404)
  // ============================================================
  {
    path: "*",
    element: <NotFoundPage />,
  },
]);
