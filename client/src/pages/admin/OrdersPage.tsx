// // src/pages/admin/OrdersPage.tsx

// import { motion } from "framer-motion";
// import { Eye, Package, Trash2 } from "lucide-react";
// import { useCallback, useMemo, useState } from "react";
// import { PageContainer } from "../../components/layout/PageContainer";
// import {
//   useAllOrders,
//   useDeleteOrderById,
//   useUpdateOrderStatus,
// } from "../../features/orders/hooks/useOrders";
// import type {
//   Order,
//   OrderStatus,
// } from "../../features/orders/types/order.types";
// import { formatCurrency } from "../../utils/currency";
// import { formatDate } from "../../utils/date";
// import { isEmpty } from "../../utils/helpers";

// const statusColors: Record<OrderStatus, string> = {
//   PENDING:
//     "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
//   PROCESSING:
//     "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
//   SHIPPED:
//     "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300",
//   DELIVERED:
//     "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
//   CANCELLED: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
// };

// const statusLabels: Record<OrderStatus, string> = {
//   PENDING: "قيد الانتظار",
//   PROCESSING: "قيد المعالجة",
//   SHIPPED: "تم الشحن",
//   DELIVERED: "تم التوصيل",
//   CANCELLED: "ملغي",
// };

// const statusOptions: OrderStatus[] = [
//   "PENDING",
//   "PROCESSING",
//   "SHIPPED",
//   "DELIVERED",
//   "CANCELLED",
// ];

// export const AdminOrdersPage = () => {
//   const { data, isLoading, error } = useAllOrders();
//   const updateOrderStatus = useUpdateOrderStatus();
//   const deleteOrderById = useDeleteOrderById();
//   // ✅ استخراج الطلبات من الاستجابة
//   const orders: Order[] = useMemo(
//     () => (Array.isArray(data?.data) ? data.data : []),
//     [data]
//   );

//   // ✅ استخدام Set لإدارة الحالة المفتوحة لكل طلب باستخدام المعرف الفريد
//   const [expandedOrders, setExpandedOrders] = useState<Set<string>>(new Set());

//   // ✅ دالة لتبديل حالة العرض لطلب معين
//   const toggleOrderDetails = useCallback((orderId: string) => {
//     setExpandedOrders((prev) => {
//       const newSet = new Set(prev);
//       if (newSet.has(orderId)) {
//         newSet.delete(orderId);
//       } else {
//         newSet.add(orderId);
//       }
//       return newSet;
//     });
//   }, []);

//   const handeDeleteOrder = useCallback(
//     (orderId: string) => {
//       if (window.confirm("هل أنت متأكد من حذف هذا الطلب؟")) {
//         deleteOrderById.mutate(orderId);
//       }
//     },
//     [deleteOrderById]
//   );

//   const handleStatusChange = useCallback(
//     (orderId: string, status: OrderStatus) => {
//       updateOrderStatus.mutate({ id: orderId, status });
//     },
//     [updateOrderStatus]
//   );

//   // ✅ عرض حالة التحميل
//   if (isLoading) {
//     return (
//       <PageContainer>
//         <div className="flex items-center justify-center min-h-[60vh]">
//           <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
//         </div>
//       </PageContainer>
//     );
//   }

//   // ✅ عرض حالة الخطأ
//   if (error) {
//     return (
//       <PageContainer>
//         <div className="text-center py-12">
//           <p className="text-red-600">حدث خطأ أثناء جلب الطلبات</p>
//         </div>
//       </PageContainer>
//     );
//   }

//   return (
//     <PageContainer>
//       <motion.div
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.3 }}
//       >
//         <div className="flex items-center justify-between mb-6">
//           <h1 className="text-2xl font-bold  flex items-center gap-2">
//             <Package className="w-6 h-6" />
//             إدارة الطلبات
//           </h1>
//           <span className="text-sm text-gray-500 dark:text-gray-400">
//             إجمالي الطلبات: {orders.length}
//           </span>
//         </div>

//         {isEmpty(orders) ? (
//           <div className="text-center py-12">
//             <div className="text-6xl mb-4">📦</div>
//             <h2 className="text-xl font-medium text-gray-700 dark:text-gray-300 mb-2">
//               لا توجد طلبات
//             </h2>
//           </div>
//         ) : (
//           <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
//             <div className="overflow-x-auto  px-4">
//               <table className="w-full text-sm ">
//                 <thead className="bg-gray-50 dark:bg-gray-700/50 ">
//                   <tr className="text-left">
//                     <th className="px-4 py-3   text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
//                       رقم الطلب
//                     </th>
//                     <th className="px-4 py-3   text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
//                       العميل
//                     </th>
//                     <th className="px-4 py-3  text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
//                       التاريخ
//                     </th>
//                     <th className="px-4 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
//                       الإجمالي
//                     </th>
//                     <th className="px-4 py-3  text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
//                       الحالة
//                     </th>
//                     <th className=" px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
//                       الإجراءات
//                     </th>
//                   </tr>
//                 </thead>
//                 <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
//                   {orders.map((order) => (
//                     <tr
//                       key={order.id}
//                       className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition"
//                     >
//                       <td className="px-4 py-3 font-mono text-xs text-gray-900 dark:text-white">
//                         {order.id.slice(0, 8)}
//                       </td>
//                       <td className="px-4 py-3 text-gray-900 dark:text-white">
//                         {order.user?.name ||
//                           `مستخدم #${order.userId?.slice(0, 6) || "غير معروف"}`}
//                       </td>
//                       <td className="px-4 py-3 text-gray-500 dark:text-gray-400">
//                         {formatDate(order.createdAt)}
//                       </td>
//                       <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">
//                         {formatCurrency(order.totalAmount)}
//                       </td>
//                       <td className="px-4 py-3">
//                         <select
//                           value={order.status}
//                           onChange={(e) =>
//                             handleStatusChange(
//                               order.id,
//                               e.target.value as OrderStatus
//                             )
//                           }
//                           className={`px-2 py-1 text-xs font-medium rounded-full border-0 focus:ring-2 focus:ring-blue-500 ${
//                             statusColors[order.status]
//                           }`}
//                         >
//                           {statusOptions.map((status) => (
//                             <option
//                               key={status}
//                               value={status}
//                               className="text-gray-900 dark:text-white"
//                             >
//                               {statusLabels[status]}
//                             </option>
//                           ))}
//                         </select>
//                       </td>
//                       <td className="px-4 py-3">
//                         <div className="flex flex-col gap-2">
//                           <div className="flex items-center gap-2">
//                             <button
//                               onClick={() => toggleOrderDetails(order.id)}
//                               className={`p-1 rounded-lg transition ${
//                                 expandedOrders.has(order.id)
//                                   ? "text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
//                                   : "text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
//                               } hover:bg-blue-50 dark:hover:bg-blue-900/20`}
//                               title={
//                                 expandedOrders.has(order.id)
//                                   ? "إخفاء التفاصيل"
//                                   : "عرض التفاصيل"
//                               }
//                             >
//                               <Eye className="w-4 h-4" />
//                             </button>
//                             <button
//                               onClick={() => handeDeleteOrder(order.id)}
//                               className="p-1 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition"
//                               title="حذف"
//                             >
//                               <Trash2 className="w-4 h-4" />
//                             </button>
//                           </div>

//                           {/* ✅ عرض تفاصيل الطلب عند توسيعه */}
//                           {expandedOrders.has(order.id) && (
//                             <div className="mt-2 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
//                               <h4 className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">
//                                 تفاصيل الطلب:
//                               </h4>
//                               <ul className="space-y-1 text-xs text-gray-600 dark:text-gray-300">
//                                 {order.items.map((item) => (
//                                   <li
//                                     key={item.id}
//                                     className="flex justify-between"
//                                   >
//                                     <span>
//                                       {item.variant?.product?.slug ||
//                                         "منتج غير معروف"}
//                                     </span>
//                                     <span className="font-medium">
//                                       {item.quantity} ×{" "}
//                                       {formatCurrency(item.price)}
//                                     </span>
//                                   </li>
//                                 ))}
//                                 <li className="pt-1 mt-1 border-t border-gray-200 dark:border-gray-600 font-semibold flex justify-between">
//                                   <span>الإجمالي</span>
//                                   <span>
//                                     {formatCurrency(order.totalAmount)}
//                                   </span>
//                                 </li>
//                               </ul>
//                             </div>
//                           )}
//                         </div>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         )}
//       </motion.div>
//     </PageContainer>
//   );
// };

// src/pages/admin/OrdersPage.tsx

import { motion } from "framer-motion";
import { Eye, Package, Trash2 } from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { PageContainer } from "../../components/layout/PageContainer";
import {
  useAllOrders,
  useDeleteOrderById,
  useUpdateOrderStatus,
} from "../../features/orders/hooks/useOrders";
import type {
  Order,
  OrderStatus,
} from "../../features/orders/types/order.types";
import { formatCurrency } from "../../utils/currency";
import { formatDate } from "../../utils/date";
import { isEmpty } from "../../utils/helpers";

const statusColors: Record<OrderStatus, string> = {
  PENDING:
    "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
  PROCESSING:
    "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
  SHIPPED:
    "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300",
  DELIVERED:
    "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
  CANCELLED: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
};

const statusOptions: OrderStatus[] = [
  "PENDING",
  "PROCESSING",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
];

export const AdminOrdersPage = () => {
  const { t } = useTranslation();
  const { data, isLoading, error } = useAllOrders();
  const updateOrderStatus = useUpdateOrderStatus();
  const deleteOrderById = useDeleteOrderById();

  const orders: Order[] = useMemo(
    () => (Array.isArray(data?.data) ? data.data : []),
    [data]
  );

  const [expandedOrders, setExpandedOrders] = useState<Set<string>>(new Set());

  const toggleOrderDetails = useCallback((orderId: string) => {
    setExpandedOrders((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(orderId)) {
        newSet.delete(orderId);
      } else {
        newSet.add(orderId);
      }
      return newSet;
    });
  }, []);

  const handeDeleteOrder = useCallback(
    (orderId: string, orderNumber: string) => {
      if (window.confirm(t("common.confirmDelete") + ` #${orderNumber}?`)) {
        deleteOrderById.mutate(orderId);
      }
    },
    [deleteOrderById, t]
  );

  const handleStatusChange = useCallback(
    (orderId: string, status: OrderStatus) => {
      updateOrderStatus.mutate({ id: orderId, status });
    },
    [updateOrderStatus]
  );

  // Helper to get translated status label
  const getStatusLabel = useCallback(
    (status: OrderStatus) => {
      return t(`orders.status.${status.toLowerCase()}`);
    },
    [t]
  );

  if (isLoading) {
    return (
      <PageContainer>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
        </div>
      </PageContainer>
    );
  }

  if (error) {
    return (
      <PageContainer>
        <div className="text-center py-12">
          <p className="text-red-600">{t("common.error")}</p>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Package className="w-6 h-6" />
            {t("admin.manageOrders")}
          </h1>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {t("common.totalOrders")}: {orders.length}
          </span>
        </div>

        {isEmpty(orders) ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📦</div>
            <h2 className="text-xl font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t("orders.noOrders")}
            </h2>
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="overflow-x-auto px-4">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 dark:bg-gray-700/50">
                  <tr className="text-left">
                    <th className="px-4 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      {t("orders.orderNumber")}
                    </th>
                    <th className="px-4 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      {t("common.customer")}
                    </th>
                    <th className="px-4 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      {t("common.date")}
                    </th>
                    <th className="px-4 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      {t("common.total")}
                    </th>
                    <th className="px-4 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      {t("orders.status")}
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      {t("common.actions")}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {orders.map((order) => (
                    <tr
                      key={order.id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition"
                    >
                      <td className="px-4 py-3 font-mono text-xs text-gray-900 dark:text-white">
                        {order.id.slice(0, 8)}
                      </td>
                      <td className="px-4 py-3 text-gray-900 dark:text-white">
                        {order.user?.name ||
                          `${t("common.user")} #${
                            order.userId?.slice(0, 6) || t("common.unknown")
                          }`}
                      </td>
                      <td className="px-4 py-3 text-gray-500 dark:text-gray-400">
                        {formatDate(order.createdAt)}
                      </td>
                      <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">
                        {formatCurrency(order.totalAmount)}
                      </td>
                      <td className="px-4 py-3">
                        <select
                          value={order.status}
                          onChange={(e) =>
                            handleStatusChange(
                              order.id,
                              e.target.value as OrderStatus
                            )
                          }
                          className={`px-2 py-1 text-xs font-medium rounded-full border-0 focus:ring-2 focus:ring-blue-500 ${
                            statusColors[order.status]
                          }`}
                        >
                          {statusOptions.map((status) => (
                            <option
                              key={status}
                              value={status}
                              className="text-gray-900 dark:text-white"
                            >
                              {getStatusLabel(status)}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-col gap-2">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => toggleOrderDetails(order.id)}
                              className={`p-1 rounded-lg transition ${
                                expandedOrders.has(order.id)
                                  ? "text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                                  : "text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                              } hover:bg-blue-50 dark:hover:bg-blue-900/20`}
                              title={
                                expandedOrders.has(order.id)
                                  ? t("common.hideDetails")
                                  : t("common.viewDetails")
                              }
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() =>
                                handeDeleteOrder(order.id, order.id.slice(0, 8))
                              }
                              className="p-1 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition"
                              title={t("common.delete")}
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>

                          {expandedOrders.has(order.id) && (
                            <div className="mt-2 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                              <h4 className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                {t("orders.details")}:
                              </h4>
                              <ul className="space-y-1 text-xs text-gray-600 dark:text-gray-300">
                                {order.items.map((item) => (
                                  <li
                                    key={item.id}
                                    className="flex justify-between"
                                  >
                                    <span>
                                      {item.variant?.product?.slug ||
                                        t("product.unknown")}
                                    </span>
                                    <span className="font-medium">
                                      {item.quantity} ×{" "}
                                      {formatCurrency(item.price)}
                                    </span>
                                  </li>
                                ))}
                                <li className="pt-1 mt-1 border-t border-gray-200 dark:border-gray-600 font-semibold flex justify-between">
                                  <span>{t("common.total")}</span>
                                  <span>
                                    {formatCurrency(order.totalAmount)}
                                  </span>
                                </li>
                              </ul>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </motion.div>
    </PageContainer>
  );
};
