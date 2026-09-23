// src/providers/ToastProvider.tsx

import React from "react";
import { Toaster } from "sonner";

export const ToastProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      {children}
      <Toaster
        position="top-right"
        richColors
        closeButton
        duration={4000}
        className="font-sans"
      />
    </>
  );
};
