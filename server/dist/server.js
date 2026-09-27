"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/server.ts
const cors_1 = __importDefault(require("cors"));
require("./config/env"); // ✅ يجب أن يكون أول استيراد
// import dotenv from "dotenv";
const express_1 = __importDefault(require("express"));
const error_middleware_1 = require("./middleware/error.middleware");
const webhook_routes_1 = __importDefault(require("./payments/webhook.routes")); // ✅ مسار جديد
const routes_1 = __importDefault(require("./routes"));
// dotenv.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
app.use("/api/webhooks", webhook_routes_1.default);
// Middleware
app.use((0, cors_1.default)());
// ⚠️ يجب تركيب Webhook قبل express.json() للحصول على Raw Body
app.use(express_1.default.json());
// Routes
app.use("/api", routes_1.default);
// Health Check
app.get("/api/health", (_req, res) => {
    res.json({ success: true, message: "Server is running" });
});
// Error Handler (يجب أن يكون بعد جميع المسارات)
app.use(error_middleware_1.errorHandler);
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
