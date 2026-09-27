"use strict";
// server/src/config/env.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
// ✅ يُنفَّذ عند أول استيراد لهذا الملف
dotenv_1.default.config();
console.log("✅ Environment variables loaded from .env");
