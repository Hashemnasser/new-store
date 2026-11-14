import z from "zod";

export const replenishStockSchema = z.object({
  quantity: z.number().int().positive().default(10),
});

export type ReplenishStock = z.infer<typeof replenishStockSchema>;
