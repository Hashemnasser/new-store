"use strict";
// server/src/payments/webhook.controller.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleWebhook = void 0;
const asyncHandler_1 = require("../utils/asyncHandler");
const payment_service_1 = require("./payment.service");
// ============================================================
// 🪝 معالج Webhook موحد لكل البوابات
// ============================================================
exports.handleWebhook = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const gateway = req.params.gateway; // "stripe", "shamcash", ...
    const signature = req.headers["stripe-signature"];
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
        const result = await payment_service_1.paymentService.handleWebhook(gateway, req.body, signature);
        res.json(result);
    }
    catch (error) {
        console.error(`❌ Webhook error (${gateway}):`, error.message);
        res.status(400).json({ error: error.message });
    }
});
