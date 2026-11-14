"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.replenishStockSchema = void 0;
const zod_1 = __importDefault(require("zod"));
exports.replenishStockSchema = zod_1.default.object({
    quantity: zod_1.default.number().int().positive().default(10),
});
