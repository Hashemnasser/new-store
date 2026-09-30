// src/main.tsx
import React, { Suspense } from "react";
import ReactDOM from "react-dom/client";
import { HelmetProvider } from "react-helmet-async";
import { RouterProvider } from "react-router-dom";
import { router } from "./app/router";
import { PageLoader } from "./components/PageLoader";
import "./lib/i18n";
import { Providers } from "./providers";
import "./styles/globals.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <HelmetProvider>
      <Providers>
        <Suspense fallback={<PageLoader />}>
          <RouterProvider router={router} />
        </Suspense>
      </Providers>
    </HelmetProvider>
  </React.StrictMode>
);
