// // src/pages/user/OrdersPage.tsx

// import { motion } from "framer-motion";
// import { PageContainer } from "../../components/layout/PageContainer";
// import { OrderCard } from "../../features/orders/components/OrderCard";
// import { useOrders } from "../../features/orders/hooks/useOrders";
// import type { Order } from "../../features/orders/types/order.types";
// import { isEmpty } from "../../utils/helpers";

// export const OrdersPage = () => {
//   const { data, isLoading, error } = useOrders();
//   console.log("orderDarata####::", useOrders());
//   console.log("orderDarata####@@@@@@::", data?.data);
//   const orders: Order[] = data?.data || [];

//   if (isLoading) {
//     return (
//       <PageContainer>
//         <div className="flex items-center justify-center min-h-[60vh]">
//           <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
//         </div>
//       </PageContainer>
//     );
//   }

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
//         <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
//           طلباتي
//         </h1>

//         {isEmpty(orders) ? (
//           <div className="text-center py-12">
//             <div className="text-6xl mb-4">📦</div>
//             <h2 className="text-xl font-medium text-gray-700 dark:text-gray-300 mb-2">
//               لا توجد طلبات
//             </h2>
//             <p className="text-gray-500 dark:text-gray-400">
//               لم تقم بإجراء أي طلب حتى الآن
//             </p>
//           </div>
//         ) : (
//           <div className="space-y-4">
//             {orders?.map((order) => (
//               <OrderCard key={order.id} order={order} />
//             ))}
//           </div>
//         )}
//       </motion.div>
//     </PageContainer>
//   );
// };

// src/pages/user/OrdersPage.tsx
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { PageContainer } from "../../components/layout/PageContainer";
import { OrderCard } from "../../features/orders/components/OrderCard";
import { useOrders } from "../../features/orders/hooks/useOrders";
import type { Order } from "../../features/orders/types/order.types";
import { isEmpty } from "../../utils/helpers";

export const OrdersPage = () => {
  const { t } = useTranslation();
  const { data, isLoading, error } = useOrders();
  const orders: Order[] = data?.data || [];

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
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          {t("orders.title")}
        </h1>

        {isEmpty(orders) ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📦</div>
            <h2 className="text-xl font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t("orders.empty")}
            </h2>
            <p className="text-gray-500 dark:text-gray-400">
              {t("orders.empty")}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {orders?.map((order) => (
              <OrderCard key={order.id} order={order} />
            ))}
          </div>
        )}
      </motion.div>
    </PageContainer>
  );
};
