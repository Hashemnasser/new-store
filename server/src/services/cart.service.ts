// src/services/cart.service.ts

import { createError } from "../errors/app-error";
import { prisma } from "../lib/prisma";
import type {
  AddToCartInput,
  UpdateCartItemInput,
} from "../validators/cart.validator";

export async function getCart(userId: string) {
  const cart = await prisma.cart.findUnique({
    where: { userId },
    include: {
      items: {
        include: {
          product: {
            select: {
              id: true,
              title: true,
              slug: true,
              images: true,
            },
          },
          variant: {
            select: {
              id: true,
              size: true,
              color: true,
              price: true,
              stock: true,
              sku: true,
            },
          },
        },
      },
    },
  });
  if (!cart) {
    return {
      id: "",
      userId,
      items: [],
      total: 0,
      itemCount: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }

  // حساب الإجمالي: يعتمد كلياً على الـ variant (السعر موجود فقط في variant)
  const total = cart.items.reduce((sum, item) => {
    // ✅ السعر من الـ variant فقط (لأنه لا يوجد price في product)
    const price = item.variant?.price ? Number(item.variant.price) : 0;
    return sum + price * item.quantity;
  }, 0);

  return {
    ...cart,
    total,
    itemCount: cart.items.length,
  };
}

export async function addToCart(userId: string, data: AddToCartInput) {
  const { productId, variantId, quantity } = data;

  // ✅ التحقق من وجود المنتج
  const product = await prisma.product.findUnique({
    where: { id: productId },
    include: { variants: true },
  });

  if (!product) {
    throw createError("NOT_FOUND", "Product not found");
  }

  // ✅ التحقق من وجود المتغير (variant) - إلزامي في التصميم الجديد
  if (!variantId) {
    throw createError("BAD_REQUEST", "Variant ID is required");
  }

  const variant = product.variants.find((v) => v.id === variantId);
  if (!variant) {
    throw createError("NOT_FOUND", "Variant not found for this product");
  }

  if (variant.stock < quantity) {
    throw createError("BAD_REQUEST", "Insufficient stock for this variant");
  }

  // العثور على سلة المستخدم أو إنشاؤها
  let cart = await prisma.cart.findUnique({
    where: { userId },
  });

  if (!cart) {
    cart = await prisma.cart.create({
      data: { userId },
    });
  }

  // التحقق من وجود العنصر نفسه في السلة
  const existingItem = await prisma.cartItem.findFirst({
    where: {
      cartId: cart.id,
      productId,
      variantId,
    },
  });

  if (existingItem) {
    const newQuantity = existingItem.quantity + quantity;
    const updated = await prisma.cartItem.update({
      where: { id: existingItem.id },
      data: { quantity: newQuantity },
      include: {
        product: true,
        variant: true,
      },
    });
    return updated;
  }

  const newItem = await prisma.cartItem.create({
    data: {
      cartId: cart.id,
      productId,
      variantId,
      quantity,
    },
    include: {
      product: true,
      variant: true,
    },
  });
  console.log("new Item..$$$$::", newItem);
  return newItem;
}

export async function updateCartItem(
  userId: string,
  itemId: string,
  data: UpdateCartItemInput
) {
  const { quantity } = data;

  const cartItem = await prisma.cartItem.findFirst({
    where: {
      id: itemId,
      cart: { userId },
    },
    include: {
      variant: true,
      product: true,
    },
  });

  if (!cartItem) {
    throw createError("NOT_FOUND", "Cart item not found");
  }

  if (cartItem.variant && cartItem.variant.stock < quantity) {
    throw createError("BAD_REQUEST", "Insufficient stock");
  }

  const updated = await prisma.cartItem.update({
    where: { id: itemId },
    data: { quantity },
    include: {
      product: true,
      variant: true,
    },
  });

  return updated;
}

export async function removeFromCart(userId: string, itemId: string) {
  const cartItem = await prisma.cartItem.findFirst({
    where: {
      id: itemId,
      cart: { userId },
    },
  });

  if (!cartItem) {
    throw createError("NOT_FOUND", "Cart item not found");
  }

  await prisma.cartItem.delete({
    where: { id: itemId },
  });

  return { message: "Item removed from cart" };
}

export async function clearCart(userId: string) {
  const cart = await prisma.cart.findUnique({
    where: { userId },
  });

  if (!cart) {
    throw createError("NOT_FOUND", "Cart not found");
  }

  await prisma.cartItem.deleteMany({
    where: { cartId: cart.id },
  });

  return { message: "Cart cleared" };
}
