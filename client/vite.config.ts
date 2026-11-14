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
        manualChunks(id) {
          // لو المسار جوا node_modules
          if (id.includes("node_modules")) {
            if (id.includes("react-router")) return "router-vendor";
            if (id.includes("react-dom") || id.includes("react"))
              return "react-vendor"; // ← بتمسك كل حاجة فيها react
            if (id.includes("@tanstack/react-query")) return "query-vendor";
            if (id.includes("framer-motion")) return "motion-vendor";
            if (id.includes("lucide-react")) return "icons-vendor";
            if (id.includes("i18next")) return "i18n-vendor";
            if (id.includes("react-hook-form") || id.includes("zod"))
              return "form-vendor";
          }
        },
      },
    },

    chunkSizeWarningLimit: 600,
  },
});
