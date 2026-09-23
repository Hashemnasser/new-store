// src/services/review.service.ts

import { Prisma } from "@/generated/prisma/client";
import { createError } from "../errors/app-error";
import { prisma } from "../lib/prisma";
import type {
  CreateReviewInput,
  UpdateReviewInput,
} from "../validators/review.validator";

export async function getProductReviews(productId: string) {
  const reviews = await prisma.review.findMany({
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

export async function getUserReviews(userId: string) {
  const reviews = await prisma.review.findMany({
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

export async function getReviewById(reviewId: string, userId?: string) {
  const review = await prisma.review.findFirst({
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
    throw createError("NOT_FOUND", "Review not found");
  }

  return review;
}

async function updateProductRating(productId: string) {
  // حساب متوسط التقييمات وعددها
  const result = await prisma.review.aggregate({
    where: { productId },
    _avg: { rating: true },
    _count: { rating: true },
  });

  const averageRating = result._avg.rating ?? 0;
  const reviewsCount = result._count.rating ?? 0;

  await prisma.product.update({
    where: { id: productId },
    data: {
      averageRating,
      reviewsCount,
    },
  });
}

export async function createReview(userId: string, data: CreateReviewInput) {
  const { productId, rating, comment } = data;

  // 1. التحقق من وجود المنتج
  const product = await prisma.product.findUnique({
    where: { id: productId },
  });

  if (!product) {
    throw createError("NOT_FOUND", "Product not found");
  }

  // 2. التحقق من أن المستخدم لم يقيّم هذا المنتج من قبل
  try {
    const review = await prisma.review.create({
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
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      throw createError("CONFLICT", "You have already reviewed this product");
    }
    throw error;
  }
}

export async function updateReview(
  userId: string,
  reviewId: string,
  data: UpdateReviewInput
) {
  // 1. التحقق من وجود التقييم وأنه يتبع المستخدم
  const existingReview = await prisma.review.findFirst({
    where: {
      id: reviewId,
      userId,
    },
  });

  if (!existingReview) {
    throw createError(
      "NOT_FOUND",
      "Review not found or you don't have permission"
    );
  }

  // 2. تحديث التقييم
  const updatedReview = await prisma.review.update({
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

export async function deleteReview(userId: string, reviewId: string) {
  // 1. التحقق من وجود التقييم وأنه يتبع المستخدم
  const existingReview = await prisma.review.findFirst({
    where: {
      id: reviewId,
      userId,
    },
  });

  if (!existingReview) {
    throw createError(
      "NOT_FOUND",
      "Review not found or you don't have permission"
    );
  }

  // 2. حذف التقييم
  await prisma.review.delete({
    where: { id: reviewId },
  });

  // 3. تحديث متوسط التقييمات للمنتج
  await updateProductRating(existingReview.productId);

  return { message: "Review deleted successfully" };
}

// ============================================================
// 🔐 دوال المدير (Admin)
// ============================================================

export async function getAllReviews() {
  const reviews = await prisma.review.findMany({
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

export async function deleteReviewAsAdmin(reviewId: string) {
  const existingReview = await prisma.review.findUnique({
    where: { id: reviewId },
  });

  if (!existingReview) {
    throw createError("NOT_FOUND", "Review not found");
  }

  await prisma.review.delete({
    where: { id: reviewId },
  });

  await updateProductRating(existingReview.productId);

  return { message: "Review deleted successfully" };
}
