// src/components/feedback/LoadingSpinner.tsx

import { cn } from "../../utils/helpers"; // سننشئها لاحقاً، أو استخدم الدمج المباشر

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
  fullScreen?: boolean;
}

const sizeClasses = {
  sm: "w-5 h-5 border-2",
  md: "w-8 h-8 border-3",
  lg: "w-12 h-12 border-4",
};

export const LoadingSpinner = ({
  size = "md",
  className = "",
  fullScreen = false,
}: LoadingSpinnerProps) => {
  const spinner = (
    <div
      className={cn(
        "inline-block animate-spin rounded-full border-solid border-blue-600 border-t-transparent",
        sizeClasses[size],
        className
      )}
      role="status"
      aria-label="جاري التحميل"
    >
      <span className="sr-only">جاري التحميل...</span>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] w-full">
        {spinner}
      </div>
    );
  }

  return spinner;
};
