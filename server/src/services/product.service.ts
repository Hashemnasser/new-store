// src/services/product.service.ts

import { createError } from "@/errors/app-error";
import { Prisma } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import { generateSlug } from "@/utils/slug";

import type {
  CreateProductInput,
  UpdateProductInput,
} from "@/validators/product.validator";

// export async function getProducts() {
//   return prisma.product.findMany({
//     include: {
//       category: true,
//       images: true,
//       variants: true,
//     },
//     orderBy: {
//       createdAt: "desc",
//     },
//   });
// }

// src/services/product.service.ts

interface GetProductsParams {
  search?: string;
  category?: string;
  sort?: string;
  page?: number;
  limit?: number;
  isOnSale?: boolean; // ✅ فلتر جديد
  includeOutOfStock?: boolean; // ✅ جديد
}

export const getProducts = async (params: GetProductsParams) => {
  const {
    search,
    category,
    sort,
    page = 1,
    limit = 12,
    isOnSale,
    includeOutOfStock = false,
  } = params;

  const where: Prisma.ProductWhereInput = {};

  if (includeOutOfStock) {
    // ✅ استبعاد المنتجات التي ليس لها أي متغير بمخزون > 0
    where.variants = {
      some: {
        stock: { gt: 0 },
      },
    };
  }

  if (search) {
    where.OR = [
      { title: { contains: search, mode: "insensitive" } },
      { description: { contains: search, mode: "insensitive" } },
    ];
  }
  if (category) {
    where.categoryId = category;
  }
  // ✅ فلتر المنتجات المخفضة
  if (isOnSale) {
    where.discountPercent = { gt: 0 };
  }
  let orderBy: Prisma.ProductOrderByWithRelationInput = { createdAt: "desc" };
  switch (sort) {
    case "price-asc":
      orderBy = { basePrice: "asc" };
      break;
    case "price-desc":
      orderBy = { basePrice: "desc" };
      break;
    case "title-asc":
      orderBy = { title: "asc" };
      break;
    case "title-desc":
      orderBy = { title: "desc" };
      break;
    default:
      orderBy = { createdAt: "desc" };
  }

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      orderBy,
      skip: (page - 1) * limit,
      take: limit,
      include: {
        category: { select: { id: true, name: true } },
        images: { where: { isPrimary: true }, take: 1, select: { url: true } },
        variants: {
          select: {
            id: true,
            price: true,
            stock: true,
            color: true,
            size: true,
          },
        },
      },
    }),
    prisma.product.count({ where }),
  ]);

  // ✅ حساب السعر الأصلي والمخفض لكل منتج
  const productsWithPrices = products.map((product) => {
    // 1. السعر الأصلي: نأخذ basePrice إن وجد، وإلا أول متغير
    const originalPrice = product.basePrice
      ? Number(product.basePrice)
      : product.variants.length > 0
      ? Number(product.variants[0].price)
      : 0;

    // 2. نسبة التخفيض
    const discountPercent = product.discountPercent
      ? Number(product.discountPercent)
      : 0;

    // 3. السعر المخفض
    const discountedPrice =
      discountPercent > 0
        ? originalPrice * (1 - discountPercent / 100)
        : originalPrice;

    // 4. إرجاع المنتج مع الحقول المحسوبة
    return {
      ...product,
      originalPrice,
      discountedPrice: Number(discountedPrice.toFixed(2)),
      discountPercent,
    };
  });

  return {
    products: productsWithPrices,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
};
export async function getProductBySlug(slug: string) {
  const product = await prisma.product.findUnique({
    where: {
      slug,
      // variants: { some: { stock: { gt: 0 } } },
    },
    include: {
      category: true,
      images: true,
      variants: true,
      reviews: {
        include: { user: { select: { id: true, name: true, image: true } } },
      },
    },
  });
  if (!product) throw createError("NOT_FOUND", "Product not found");

  const originalPrice = product.basePrice
    ? Number(product.basePrice)
    : product.variants.length > 0
    ? Number(product.variants[0].price)
    : 0;
  const discountPercent = product.discountPercent
    ? Number(product.discountPercent)
    : 0;
  const discountedPrice =
    discountPercent > 0
      ? originalPrice * (1 - discountPercent / 100)
      : originalPrice;

  return {
    ...product,
    originalPrice,
    discountedPrice: Number(discountedPrice.toFixed(2)),
    discountPercent,
  };
}
export async function createProduct(data: CreateProductInput) {
  const category = await prisma.category.findUnique({
    where: {
      id: data.categoryId,
    },
  });

  if (!category) {
    throw createError("NOT_FOUND", "Category not found");
  }
  const slug = generateSlug(data.title);
  const product = await prisma.product.create({
    data: {
      title: data.title,

      description: data.description,

      slug,

      categoryId: data.categoryId,

      images: {
        create: data.images,
      },

      variants: {
        create: data.variants,
      },
    },

    include: {
      category: true,
      images: true,
      variants: true,
    },
  });
  return product;
}

// export async function updateProduct(id: string, data: UpdateProductInput) {
//   return prisma.$transaction(async (tx) => {
//     // 1. التحقق من وجود المنتج
//     const product = await tx.product.findUnique({
//       where: {
//         id,
//       },
//     });

//     if (!product) {
//       throw createError("NOT_FOUND", "Product not found");
//     }

//     // 2. التحقق من وجود التصنيف عند تغييره
//     if (data.categoryId) {
//       const category = await tx.category.findUnique({
//         where: {
//           id: data.categoryId,
//         },
//       });

//       if (!category) {
//         throw createError("NOT_FOUND", "Category not found");
//       }
//     }

//     // 3. تجهيز بيانات التحديث
//     const {
//       images,
//       variants,
//       deletedImageIds,
//       deletedVariantIds,
//       ...productData
//     } = data;

//     const updateData: any = {
//       ...productData,
//     };

//     // إذا تم تغيير العنوان، نقوم بتوليد slug جديد
//     if (data.title) {
//       updateData.slug = generateSlug(data.title);
//     }

//     // 4. تحديث المنتج
//     const updatedProduct = await tx.product.update({
//       where: {
//         id,
//       },
//       data: updateData,
//       include: {
//         category: true,
//         images: true,
//         variants: true,
//       },
//     });

//     return updatedProduct;
//   });
// }
// export async function deleteProduct(id: string) {
//   const product = await prisma.product.findUnique({
//     where: {
//       id,
//     },
//   });

//   if (!product) {
//     throw createError("NOT_FOUND", "Product not found");
//   }

//   await prisma.product.delete({
//     where: {
//       id,
//     },
//   });
// }

// // ✅ تحديث بواسطة slug
// export async function updateProduct(slug: string, data: UpdateProductInput) {
//   return prisma.$transaction(async (tx) => {
//     // 1. التحقق من وجود المنتج بواسطة slug
//     const product = await tx.product.findUnique({
//       where: { slug },
//     });

//     if (!product) {
//       throw createError("NOT_FOUND", "Product not found");
//     }

//     // 2. التحقق من وجود التصنيف عند تغييره
//     if (data.categoryId) {
//       const category = await tx.category.findUnique({
//         where: { id: data.categoryId },
//       });

//       if (!category) {
//         throw createError("NOT_FOUND", "Category not found");
//       }
//     }

//     // 3. تجهيز بيانات التحديث
//     const {
//       images,
//       variants,
//       deletedImageIds,
//       deletedVariantIds,
//       ...productData
//     } = data;

//     const updateData: any = {
//       ...productData,
//     };

//     // إذا تم تغيير العنوان، نقوم بتوليد slug جديد
//     if (data.title) {
//       updateData.slug = generateSlug(data.title);
//     }

//     // 4. تحديث المنتج
//     const updatedProduct = await tx.product.update({
//       where: { id: product.id }, // نستخدم id الداخلي للتحديث
//       data: updateData,
//       include: {
//         category: true,
//         images: true,
//         variants: true,
//       },
//     });

//     return updatedProduct;
//   });
// }

// src/services/product.service.ts

// src/services/product.service.ts

export async function updateProduct(slug: string, data: UpdateProductInput) {
  return prisma.$transaction(async (tx) => {
    // 1. جلب المنتج مع المتغيرات الحالية
    const product = await tx.product.findUnique({
      where: { slug },
      include: {
        variants: true,
      },
    });

    if (!product) {
      throw createError("NOT_FOUND", "Product not found");
    }

    // 2. التحقق من وجود التصنيف عند تغييره
    if (data.categoryId) {
      const category = await tx.category.findUnique({
        where: { id: data.categoryId },
      });

      if (!category) {
        throw createError("NOT_FOUND", "Category not found");
      }
    }

    // 3. فصل الحقول الأساسية عن العلاقات
    const {
      images,
      variants,
      deletedImageIds,
      deletedVariantIds,
      ...scalarData
    } = data;

    // 4. تجهيز بيانات التحديث الأساسية
    const updateData: Prisma.ProductUpdateInput = {
      ...scalarData,
    };

    // 5. توليد slug جديد إذا تغير العنوان
    if (data.title) {
      updateData.slug = generateSlug(data.title);
    }

    // 6. تحديث الحقول الأساسية للمنتج (بدون علاقات)
    await tx.product.update({
      where: { id: product.id },
      data: updateData,
    });

    // 7. مزامنة الصور (حذف الكل + إعادة الإنشاء)
    if (images !== undefined) {
      await tx.productImage.deleteMany({
        where: { productId: product.id },
      });

      if (images.length > 0) {
        await tx.productImage.createMany({
          data: images.map((img, index) => ({
            productId: product.id,
            url: img.url,
            alt: img.alt ?? null,
            order: img.order ?? index,
            isPrimary: img.isPrimary ?? false,
          })),
        });
      }
    }

    // 8. مزامنة المتغيرات
    if (variants !== undefined) {
      // 8.1 التحقق من عدم وجود SKU مكرر داخل القائمة المرسلة نفسها
      const skus = variants.map((v) => v.sku);
      const uniqueSkus = new Set(skus);
      if (uniqueSkus.size !== skus.length) {
        throw createError(
          "BAD_REQUEST",
          "يوجد تكرار في رموز SKU داخل النموذج المرسل"
        );
      }

      // 8.2 التحقق من عدم وجود SKU مستخدم في منتج آخر
      // (نستثني المتغيرات التي تنتمي لهذا المنتج)
      const currentVariantIds = product.variants.map((v) => v.id);
      const conflictingVariants = await tx.productVariant.findMany({
        where: {
          sku: { in: skus },
          id: { notIn: currentVariantIds },
        },
        select: { sku: true, productId: true },
      });

      if (conflictingVariants.length > 0) {
        const conflictSkus = conflictingVariants.map((v) => v.sku).join(", ");
        throw createError(
          "CONFLICT",
          `الرموز التالية مستخدمة في منتجات أخرى: ${conflictSkus}`
        );
      }

      // 8.3 حذف المتغيرات التي لم تعد موجودة في القائمة الجديدة
      const newSkus = variants.map((v) => v.sku);
      const variantsToDelete = product.variants.filter(
        (oldVariant) => !newSkus.includes(oldVariant.sku)
      );

      for (const variantToDelete of variantsToDelete) {
        // التحقق من عدم وجود طلبات مرتبطة
        const orderItemsCount = await tx.orderItem.count({
          where: { variantId: variantToDelete.id },
        });

        if (orderItemsCount > 0) {
          throw createError(
            "BAD_REQUEST",
            `لا يمكن حذف المتغير "${variantToDelete.sku}" لوجود طلبات مرتبطة به`
          );
        }

        // حذف من السلة أولاً
        await tx.cartItem.deleteMany({
          where: { variantId: variantToDelete.id },
        });

        // حذف المتغير
        await tx.productVariant.delete({
          where: { id: variantToDelete.id },
        });
      }

      // 8.4 معالجة كل متغير (تحديث أو إنشاء)
      for (const variant of variants) {
        const existingVariant = product.variants.find(
          (oldVariant) => oldVariant.sku === variant.sku
        );

        if (existingVariant) {
          // تحديث المتغير الموجود (SKU لا يتغير)
          await tx.productVariant.update({
            where: { id: existingVariant.id },
            data: {
              price: variant.price,
              stock: variant.stock,
              color: variant.color ?? null,
              size: variant.size ?? null,
            },
          });
        } else {
          // إنشاء متغير جديد (SKU جديد)
          await tx.productVariant.create({
            data: {
              productId: product.id,
              sku: variant.sku,
              price: variant.price,
              stock: variant.stock,
              color: variant.color ?? null,
              size: variant.size ?? null,
            },
          });
        }
      }
    }

    // 9. جلب المنتج المحدث مع العلاقات
    const finalProduct = await tx.product.findUnique({
      where: { id: product.id },
      include: {
        category: true,
        images: true,
        variants: true,
      },
    });

    if (!finalProduct) {
      throw createError(
        "INTERNAL_SERVER_ERROR",
        "Failed to fetch updated product"
      );
    }

    return finalProduct;
  });
}
// ✅ حذف بواسطة id
export async function deleteProduct(id: string) {
  const product = await prisma.product.findUnique({
    where: { id },
  });

  if (!product) {
    throw createError("NOT_FOUND", "Product not found");
  }

  await prisma.product.delete({
    where: { id: product.id },
  });
  return { message: "Product deleted successfully" };
}

/**
 * جلب المنتجات المميزة (Featured Products)
 */
export const getFeaturedProducts = async (limit: number = 8) => {
  return prisma.product.findMany({
    where: { featured: true, isPublished: true },
    include: {
      images: {
        where: { isPrimary: true },
        take: 1,
        select: { url: true },
      },
      variants: {
        select: { price: true, id: true },
      },
      category: {
        select: { id: true, name: true },
      },
    },
    take: limit,
    orderBy: { createdAt: "desc" },
  });
};

/**
 * جلب المنتجات الأكثر مبيعاً (Top Selling Products)
 */
export const getTopSellingProducts = async (limit: number = 8) => {
  // 1. جلب الـ variantId الأكثر مبيعاً من orderItems
  const topVariants = await prisma.orderItem.groupBy({
    by: ["variantId"],
    _sum: { quantity: true },
    orderBy: { _sum: { quantity: "desc" } },
    take: limit,
  });

  const variantIds = topVariants.map((item) => item.variantId);

  if (variantIds.length === 0) {
    return [];
  }

  // 2. جلب تفاصيل المنتجات لهذه الـ variants
  const products = await prisma.product.findMany({
    where: {
      variants: { some: { id: { in: variantIds } } },
      isPublished: true,
    },
    include: {
      images: {
        where: { isPrimary: true },
        take: 1,
        select: { url: true },
      },
      variants: {
        select: { price: true, id: true },
      },
      category: {
        select: { id: true, name: true },
      },
    },
  });

  // 3. ترتيب المنتجات حسب عدد المبيعات (نفس ترتيب topVariants)
  const sortedProducts = variantIds
    .map((variantId) => {
      const product = products.find((p) =>
        p.variants.some((v) => v.id === variantId)
      );
      return product;
    })
    .filter(Boolean);

  return sortedProducts;
};
