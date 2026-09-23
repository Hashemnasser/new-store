// src/components/ui/Button.tsx

import React from "react";
import { cn } from "../../utils/helpers";
import { LoadingSpinner } from "../feedback/LoadingSpinner";

// ============================================================
// 🔘 أنواع وأحجام الزر
// ============================================================

export type ButtonVariant =
  | "primary"
  | "secondary"
  | "danger"
  | "outline"
  | "ghost";
export type ButtonSize = "sm" | "md" | "lg";

// ============================================================
// 📦 خصائص مكون الزر
// ============================================================

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  loadingText?: string;
  fullWidth?: boolean;
  asChild?: boolean; // لاستخدامه مع Link أو أي مكون آخر (اختياري)
}

// ============================================================
// 🎨 كلاسات الأنماط حسب النوع والحجم
// ============================================================

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-blue-600 hover:bg-blue-700 text-white shadow-sm hover:shadow focus:ring-blue-500",
  secondary:
    "bg-gray-200 hover:bg-gray-300 text-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-white focus:ring-gray-500",
  danger:
    "bg-red-600 hover:bg-red-700 text-white shadow-sm hover:shadow focus:ring-red-500",
  outline:
    "border-2 border-blue-600 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/20 focus:ring-blue-500",
  ghost:
    "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 focus:ring-gray-500",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "px-3 py-1.5 text-sm rounded-lg",
  md: "px-4 py-2 text-sm rounded-lg",
  lg: "px-6 py-3 text-base rounded-xl",
};

// ============================================================
// 🧩 مكون الزر الرئيسي
// ============================================================

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      isLoading = false,
      loadingText,
      fullWidth = false,
      className = "",
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const baseClasses =
      "inline-flex items-center justify-center gap-2 font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed";

    const widthClass = fullWidth ? "w-full" : "";

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(
          baseClasses,
          variantClasses[variant],
          sizeClasses[size],
          widthClass,
          className
        )}
        {...props}
      >
        {isLoading && (
          <>
            <LoadingSpinner size="sm" />
            <span>{loadingText || "جاري..."}</span>
          </>
        )}
        {!isLoading && children}
      </button>
    );
  }
);

Button.displayName = "Button";

export default Button;
