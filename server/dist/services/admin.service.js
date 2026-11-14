"use strict";
// server/src/services/admin.service.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDashboardStats = getDashboardStats;
exports.getUserGrowth = getUserGrowth;
exports.getOrdersByStatus = getOrdersByStatus;
exports.getTopCategories = getTopCategories;
exports.getSalesAnalytics = getSalesAnalytics;
exports.getLowStockProducts = getLowStockProducts;
exports.replenishStock = replenishStock;
const app_error_1 = require("../errors/app-error.js");
const prisma_1 = require("../lib/prisma");
// ============================================================
// دالة جلب إحصائيات لوحة التحكم الرئيسية (مُحسّنة)
// ============================================================
async function getDashboardStats() {
    const [totalUsers, totalProducts, totalOrders, totalRevenue, recentOrders, topProducts, categoryDistribution, userGrowth, ordersByStatus,] = await Promise.all([
        // 1. عدد المستخدمين
        prisma_1.prisma.user.count(),
        // 2. عدد المنتجات
        prisma_1.prisma.product.count(),
        // 3. عدد الطلبات
        prisma_1.prisma.order.count(),
        // 4. إجمالي الإيرادات
        prisma_1.prisma.order.aggregate({
            _sum: { totalAmount: true },
            where: { status: { not: "CANCELLED" } },
        }),
        // 5. أحدث 5 طلبات
        prisma_1.prisma.order.findMany({
            take: 5,
            orderBy: { createdAt: "desc" },
            include: {
                user: {
                    select: { id: true, name: true, email: true },
                },
            },
        }),
        // 6. أفضل 5 منتجات مبيعاً
        prisma_1.prisma.orderItem
            .groupBy({
            by: ["variantId"],
            _sum: { quantity: true },
            orderBy: { _sum: { quantity: "desc" } },
            take: 5,
        })
            .then(async (items) => {
            const variantIds = items.map((item) => item.variantId);
            const variants = await prisma_1.prisma.productVariant.findMany({
                where: { id: { in: variantIds } },
                select: {
                    id: true,
                    price: true,
                    product: {
                        select: {
                            id: true,
                            title: true,
                            slug: true,
                            images: {
                                where: { isPrimary: true },
                                take: 1,
                                select: { url: true },
                            },
                        },
                    },
                },
            });
            const variantsMap = new Map(variants.map((variant) => [variant.id, variant]));
            return items.map((item) => {
                const variant = variantsMap.get(item.variantId);
                return {
                    productId: variant?.product.id || "",
                    title: variant?.product.title || "Unknown",
                    slug: variant?.product.slug || "",
                    image: variant?.product.images[0]?.url || "",
                    totalSold: item._sum.quantity || 0,
                    price: variant?.price || 0,
                };
            });
        }),
        // 7. توزيع المنتجات حسب التصنيف
        prisma_1.prisma.product
            .groupBy({
            by: ["categoryId"],
            _count: { categoryId: true },
        })
            .then(async (items) => {
            const categoryIds = items.map((item) => item.categoryId);
            const categories = await prisma_1.prisma.category.findMany({
                where: { id: { in: categoryIds } },
                select: { id: true, name: true },
            });
            return items.map((item) => {
                const category = categories.find((c) => c.id === item.categoryId);
                return {
                    category: category?.name || "Unknown",
                    count: item._count.categoryId || 0,
                };
            });
        }),
        // 8. نمو المستخدمين (جديد)
        getUserGrowth(),
        // 9. توزيع الطلبات حسب الحالة (جديد)
        getOrdersByStatus(),
    ]);
    return {
        totalUsers,
        totalProducts,
        totalOrders,
        totalRevenue: totalRevenue._sum.totalAmount ?? 0,
        recentOrders,
        topProducts,
        categoryDistribution,
        userGrowth,
        ordersByStatus,
    };
}
// ============================================================
// دوال إحصائية مساعدة جديدة
// ============================================================
/**
 * حساب نمو المستخدمين (إجمالي، عدد المستخدمين الجدد في الشهر الماضي، نسبة النمو)
 *
 *
 */
// server/src/services/admin.service.ts
/**
 * حساب نمو المستخدمين خلال فترة زمنية محددة
 * @param days - عدد الأيام (افتراضي: 30 يوماً)
 * @returns إجمالي المستخدمين + الجدد في الفترة + معدل النمو الفعلي
 */
async function getUserGrowth(days = 30) {
    // ✅ فترة ثابتة (30 يوماً) — لا تتأثر بعدد أيام الشهر
    const periodStart = new Date();
    periodStart.setDate(periodStart.getDate() - days);
    const [totalUsers, newUsersInPeriod] = await Promise.all([
        prisma_1.prisma.user.count(),
        prisma_1.prisma.user.count({
            where: { createdAt: { gte: periodStart } },
        }),
    ]);
    // ✅ حساب معدل النمو الفعلي: (الجديد / القديم) × 100
    const previousUsers = totalUsers - newUsersInPeriod;
    const growthRate = previousUsers > 0
        ? (newUsersInPeriod / previousUsers) * 100
        : newUsersInPeriod > 0
            ? 100 // نمو من الصفر
            : 0; // لا جديد ولا قديم
    return {
        totalUsers,
        newUsersLastMonth: newUsersInPeriod, // إبقاء الاسم للتوافقية
        periodDays: days, // ← جديد: ليعرف الفرونت طول الفترة
        growthRate: Number(growthRate.toFixed(1)),
    };
}
async function getOrdersByStatus() {
    const results = await prisma_1.prisma.order.groupBy({
        by: ["status"],
        _count: { status: true },
    });
    // تهيئة كل الحالات بـ 0
    const counts = {
        pending: 0,
        processing: 0,
        shipped: 0,
        delivered: 0,
        cancelled: 0,
    };
    // تعبئة الأرقام الحقيقية
    for (const result of results) {
        const key = result.status.toLowerCase();
        counts[key] = result._count.status;
    }
    return counts;
}
// export async function getOrdersByStatus() {
//   const statuses = Object.values(OrderStatus);
//   const counts = await Promise.all(
//     statuses.map((status) =>
//       prisma.order.count({
//         where: { status },
//       })
//     )
//   );
//   return statuses.reduce((acc, status, index) => {
//     acc[status.toLowerCase() as keyof typeof acc] = counts[index];
//     return acc;
//   }, {} as Record<string, number>);
// }
/**
 * أفضل الفئات مبيعاً (Top Categories) - اختياري
 */
async function getTopCategories(limit = 5) {
    // استعلام معقد لاستخراج الفئات الأكثر مبيعاً
    const result = await prisma_1.prisma.$queryRaw `
    SELECT 
      c.id, c.name, c.slug,
      SUM(oi.quantity) as totalSold
    FROM "categories" c
    JOIN "products" p ON p."categoryId" = c.id
    JOIN "product_variants" pv ON pv."productId" = p.id
    JOIN "order_items" oi ON oi."variantId" = pv.id
    JOIN "orders" o ON o.id = oi."orderId"
    WHERE o.status != 'CANCELLED'
    GROUP BY c.id, c.name, c.slug
    ORDER BY totalSold DESC
    LIMIT ${limit}
  `;
    return result;
}
async function getSalesAnalytics(days = 30) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    const orders = await prisma_1.prisma.order.findMany({
        where: {
            createdAt: { gte: startDate },
            status: { not: "CANCELLED" },
        },
        select: { totalAmount: true, createdAt: true },
    });
    // 1. تجميع حسب اليوم (Object → O(1) access)
    const salesByDay = {};
    for (const order of orders) {
        const date = order.createdAt.toISOString().split("T")[0];
        salesByDay[date] = (salesByDay[date] || 0) + Number(order.totalAmount);
    }
    // 2. بناء كل الأيام، والقيمة من Object أو 0
    const salesData = [];
    for (let i = days - 1; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const key = d.toISOString().split("T")[0];
        salesData.push({
            date: key,
            total: salesByDay[key] ?? 0, // ← السحر كله هنا
        });
    }
    return {
        totalOrders: orders.length,
        totalRevenue: orders.reduce((s, o) => s + Number(o.totalAmount), 0),
        salesData,
    };
}
/**
 * جلب المنتجات منخفضة المخزون
 * @param threshold - الحد الأدنى للمخزون (افتراضي: 5)
 */
async function getLowStockProducts(threshold = 5) {
    const variants = await prisma_1.prisma.productVariant.findMany({
        where: {
            stock: {
                lt: threshold, // أقل من الحد الأدنى
            },
        },
        select: {
            id: true,
            sku: true,
            stock: true,
            product: {
                select: {
                    id: true,
                    title: true,
                    slug: true,
                    images: {
                        where: { isPrimary: true },
                        take: 1,
                        select: { url: true },
                    },
                },
            },
        },
        orderBy: {
            stock: "asc", // الأقل مخزوناً أولاً
        },
    });
    return variants.map((v) => ({
        variantId: v.id,
        sku: v.sku,
        stock: v.stock,
        productId: v.product.id,
        productTitle: v.product.title,
        slug: v.product.slug,
        image: v.product.images[0]?.url || "",
    }));
}
/**
 * إعادة ملء المخزون (زيادة الكمية)
 * @param variantId - معرف المتغير
 * @param quantity - الكمية المضافة (افتراضي: 10)
 */
async function replenishStock(variantId, quantity = 10) {
    // التحقق من وجود المتغير
    const variant = await prisma_1.prisma.productVariant.findUnique({
        where: { id: variantId },
    });
    if (!variant) {
        throw (0, app_error_1.createError)("NOT_FOUND", "Variant not found");
    }
    // تحديث المخزون (زيادة)
    const updatedVariant = await prisma_1.prisma.productVariant.update({
        where: { id: variantId },
        data: {
            stock: {
                increment: quantity,
            },
        },
        include: {
            product: {
                select: {
                    id: true,
                    title: true,
                    slug: true,
                },
            },
        },
    });
    return {
        variantId: updatedVariant.id,
        newStock: updatedVariant.stock,
        productTitle: updatedVariant.product.title,
        productId: updatedVariant.product.id,
        message: `تم إضافة ${quantity} قطعة إلى المخزون`,
    };
}
