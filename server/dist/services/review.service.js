"use strict";
// src/services/review.service.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProductReviews = getProductReviews;
exports.getUserReviews = getUserReviews;
exports.getReviewById = getReviewById;
exports.createReview = createReview;
exports.updateReview = updateReview;
exports.deleteReview = deleteReview;
exports.getAllReviews = getAllReviews;
exports.deleteReviewAsAdmin = deleteReviewAsAdmin;
const client_1 = require("../generated/prisma/client.js");
const app_error_1 = require("../errors/app-error");
const prisma_1 = require("../lib/prisma");
async function getProductReviews(productId) {
    const reviews = await prisma_1.prisma.review.findMany({
        where: { productId },
        include: {
            user: {
                select: {
                    id: true,
                    name: true,
                    image: true,
                },
            },
        },
        orderBy: {
            createdAt: "desc",
        },
    });
    return reviews;
}
async function getUserReviews(userId) {
    const reviews = await prisma_1.prisma.review.findMany({
        where: { userId },
        include: {
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
            createdAt: "desc",
        },
    });
    return reviews;
}
async function getReviewById(reviewId, userId) {
    const review = await prisma_1.prisma.review.findFirst({
        where: {
            id: reviewId,
            ...(userId && { userId }), // إذا مررنا userId، نتحقق من الملكية
        },
        include: {
            user: {
                select: {
                    id: true,
                    name: true,
                    image: true,
                },
            },
            product: {
                select: {
                    id: true,
                    title: true,
                    slug: true,
                },
            },
        },
    });
    if (!review) {
        throw (0, app_error_1.createError)("NOT_FOUND", "Review not found");
    }
    return review;
}
async function updateProductRating(productId) {
    // حساب متوسط التقييمات وعددها
    const result = await prisma_1.prisma.review.aggregate({
        where: { productId },
        _avg: { rating: true },
        _count: { rating: true },
    });
    const averageRating = result._avg.rating ?? 0;
    const reviewsCount = result._count.rating ?? 0;
    await prisma_1.prisma.product.update({
        where: { id: productId },
        data: {
            averageRating,
            reviewsCount,
        },
    });
}
async function createReview(userId, data) {
    const { productId, rating, comment } = data;
    // 1. التحقق من وجود المنتج
    const product = await prisma_1.prisma.product.findUnique({
        where: { id: productId },
    });
    if (!product) {
        throw (0, app_error_1.createError)("NOT_FOUND", "Product not found");
    }
    // 2. التحقق من أن المستخدم لم يقيّم هذا المنتج من قبل
    try {
        const review = await prisma_1.prisma.review.create({
            data: {
                userId,
                productId,
                rating,
                comment,
            },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        image: true,
                    },
                },
            },
        });
        // 3. تحديث متوسط التقييمات للمنتج
        await updateProductRating(productId);
        return review;
    }
    catch (error) {
        if (error instanceof client_1.Prisma.PrismaClientKnownRequestError &&
            error.code === "P2002") {
            throw (0, app_error_1.createError)("CONFLICT", "You have already reviewed this product");
        }
        throw error;
    }
}
async function updateReview(userId, reviewId, data) {
    // 1. التحقق من وجود التقييم وأنه يتبع المستخدم
    const existingReview = await prisma_1.prisma.review.findFirst({
        where: {
            id: reviewId,
            userId,
        },
    });
    if (!existingReview) {
        throw (0, app_error_1.createError)("NOT_FOUND", "Review not found or you don't have permission");
    }
    // 2. تحديث التقييم
    const updatedReview = await prisma_1.prisma.review.update({
        where: { id: reviewId },
        data: {
            ...(data.rating !== undefined && { rating: data.rating }),
            ...(data.comment !== undefined && { comment: data.comment }),
        },
        include: {
            user: {
                select: {
                    id: true,
                    name: true,
                    image: true,
                },
            },
        },
    });
    // 3. تحديث متوسط التقييمات للمنتج
    await updateProductRating(existingReview.productId);
    return updatedReview;
}
async function deleteReview(userId, reviewId) {
    // 1. التحقق من وجود التقييم وأنه يتبع المستخدم
    const existingReview = await prisma_1.prisma.review.findFirst({
        where: {
            id: reviewId,
            userId,
        },
    });
    if (!existingReview) {
        throw (0, app_error_1.createError)("NOT_FOUND", "Review not found or you don't have permission");
    }
    // 2. حذف التقييم
    await prisma_1.prisma.review.delete({
        where: { id: reviewId },
    });
    // 3. تحديث متوسط التقييمات للمنتج
    await updateProductRating(existingReview.productId);
    return { message: "Review deleted successfully" };
}
// ============================================================
// 🔐 دوال المدير (Admin)
// ============================================================
async function getAllReviews() {
    const reviews = await prisma_1.prisma.review.findMany({
        include: {
            user: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                },
            },
            product: {
                select: {
                    id: true,
                    title: true,
                    slug: true,
                },
            },
        },
        orderBy: {
            createdAt: "desc",
        },
    });
    return reviews;
}
async function deleteReviewAsAdmin(reviewId) {
    const existingReview = await prisma_1.prisma.review.findUnique({
        where: { id: reviewId },
    });
    if (!existingReview) {
        throw (0, app_error_1.createError)("NOT_FOUND", "Review not found");
    }
    await prisma_1.prisma.review.delete({
        where: { id: reviewId },
    });
    await updateProductRating(existingReview.productId);
    return { message: "Review deleted successfully" };
}
