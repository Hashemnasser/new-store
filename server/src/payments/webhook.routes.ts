// server/src/payments/webhook.routes.ts

import express, { Router } from "express";
import { handleWebhook } from "./webhook.controller";

const router = Router();

// ✅ Raw body للتحقق من التوقيع
router.post(
  "/:gateway",
  express.raw({ type: "application/json" }),
  handleWebhook
);

export default router;
