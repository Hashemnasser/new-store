// // src/features/orders/components/OrderCard.tsx

// import { AnimatePresence, motion } from "framer-motion";
// import {
//   Calendar,
//   ChevronDown,
//   ChevronUp,
//   DollarSign,
//   Eye,
//   Package,
// } from "lucide-react";
// import { useState } from "react";
// import { Link } from "react-router-dom";
// import type { Order } from "../types/order.types";

// interface OrderCardProps {
//   order: Order;
// }

// const statusColors: Record<Order["status"], string> = {
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

// const statusLabels: Record<Order["status"], string> = {
//   PENDING: "قيد الانتظار",
//   PROCESSING: "قيد المعالجة",
//   SHIPPED: "تم الشحن",
//   DELIVERED: "تم التوصيل",
//   CANCELLED: "ملغي",
// };

// export const OrderCard = ({ order }: OrderCardProps) => {
//   const [isExpanded, setIsExpanded] = useState(false);

//   const totalItems = order.items.reduce((sum, item) => sum + item.quantity, 0);
//   console.log("Order1111111111111111:::::", order);
//   return (
//     <motion.div
//       initial={{ opacity: 0, y: 20 }}
//       animate={{ opacity: 1, y: 0 }}
//       transition={{ duration: 0.3 }}
//       className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden"
//     >
//       {/* رأس الطلب */}
//       <div className="p-4 sm:p-6">
//         <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
//           <div className="flex items-center gap-4">
//             <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
//               <Package className="w-5 h-5 text-blue-600 dark:text-blue-400" />
//             </div>
//             <div>
//               <p className="text-sm font-medium text-gray-900 dark:text-white">
//                 طلب #{order.id.slice(0, 8)}
//               </p>
//               <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
//                 <span className="flex items-center gap-1">
//                   <Calendar className="w-3 h-3" />
//                   {new Date(order.createdAt).toLocaleDateString("ar")}
//                 </span>
//                 <span className="flex items-center gap-1">
//                   <DollarSign className="w-3 h-3" />
//                   {order.totalAmount
//                     ? Number(order.totalAmount).toFixed(2)
//                     : "0.00"}
//                 </span>
//                 <span>{totalItems} منتج</span>
//               </div>
//             </div>
//           </div>

//           <div className="flex items-center gap-3">
//             <span
//               className={`px-3 py-1 text-xs font-medium rounded-full ${
//                 statusColors[order.status]
//               }`}
//             >
//               {statusLabels[order.status]}
//             </span>
//             <Link
//               to={`/orders/${order.id}`}
//               className="p-2 text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition"
//               aria-label="عرض التفاصيل"
//             >
//               <Eye className="w-4 h-4" />
//             </Link>
//             <button
//               onClick={() => setIsExpanded(!isExpanded)}
//               className="p-2 text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition"
//               aria-label="توسيع"
//             >
//               {isExpanded ? (
//                 <ChevronUp className="w-4 h-4" />
//               ) : (
//                 <ChevronDown className="w-4 h-4" />
//               )}
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* محتوى موسع */}
//       <AnimatePresence>
//         {isExpanded && (
//           <motion.div
//             initial={{ height: 0, opacity: 0 }}
//             animate={{ height: "auto", opacity: 1 }}
//             exit={{ height: 0, opacity: 0 }}
//             transition={{ duration: 0.3 }}
//             className="overflow-hidden"
//           >
//             <div className="px-4 pb-4 sm:px-6 sm:pb-6 border-t border-gray-200 dark:border-gray-700 pt-4">
//               <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
//                 عناصر الطلب
//               </h4>
//               <div className="space-y-3">
//                 {order.items.map((item) => (
//                   <div
//                     key={item.id}
//                     className="flex items-center gap-4 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
//                   >
//                     <img
//                       src={
//                         item.variant.product.images.find((img) => img.isPrimary)
//                           ?.url || "/images/placeholder.png"
//                       }
//                       alt={item.variant.product.title}
//                       className="w-12 h-12 object-cover rounded-lg"
//                       loading="lazy"
//                     />
//                     <div className="flex-1 min-w-0">
//                       <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
//                         {item.variant.product.title}
//                       </p>
//                       <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
//                         {item.variant.color && (
//                           <span>اللون: {item.variant.color}</span>
//                         )}
//                         {item.variant.size && (
//                           <span>المقاس: {item.variant.size}</span>
//                         )}
//                         <span>الكمية: {item.quantity}</span>
//                         <span>${Number(item.price).toFixed(2) ?? "0.00"}</span>
//                       </div>
//                     </div>
//                     <span className="text-sm font-semibold text-gray-900 dark:text-white">
//                       ${(item.price * item.quantity).toFixed(2)}
//                     </span>
//                   </div>
//                 ))}
//               </div>

//               {/* عنوان الشحن */}
//               <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
//                 <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
//                   عنوان الشحن
//                 </h4>
//                 <p className="text-sm text-gray-600 dark:text-gray-300">
//                   {order.shippingAddress.street}, {order.shippingAddress.city},{" "}
//                   {order.shippingAddress.postalCode},{" "}
//                   {order.shippingAddress.country}
//                 </p>
//               </div>
//             </div>
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </motion.div>
//   );
// };

// src/features/orders/components/OrderCard.tsx
import { AnimatePresence, motion } from "framer-motion";
import {
  Calendar,
  ChevronDown,
  ChevronUp,
  DollarSign,
  Eye,
  Package,
} from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import type { Order } from "../types/order.types";

interface OrderCardProps {
  order: Order;
}

const statusColors: Record<Order["status"], string> = {
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

const statusLabels = {
  PENDING: "orders.pending",
  PROCESSING: "orders.processing",
  SHIPPED: "orders.shipped",
  DELIVERED: "orders.delivered",
  CANCELLED: "orders.cancelled",
};

export const OrderCard = ({ order }: OrderCardProps) => {
  const { t } = useTranslation();
  const [isExpanded, setIsExpanded] = useState(false);

  const totalItems = order.items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden"
    >
      <div className="p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center gap-4">
            <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <Package className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {t("orders.orderNumber")} #{order.id.slice(0, 8)}
              </p>
              <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {new Date(order.createdAt).toLocaleDateString("ar")}
                </span>
                <span className="flex items-center gap-1">
                  <DollarSign className="w-3 h-3" />
                  {order.totalAmount
                    ? Number(order.totalAmount).toFixed(2)
                    : "0.00"}
                </span>
                <span>
                  {totalItems} {t("orders.itemsCount")}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span
              className={`px-3 py-1 text-xs font-medium rounded-full ${
                statusColors[order.status]
              }`}
            >
              {t(statusLabels[order.status])}
            </span>
            <Link
              to={`/orders/${order.id}`}
              className="p-2 text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition"
              aria-label={t("orders.details")}
            >
              <Eye className="w-4 h-4" />
            </Link>
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-2 text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition"
              aria-label={
                isExpanded ? t("common.closeMenu") : t("common.openMenu")
              }
            >
              {isExpanded ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 sm:px-6 sm:pb-6 border-t border-gray-200 dark:border-gray-700 pt-4">
              <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
                {t("orders.details")}
              </h4>
              <div className="space-y-3">
                {order.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-4 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
                  >
                    <img
                      src={
                        item.variant.product.images.find((img) => img.isPrimary)
                          ?.url || "/images/placeholder.png"
                      }
                      alt={item.variant.product.title}
                      className="w-12 h-12 object-cover rounded-lg"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                        {item.variant.product.title}
                      </p>
                      <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                        {item.variant.color && (
                          <span>
                            {t("product.color")}: {item.variant.color}
                          </span>
                        )}
                        {item.variant.size && (
                          <span>
                            {t("product.size")}: {item.variant.size}
                          </span>
                        )}
                        <span>
                          {t("common.quantity")}: {item.quantity}
                        </span>
                        <span>${Number(item.price).toFixed(2)}</span>
                      </div>
                    </div>
                    <span className="text-sm font-semibold text-gray-900 dark:text-white">
                      ${(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
                  {t("orders.shippingAddress")}
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {order.shippingAddress.street}, {order.shippingAddress.city},{" "}
                  {order.shippingAddress.postalCode},{" "}
                  {order.shippingAddress.country}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
