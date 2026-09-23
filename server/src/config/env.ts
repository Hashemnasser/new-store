// server/src/config/env.ts

import dotenv from "dotenv";

// ✅ يُنفَّذ عند أول استيراد لهذا الملف
dotenv.config();

console.log("✅ Environment variables loaded from .env");
