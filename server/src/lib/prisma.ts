// src/lib/prisma.ts

import { PrismaClient } from "@/generated/prisma/client";
// نستخدم متغير عالمي لتجنب إنشاء عدة اتصالات أثناء التطوير (Hot Reload)
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// إنشاء Prisma Client مرة واحدة فقط
export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: ["error", "warn"],
  });

// حفظه في global في بيئة التطوير
if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
