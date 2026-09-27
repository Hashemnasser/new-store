"use strict";
// src/lib/prisma.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.prisma = void 0;
const client_1 = require("../generated/prisma/client.js");
// نستخدم متغير عالمي لتجنب إنشاء عدة اتصالات أثناء التطوير (Hot Reload)
const globalForPrisma = globalThis;
// إنشاء Prisma Client مرة واحدة فقط
exports.prisma = globalForPrisma.prisma ??
    new client_1.PrismaClient({
        log: ["error", "warn"],
    });
// حفظه في global في بيئة التطوير
if (process.env.NODE_ENV !== "production") {
    globalForPrisma.prisma = exports.prisma;
}
