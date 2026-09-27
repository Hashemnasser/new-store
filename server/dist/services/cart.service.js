"use strict";
// src/services/cart.service.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCart = getCart;
exports.addToCart = addToCart;
exports.updateCartItem = updateCartItem;
exports.removeFromCart = removeFromCart;
exports.clearCart = clearCart;
const app_error_1 = require("../errors/app-error");
const prisma_1 = require("../lib/prisma");
async function getCart(userId) {
    const cart = await prisma_1.prisma.cart.findUnique({
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
async function addToCart(userId, data) {
    const { productId, variantId, quantity } = data;
    // ✅ التحقق من وجود المنتج
    const product = await prisma_1.prisma.product.findUnique({
        where: { id: productId },
        include: { variants: true },
    });
    if (!product) {
        throw (0, app_error_1.createError)("NOT_FOUND", "Product not found");
    }
    // ✅ التحقق من وجود المتغير (variant) - إلزامي في التصميم الجديد
    if (!variantId) {
        throw (0, app_error_1.createError)("BAD_REQUEST", "Variant ID is required");
    }
    const variant = product.variants.find((v) => v.id === variantId);
    if (!variant) {
        throw (0, app_error_1.createError)("NOT_FOUND", "Variant not found for this product");
    }
    if (variant.stock < quantity) {
        throw (0, app_error_1.createError)("BAD_REQUEST", "Insufficient stock for this variant");
    }
    // العثور على سلة المستخدم أو إنشاؤها
    let cart = await prisma_1.prisma.cart.findUnique({
        where: { userId },
    });
    if (!cart) {
        cart = await prisma_1.prisma.cart.create({
            data: { userId },
        });
    }
    // التحقق من وجود العنصر نفسه في السلة
    const existingItem = await prisma_1.prisma.cartItem.findFirst({
        where: {
            cartId: cart.id,
            productId,
            variantId,
        },
    });
    if (existingItem) {
        const newQuantity = existingItem.quantity + quantity;
        const updated = await prisma_1.prisma.cartItem.update({
            where: { id: existingItem.id },
            data: { quantity: newQuantity },
            include: {
                product: true,
                variant: true,
            },
        });
        return updated;
    }
    const newItem = await prisma_1.prisma.cartItem.create({
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
async function updateCartItem(userId, itemId, data) {
    const { quantity } = data;
    const cartItem = await prisma_1.prisma.cartItem.findFirst({
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
        throw (0, app_error_1.createError)("NOT_FOUND", "Cart item not found");
    }
    if (cartItem.variant && cartItem.variant.stock < quantity) {
        throw (0, app_error_1.createError)("BAD_REQUEST", "Insufficient stock");
    }
    const updated = await prisma_1.prisma.cartItem.update({
        where: { id: itemId },
        data: { quantity },
        include: {
            product: true,
            variant: true,
        },
    });
    return updated;
}
async function removeFromCart(userId, itemId) {
    const cartItem = await prisma_1.prisma.cartItem.findFirst({
        where: {
            id: itemId,
            cart: { userId },
        },
    });
    if (!cartItem) {
        throw (0, app_error_1.createError)("NOT_FOUND", "Cart item not found");
    }
    await prisma_1.prisma.cartItem.delete({
        where: { id: itemId },
    });
    return { message: "Item removed from cart" };
}
async function clearCart(userId) {
    const cart = await prisma_1.prisma.cart.findUnique({
        where: { userId },
    });
    if (!cart) {
        throw (0, app_error_1.createError)("NOT_FOUND", "Cart not found");
    }
    await prisma_1.prisma.cartItem.deleteMany({
        where: { cartId: cart.id },
    });
    return { message: "Cart cleared" };
}
