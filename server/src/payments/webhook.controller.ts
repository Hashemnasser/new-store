// server/src/payments/webhook.controller.ts

import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { paymentService } from "./payment.service";

// ============================================================
// 🪝 معالج Webhook موحد لكل البوابات
// ============================================================

export const handleWebhook = asyncHandler(
  async (req: Request, res: Response) => {
    const gateway = req.params.gateway; // "stripe", "shamcash", ...
    const signature = req.headers["stripe-signature"] as string;

    // 🔍 تشخيص: اطبع معلومات الطلب
    console.log("🔍 Webhook received:");
    console.log("  Gateway:", gateway);
    console.log("  Signature:", signature?.slice(0, 50) + "...");
    console.log("  Body type:", typeof req.body);
    console.log("  Body is Buffer:", Buffer.isBuffer(req.body));
    console.log("  Body length:", req.body?.length);

    if (!signature) {
      return res.status(400).json({ error: "Missing signature" });
    }

    try {
      const result = await paymentService.handleWebhook(
        gateway as string,
        req.body,
        signature
      );
      res.json(result);
    } catch (error: any) {
      console.error(`❌ Webhook error (${gateway}):`, error.message);
      res.status(400).json({ error: error.message });
    }
  }
);
