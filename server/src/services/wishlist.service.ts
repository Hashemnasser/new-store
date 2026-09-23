// src/services/wishlist.service.ts

import { createError } from "../errors/app-error";
import { prisma } from "../lib/prisma";
import type { AddToWishlistInput } from "../validators/wishlist.validator";

export async function getWishlist(userId: string) {
  // البحث عن قائمة الرغبات مع العناصر
  let wishlist = await prisma.wishlist.findUnique({
    where: { userId },
    include: {
      items: {
        include: {
          product: {
            include: {
              images: {
                where: { isPrimary: true },
                take: 1,
                select: { url: true },
              },
              category: {
                select: {
                  id: true,
                  name: true,
                  slug: true,
                },
              },
              variants: {
                select: { price: true, id: true },
              },
            },
          },
        },
      },
    },
  });

  // إذا لم تكن هناك قائمة، ننشئ واحدة فارغة
  if (!wishlist) {
    wishlist = await prisma.wishlist.create({
      data: { userId },
      include: {
        items: {
          include: {
            product: {
              include: {
                images: {
                  where: { isPrimary: true },
                  take: 1,
                  select: { url: true },
                },
                category: {
                  select: {
                    id: true,
                    name: true,
                    slug: true,
                  },
                },
              },
            },
          },
        },
      },
    });
  }

  return wishlist;
}

export async function addToWishlist(userId: string, data: AddToWishlistInput) {
  const { productId } = data;

  // 1. التحقق من وجود المنتج
  const product = await prisma.product.findUnique({
    where: { id: productId },
  });

  if (!product) {
    throw createError("NOT_FOUND", "Product not found");
  }

  // 2. العثور على قائمة الرغبات أو إنشاؤها
  let wishlist = await prisma.wishlist.findUnique({
    where: { userId },
  });

  if (!wishlist) {
    wishlist = await prisma.wishlist.create({
      data: { userId },
    });
  }

  // 3. التحقق من أن المنتج ليس موجوداً بالفعل في القائمة
  const existingItem = await prisma.wishlistItem.findFirst({
    where: {
      wishlistId: wishlist.id,
      productId,
    },
  });

  if (existingItem) {
    throw createError("CONFLICT", "Product already in wishlist");
  }

  // 4. إضافة المنتج إلى القائمة
  const wishlistItem = await prisma.wishlistItem.create({
    data: {
      wishlistId: wishlist.id,
      productId,
      userId, // ✅ للتتبع المباشر
    },
    include: {
      product: {
        include: {
          images: {
            where: { isPrimary: true },
            take: 1,
            select: { url: true },
          },
          category: {
            select: {
              id: true,
              name: true,
              slug: true,
            },
          },
        },
      },
    },
  });

  return wishlistItem;
}

export async function removeFromWishlist(userId: string, productId: string) {
  // 1. البحث عن قائمة الرغبات
  const wishlist = await prisma.wishlist.findUnique({
    where: { userId },
  });

  if (!wishlist) {
    throw createError("NOT_FOUND", "Wishlist not found");
  }

  // 2. البحث عن العنصر
  const wishlistItem = await prisma.wishlistItem.findFirst({
    where: {
      wishlistId: wishlist.id,
      productId,
    },
  });

  if (!wishlistItem) {
    throw createError("NOT_FOUND", "Item not found in wishlist");
  }

  // 3. حذف العنصر
  await prisma.wishlistItem.delete({
    where: { id: wishlistItem.id },
  });

  return { message: "Item removed from wishlist" };
}

export async function clearWishlist(userId: string) {
  // 1. البحث عن قائمة الرغبات
  const wishlist = await prisma.wishlist.findUnique({
    where: { userId },
  });

  if (!wishlist) {
    throw createError("NOT_FOUND", "Wishlist not found");
  }

  // 2. حذف جميع العناصر
  await prisma.wishlistItem.deleteMany({
    where: { wishlistId: wishlist.id },
  });

  return { message: "Wishlist cleared" };
}

export async function isInWishlist(
  userId: string,
  productId: string
): Promise<boolean> {
  const wishlist = await prisma.wishlist.findUnique({
    where: { userId },
    include: {
      items: {
        where: { productId },
        take: 1,
      },
    },
  });

  if (!wishlist) {
    return false;
  }

  return wishlist.items.length > 0;
}
