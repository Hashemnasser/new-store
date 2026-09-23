// server/src/services/admin.service.ts

import { createError } from "@/errors/app-error";
import { OrderStatus } from "@/generated/prisma/enums";
import { prisma } from "../lib/prisma";

// ============================================================
// دالة جلب إحصائيات لوحة التحكم الرئيسية (مُحسّنة)
// ============================================================
export async function getDashboardStats() {
  const [
    totalUsers,
    totalProducts,
    totalOrders,
    totalRevenue,
    recentOrders,
    topProducts,
    categoryDistribution,
    userGrowth,
    ordersByStatus,
  ] = await Promise.all([
    // 1. عدد المستخدمين
    prisma.user.count(),

    // 2. عدد المنتجات
    prisma.product.count(),

    // 3. عدد الطلبات
    prisma.order.count(),

    // 4. إجمالي الإيرادات
    prisma.order.aggregate({
      _sum: { totalAmount: true },
      where: { status: { not: "CANCELLED" } },
    }),

    // 5. أحدث 5 طلبات
    prisma.order.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: {
        user: {
          select: { id: true, name: true, email: true },
        },
      },
    }),

    // 6. أفضل 5 منتجات مبيعاً
    prisma.orderItem
      .groupBy({
        by: ["variantId"],
        _sum: { quantity: true },
        orderBy: { _sum: { quantity: "desc" } },
        take: 5,
      })
      .then(async (items) => {
        const productIds = items.map((item) => item.variantId);
        const variants = await prisma.productVariant.findMany({
          where: { id: { in: productIds } },
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

        return items.map((item) => {
          const variant = variants.find((v) => v.id === item.variantId);
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
    prisma.product
      .groupBy({
        by: ["categoryId"],
        _count: { categoryId: true },
      })
      .then(async (items) => {
        const categoryIds = items.map((item) => item.categoryId);
        const categories = await prisma.category.findMany({
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
 */
export async function getUserGrowth() {
  const now = new Date();
  const lastMonth = new Date(now);
  lastMonth.setMonth(lastMonth.getMonth() - 1);

  const [totalUsers, newUsersLastMonth] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({
      where: { createdAt: { gte: lastMonth } },
    }),
  ]);

  const growthRate =
    totalUsers > 0 ? (newUsersLastMonth / totalUsers) * 100 : 0;

  return {
    totalUsers,
    newUsersLastMonth,
    growthRate: Number(growthRate.toFixed(1)),
  };
}

/**
 * توزيع الطلبات حسب الحالة
 */
export async function getOrdersByStatus() {
  const statuses = Object.values(OrderStatus);
  const counts = await Promise.all(
    statuses.map((status) =>
      prisma.order.count({
        where: { status },
      })
    )
  );

  return statuses.reduce((acc, status, index) => {
    acc[status.toLowerCase() as keyof typeof acc] = counts[index];
    return acc;
  }, {} as Record<string, number>);
}

/**
 * أفضل الفئات مبيعاً (Top Categories) - اختياري
 */
export async function getTopCategories(limit: number = 5) {
  // استعلام معقد لاستخراج الفئات الأكثر مبيعاً
  const result = await prisma.$queryRaw`
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

export async function getSalesAnalytics(days: number = 30) {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  const orders = await prisma.order.findMany({
    where: {
      createdAt: { gte: startDate },
      status: { not: "CANCELLED" },
    },
    select: {
      totalAmount: true,
      createdAt: true,
    },
    orderBy: {
      createdAt: "asc",
    },
  });
  console.log("order..........:::::", orders);
  // تجميع المبيعات حسب اليوم
  const salesByDay = orders.reduce((acc: Record<string, number>, order) => {
    const date = order.createdAt.toISOString().split("T")[0];
    acc[date] = (acc[date] || 0) + Number(order.totalAmount);
    return acc;
  }, {});

  // تحويل إلى مصفوفة
  const salesData = Object.entries(salesByDay).map(([date, total]) => ({
    date,
    total,
  }));

  return {
    totalOrders: orders.length,
    totalRevenue: orders.reduce(
      (sum, order) => sum + Number(order.totalAmount),
      0
    ),
    salesData,
  };
}

/**
 * جلب المنتجات منخفضة المخزون
 * @param threshold - الحد الأدنى للمخزون (افتراضي: 5)
 */
export async function getLowStockProducts(threshold: number = 5) {
  const variants = await prisma.productVariant.findMany({
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
export async function replenishStock(variantId: string, quantity: number = 10) {
  // التحقق من وجود المتغير
  const variant = await prisma.productVariant.findUnique({
    where: { id: variantId },
  });

  if (!variant) {
    throw createError("NOT_FOUND", "Variant not found");
  }

  // تحديث المخزون (زيادة)
  const updatedVariant = await prisma.productVariant.update({
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
