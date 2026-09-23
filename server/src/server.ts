// src/server.ts
import cors from "cors";
import "./config/env"; // ✅ يجب أن يكون أول استيراد
// import dotenv from "dotenv";
import express from "express";
import { errorHandler } from "./middleware/error.middleware";
import webhookRoutes from "./payments/webhook.routes"; // ✅ مسار جديد
import routes from "./routes";
// dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use("/api/webhooks", webhookRoutes);
// Middleware
app.use(cors());

// ⚠️ يجب تركيب Webhook قبل express.json() للحصول على Raw Body
app.use(express.json());

// Routes
app.use("/api", routes);

// Health Check
app.get("/api/health", (_req, res) => {
  res.json({ success: true, message: "Server is running" });
});

// Error Handler (يجب أن يكون بعد جميع المسارات)
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
