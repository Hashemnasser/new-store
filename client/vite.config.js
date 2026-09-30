import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
export default defineConfig({
    plugins: [react(), tailwindcss()],
    server: {
        proxy: {
            "/api": "http://localhost:5000",
        },
    },
    build: {
        rollupOptions: {
            output: {
                manualChunks: {
                    "react-vendor": ["react", "react-dom", "react-router-dom"],
                    "query-vendor": ["@tanstack/react-query"],
                    "ui-vendor": ["framer-motion", "lucide-react"],
                    "i18n-vendor": ["i18next", "react-i18next"],
                    "form-vendor": ["react-hook-form", "zod"],
                },
            },
        },
        chunkSizeWarningLimit: 800,
    },
});
