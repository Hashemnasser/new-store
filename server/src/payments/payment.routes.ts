// server/src/payments/payment.routes.ts
import { Router } from "express";
import { prisma } from "../lib/prisma";
import { authMiddleware } from "../middleware/auth.middleware"; // عدّل
import { paymentService } from "./payment.service";

const router = Router();

router.post("/create-intent", authMiddleware, async (req, res, next) => {
  try {
    const { orderId } = req.body;
    const userId = req.user!.id;
    // جلب الطلب والتأكد من أنه pending وخاص بالمستخدم
    const order = await prisma.order.findFirst({
      where: { id: orderId, userId, status: "PENDING" },
    });

    if (!order) {
      return res.status(404).json({ error: "Order not found or already paid" });
    }

    const { clientSecret, paymentId } =
      await paymentService.createPaymentIntent({
        amount: order.totalAmount.toNumber(),
        currency: "usd", // عدّل حسب عملتك
        orderId: order.id,
        userId,
      });

    // احفظ paymentIntentId للرجوع إليه
    await prisma.order.update({
      where: { id: order.id },
      data: { stripePaymentIntentId: paymentId },
    });

    res.json({ clientSecret, paymentId });
  } catch (error) {
    next(error);
  }
});

export default router;
