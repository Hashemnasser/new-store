// src/app/router/index.tsx

import { lazy } from "react";
import { createBrowserRouter } from "react-router-dom";
import { AdminGuard } from "../guards/AdminGuard";
import { AuthGuard } from "../guards/AuthGuard";
import { GuestGuard } from "../guards/GuestGuard";
import { AuthLayout } from "../layouts/AuthLayout";
import { DashboardLayout } from "../layouts/DashboardLayout";
import { MainLayout } from "../layouts/MainLayout";
import { ROUTES } from "./route.constants";

// ============================================================
// 🌐 الصفحات العامة
// ============================================================
const HomePage = lazy(() =>
  import("../../pages/home/HomePage").then((m) => ({ default: m.HomePage }))
);
const ProductsPage = lazy(() =>
  import("../../pages/products/ProductsPage").then((m) => ({
    default: m.ProductsPage,
  }))
);
const ProductPage = lazy(() =>
  import("../../pages/product/ProductPage").then((m) => ({
    default: m.ProductPage,
  }))
);
const AboutPage = lazy(() =>
  import("../../pages/about/AboutPage").then((m) => ({ default: m.AboutPage }))
);
const ContactPage = lazy(() =>
  import("../../pages/contact/ContactPage").then((m) => ({
    default: m.ContactPage,
  }))
);
const NotFoundPage = lazy(() =>
  import("../../pages/not-found/NotFoundPage").then((m) => ({
    default: m.NotFoundPage,
  }))
);

// ============================================================
// 🔐 صفحات المصادقة
// ============================================================
const LoginPage = lazy(() =>
  import("../../pages/auth/LoginPage").then((m) => ({ default: m.LoginPage }))
);
const RegisterPage = lazy(() =>
  import("../../pages/auth/RegisterPage").then((m) => ({
    default: m.RegisterPage,
  }))
);
const ForgotPasswordPage = lazy(() =>
  import("../../pages/auth/ForgotPasswordPage").then((m) => ({
    default: m.ForgotPasswordPage,
  }))
);
const ResetPasswordPage = lazy(() =>
  import("../../pages/auth/ResetPasswordPage").then((m) => ({
    default: m.ResetPasswordPage,
  }))
);

// ============================================================
// 👤 صفحات المستخدم (Protected)
// ============================================================
const CartPage = lazy(() =>
  import("../../pages/cart/CartPage").then((m) => ({ default: m.CartPage }))
);
const CheckoutPage = lazy(() =>
  import("../../pages/checkout/CheckoutPage").then((m) => ({
    default: m.CheckoutPage,
  }))
);
const SuccessPage = lazy(() =>
  import("../../pages/checkout/SuccessPage").then((m) => ({
    default: m.SuccessPage,
  }))
);
const CheckoutFailedPage = lazy(() =>
  import("../../pages/checkout/CheckoutFailedPage").then((m) => ({
    default: m.CheckoutFailedPage,
  }))
);
const OrdersPage = lazy(() =>
  import("../../pages/user/OrdersPage").then((m) => ({
    default: m.OrdersPage,
  }))
);
const OrderDetailsPage = lazy(() =>
  import("../../pages/user/OrderDetailsPage").then((m) => ({
    default: m.OrderDetailsPage,
  }))
);
const WishlistPage = lazy(() =>
  import("../../pages/user/WishlistPage").then((m) => ({
    default: m.WishlistPage,
  }))
);
const ProfilePage = lazy(() =>
  import("../../pages/user/ProfilePage").then((m) => ({
    default: m.ProfilePage,
  }))
);
const SettingsPage = lazy(() =>
  import("../../pages/user/SettingsPage").then((m) => ({
    default: m.SettingsPage,
  }))
);
const MyReviewsPage = lazy(() =>
  import("../../pages/user/MyReviewsPage").then((m) => ({
    default: m.MyReviewsPage,
  }))
);

// ============================================================
// 🛠️ صفحات المدير (Admin)
// ============================================================
const AdminDashboardPage = lazy(() =>
  import("../../pages/admin/DashboardPage").then((m) => ({
    default: m.AdminDashboardPage,
  }))
);
const AdminProductsPage = lazy(() =>
  import("../../pages/admin/ProductsPage").then((m) => ({
    default: m.AdminProductsPage,
  }))
);
const AdminOrdersPage = lazy(() =>
  import("../../pages/admin/OrdersPage").then((m) => ({
    default: m.AdminOrdersPage,
  }))
);
const AdminUsersPage = lazy(() =>
  import("../../pages/admin/UsersPage").then((m) => ({
    default: m.AdminUsersPage,
  }))
);
const AdminReviewsPage = lazy(() =>
  import("../../pages/admin/ReviewsPage").then((m) => ({
    default: m.AdminReviewsPage,
  }))
);
const AdminSettingsPage = lazy(() =>
  import("../../pages/admin/AdminSettingsPage").then((m) => ({
    default: m.AdminSettingsPage,
  }))
);
const AdminCouponsPage = lazy(() =>
  import("../../pages/admin/AdminCouponsPage").then((m) => ({
    default: m.AdminCouponsPage,
  }))
);
const CategoriesPage = lazy(() =>
  import("../../pages/admin/CategoriesPage").then((m) => ({
    default: m.CategoriesPage,
  }))
);
const ProductFormPage = lazy(() =>
  import("../../pages/admin/ProductFormPage").then((m) => ({
    default: m.ProductFormPage,
  }))
);

// ============================================================
// 🚦 الراوتر
// ============================================================
export const router = createBrowserRouter([
  // 🌐 المسارات العامة
  {
    path: ROUTES.HOME,
    element: <MainLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: ROUTES.PRODUCTS, element: <ProductsPage /> },
      { path: "product/:slug", element: <ProductPage /> },
      { path: ROUTES.ABOUT, element: <AboutPage /> },
      { path: ROUTES.CONTACT, element: <ContactPage /> },
    ],
  },

  // 🔐 المصادقة
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

  // 👤 المستخدم
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
          { path: ":id", element: <OrderDetailsPage /> },
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

  // 🛠️ المدير
  {
    element: <AdminGuard />,
    children: [
      {
        path: ROUTES.ADMIN,
        element: <DashboardLayout />,
        children: [
          { index: true, element: <AdminDashboardPage /> },
          { path: "categories", element: <CategoriesPage /> },
          { path: "products", element: <AdminProductsPage /> },
          { path: "orders", element: <AdminOrdersPage /> },
          { path: "users", element: <AdminUsersPage /> },
          { path: "reviews", element: <AdminReviewsPage /> },
          { path: "product/create", element: <ProductFormPage /> },
          { path: "product/:slug/edit", element: <ProductFormPage /> },
          { path: "settings", element: <AdminSettingsPage /> },
          { path: "coupons", element: <AdminCouponsPage /> },
        ],
      },
    ],
  },

  // 🚫 404
  {
    path: "*",
    element: <NotFoundPage />,
  },
]);
