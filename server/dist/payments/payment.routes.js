"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// server/src/payments/payment.routes.ts
const express_1 = require("express");
const prisma_1 = require("../lib/prisma");
const auth_middleware_1 = require("../middleware/auth.middleware"); // عدّل
const payment_service_1 = require("./payment.service");
const router = (0, express_1.Router)();
router.post("/create-intent", auth_middleware_1.authMiddleware, async (req, res, next) => {
    try {
        const { orderId } = req.body;
        const userId = req.user.id;
        // جلب الطلب والتأكد من أنه pending وخاص بالمستخدم
        const order = await prisma_1.prisma.order.findFirst({
            where: { id: orderId, userId, status: "PENDING" },
        });
        if (!order) {
            return res.status(404).json({ error: "Order not found or already paid" });
        }
        const { clientSecret, paymentId } = await payment_service_1.paymentService.createPaymentIntent({
            amount: order.totalAmount.toNumber(),
            currency: "usd", // عدّل حسب عملتك
            orderId: order.id,
            userId,
        });
        // احفظ paymentIntentId للرجوع إليه
        await prisma_1.prisma.order.update({
            where: { id: order.id },
            data: { stripePaymentIntentId: paymentId },
        });
        res.json({ clientSecret, paymentId });
    }
    catch (error) {
        next(error);
    }
});
exports.default = router;
