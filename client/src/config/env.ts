// src/config/env.ts

import { z } from "zod";

// ============================================================
// 🔐 التحقق من المتغيرات البيئية
// ============================================================

const envSchema = z.object({
  VITE_API_URL: z.string().url().default("http://localhost:5000/api"),
  VITE_APP_NAME: z.string().default("ProStore"),
  VITE_APP_VERSION: z.string().default("1.0.0"),
  VITE_NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
});

// ============================================================
// ✅ استخراج المتغيرات مع التحقق
// ============================================================

const parsedEnv = envSchema.safeParse(import.meta.env);

if (!parsedEnv.success) {
  console.error(
    "❌ Invalid environment variables:",
    parsedEnv.error.flatten().fieldErrors
  );
  throw new Error("Invalid environment variables");
}

export const env = parsedEnv.data;

// ============================================================
// 📦 تصدير المتغيرات بشكل منفصل للراحة
// ============================================================

export const API_URL = env.VITE_API_URL;
export const APP_NAME = env.VITE_APP_NAME;
export const APP_VERSION = env.VITE_APP_VERSION;
export const NODE_ENV = env.VITE_NODE_ENV;
