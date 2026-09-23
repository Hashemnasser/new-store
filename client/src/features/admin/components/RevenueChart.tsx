// src/features/admin/components/RevenueChart.tsx

import { motion } from "framer-motion";
import type { SalesDataPoint } from "../types/admin.types";

interface RevenueChartProps {
  data: {
    totalOrders: number;
    totalRevenue: number;
    salesData: SalesDataPoint[];
  };
  isLoading?: boolean;
}

export const RevenueChart = ({
  data,
  isLoading = false,
}: RevenueChartProps) => {
  console.log("data.............::::", data);
  if (isLoading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="h-6 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
          <div className="h-4 w-20 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
        </div>
        <div className="h-48 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
      </div>
    );
  }
  const salesData = data?.salesData ?? [];

  const maxValue = Math.max(...salesData.map((d) => d.total), 1);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.1 }}
      className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          المبيعات اليومية
        </h3>
        <span className="text-sm text-gray-500 dark:text-gray-400">
          آخر {salesData?.length} يوم
        </span>
      </div>

      <div className="h-48 flex items-end gap-1">
        {salesData?.map((point, index) => {
          const height = (point.total / maxValue) * 100;
          const date = new Date(point.date);
          const dayName = date.toLocaleDateString("ar", { weekday: "short" });

          return (
            <motion.div
              key={point.date}
              initial={{ height: 0 }}
              animate={{ height: `${height}%` }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
              className="flex-1 flex flex-col items-center justify-end"
            >
              <div
                className="w-full max-w-10 bg-blue-500 hover:bg-blue-600 rounded-t transition-colors relative group"
                style={{ height: `${Math.max(height, 4)}%` }}
              >
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-800 dark:bg-gray-700 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition whitespace-nowrap">
                  ${point.total.toFixed(0)}
                </div>
              </div>
              <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {dayName}
              </span>
            </motion.div>
          );
        })}
      </div>

      <div className="mt-4 flex justify-between text-sm text-gray-500 dark:text-gray-400">
        <span>
          إجمالي المبيعات: $
          {salesData?.reduce((sum, d) => sum + d.total, 0).toFixed(0)}
        </span>
        <span>عدد الطلبات: {Number(data?.totalOrders ?? 0)}</span>
      </div>
    </motion.div>
  );
};
