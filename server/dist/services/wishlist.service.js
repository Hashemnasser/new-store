"use strict";
// src/services/wishlist.service.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.getWishlist = getWishlist;
exports.addToWishlist = addToWishlist;
exports.removeFromWishlist = removeFromWishlist;
exports.clearWishlist = clearWishlist;
exports.isInWishlist = isInWishlist;
const app_error_1 = require("../errors/app-error");
const prisma_1 = require("../lib/prisma");
async function getWishlist(userId) {
    // البحث عن قائمة الرغبات مع العناصر
    let wishlist = await prisma_1.prisma.wishlist.findUnique({
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
        wishlist = await prisma_1.prisma.wishlist.create({
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
async function addToWishlist(userId, data) {
    const { productId } = data;
    // 1. التحقق من وجود المنتج
    const product = await prisma_1.prisma.product.findUnique({
        where: { id: productId },
    });
    if (!product) {
        throw (0, app_error_1.createError)("NOT_FOUND", "Product not found");
    }
    // 2. العثور على قائمة الرغبات أو إنشاؤها
    let wishlist = await prisma_1.prisma.wishlist.findUnique({
        where: { userId },
    });
    if (!wishlist) {
        wishlist = await prisma_1.prisma.wishlist.create({
            data: { userId },
        });
    }
    // 3. التحقق من أن المنتج ليس موجوداً بالفعل في القائمة
    const existingItem = await prisma_1.prisma.wishlistItem.findFirst({
        where: {
            wishlistId: wishlist.id,
            productId,
        },
    });
    if (existingItem) {
        throw (0, app_error_1.createError)("CONFLICT", "Product already in wishlist");
    }
    // 4. إضافة المنتج إلى القائمة
    const wishlistItem = await prisma_1.prisma.wishlistItem.create({
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
async function removeFromWishlist(userId, productId) {
    // 1. البحث عن قائمة الرغبات
    const wishlist = await prisma_1.prisma.wishlist.findUnique({
        where: { userId },
    });
    if (!wishlist) {
        throw (0, app_error_1.createError)("NOT_FOUND", "Wishlist not found");
    }
    // 2. البحث عن العنصر
    const wishlistItem = await prisma_1.prisma.wishlistItem.findFirst({
        where: {
            wishlistId: wishlist.id,
            productId,
        },
    });
    if (!wishlistItem) {
        throw (0, app_error_1.createError)("NOT_FOUND", "Item not found in wishlist");
    }
    // 3. حذف العنصر
    await prisma_1.prisma.wishlistItem.delete({
        where: { id: wishlistItem.id },
    });
    return { message: "Item removed from wishlist" };
}
async function clearWishlist(userId) {
    // 1. البحث عن قائمة الرغبات
    const wishlist = await prisma_1.prisma.wishlist.findUnique({
        where: { userId },
    });
    if (!wishlist) {
        throw (0, app_error_1.createError)("NOT_FOUND", "Wishlist not found");
    }
    // 2. حذف جميع العناصر
    await prisma_1.prisma.wishlistItem.deleteMany({
        where: { wishlistId: wishlist.id },
    });
    return { message: "Wishlist cleared" };
}
async function isInWishlist(userId, productId) {
    const wishlist = await prisma_1.prisma.wishlist.findUnique({
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
