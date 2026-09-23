// src/components/layout/PageContainer.tsx

import React from "react";
import { useLanguage } from "../../providers/LanguageProvider";
import { cn } from "../../utils/helpers";

interface PageContainerProps {
  children: React.ReactNode;
  className?: string;
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl" | "full" | "7xl";
}

export const PageContainer = ({
  children,
  className = "",
  maxWidth = "7xl",
}: PageContainerProps) => {
  const maxWidthClasses = {
    sm: "max-w-screen-sm",
    md: "max-w-screen-md",
    lg: "max-w-screen-lg",
    xl: "max-w-screen-xl",
    "2xl": "max-w-screen-2xl",
    "7xl": "max-w-7xl",
    full: "max-w-full",
  };
  const { dir } = useLanguage();

  return (
    <div
      className={cn(
        "mx-auto px-4 sm:px-6 lg:px-8 py-16   drop-shadow-md text-shadow text-shadow-amber-600",

        "min-h-screen",
        maxWidthClasses[maxWidth],
        className
      )}
      dir={dir}
    >
      {children}
    </div>
  );
};
