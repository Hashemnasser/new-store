// // // src/pages/admin/DashboardPage.tsx

// // import { motion } from "framer-motion";
// // import { DollarSign, Package, ShoppingBag, Users } from "lucide-react";
// // import { useMemo } from "react";
// // import { PageContainer } from "../../components/layout/PageContainer";
// // import { Seo } from "../../components/seo/Seo";
// // import { CategoryDistribution } from "../../features/admin/components/CategoryDistribution";
// // import { RevenueChart } from "../../features/admin/components/RevenueChart";
// // import { StatsCard } from "../../features/admin/components/StatsCard";
// // import { TopProducts } from "../../features/admin/components/TopProducts";
// // import {
// //   useDashboardStats,
// //   useSalesAnalytics,
// // } from "../../features/admin/hooks/useAdmin";
// // import { formatCurrency } from "../../utils/currency";

// // export const AdminDashboardPage = () => {
// //   const { data: stats, isLoading: statsLoading } = useDashboardStats();
// //   const { data: analytics, isLoading: analyticsLoading } = useSalesAnalytics();

// //   // ✅ استخدام useMemo لتجنب إعادة الحساب غير الضرورية
// //   const statsData = useMemo(() => stats ?? {}, [stats]);
// //   const categoryDistributionData = useMemo(
// //     () => stats?.categoryDistribution ?? [],
// //     [stats]
// //   );
// //   console.log("analytics..........:::", analytics);
// //   // ✅ تحضير بيانات الرسم البياني مع قيم افتراضية آمنة
// //   const chartData = useMemo(
// //     () => analytics ?? { salesData: [], totalOrders: 0, totalRevenue: 0 },
// //     [analytics]
// //   );

// //   return (
// //     <PageContainer>
// //       <Seo
// //         title="لوحة التحكم - ProStore Admin"
// //         description="لوحة تحكم المدير لإدارة المنتجات والطلبات والمستخدمين."
// //       />
// //       <motion.div
// //         initial={{ opacity: 0, y: 20 }}
// //         animate={{ opacity: 1, y: 0 }}
// //         transition={{ duration: 0.3 }}
// //       >
// //         <h1 className="text-2xl font-bold mb-6 flex justify-end mr-3">
// //           : لوحة التحكم
// //         </h1>

// //         {/* البطاقات الإحصائية الأساسية */}
// //         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
// //           <StatsCard
// //             title="إجمالي المستخدمين"
// //             value={statsData.totalUsers ?? 0}
// //             icon={Users}
// //             color="blue"
// //             isLoading={statsLoading}
// //           />
// //           <StatsCard
// //             title="إجمالي المنتجات"
// //             value={statsData.totalProducts ?? 0}
// //             icon={Package}
// //             color="green"
// //             isLoading={statsLoading}
// //           />
// //           <StatsCard
// //             title="إجمالي الطلبات"
// //             value={statsData.totalOrders ?? 0}
// //             icon={ShoppingBag}
// //             color="purple"
// //             isLoading={statsLoading}
// //           />
// //           <StatsCard
// //             title="إجمالي الإيرادات"
// //             value={formatCurrency(statsData.totalRevenue ?? 0)}
// //             icon={DollarSign}
// //             color="orange"
// //             isLoading={statsLoading}
// //           />
// //         </div>

// //         {/* الكاردات الجديدة: نمو المستخدمين وحالة الطلبات */}
// //         <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
// //           {/* كارد نمو المستخدمين */}
// //           <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
// //             <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
// //               نمو المستخدمين
// //             </h3>
// //             {statsLoading ? (
// //               <div className="flex items-center justify-between">
// //                 <div>
// //                   <div className="h-8 w-20 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
// //                   <div className="mt-1 h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
// //                 </div>
// //                 <div className="h-8 w-12 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
// //               </div>
// //             ) : (
// //               <div className="flex items-center justify-between">
// //                 <div>
// //                   <p className="text-2xl font-bold text-gray-900 dark:text-white">
// //                     {statsData.userGrowth?.totalUsers ?? 0}
// //                   </p>
// //                   <p className="text-xs text-gray-500 dark:text-gray-400">
// //                     +{statsData.userGrowth?.newUsersLastMonth ?? 0} جديد هذا
// //                     الشهر
// //                   </p>
// //                 </div>
// //                 <span
// //                   className={`text-sm font-semibold ${
// //                     (statsData.userGrowth?.growthRate ?? 0) > 0
// //                       ? "text-green-600"
// //                       : "text-red-600"
// //                   }`}
// //                 >
// //                   {statsData.userGrowth?.growthRate ?? 0}%
// //                 </span>
// //               </div>
// //             )}
// //           </div>

// //           {/* كارد توزيع الطلبات حسب الحالة */}
// //           <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
// //             <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
// //               حالة الطلبات
// //             </h3>
// //             {statsLoading ? (
// //               <div className="space-y-2">
// //                 {[1, 2, 3, 4, 5].map((i) => (
// //                   <div
// //                     key={i}
// //                     className="h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"
// //                   />
// //                 ))}
// //               </div>
// //             ) : (
// //               <div className="space-y-1">
// //                 {[
// //                   {
// //                     key: "pending",
// //                     label: "قيد الانتظار",
// //                     color: "text-yellow-600",
// //                   },
// //                   {
// //                     key: "processing",
// //                     label: "قيد المعالجة",
// //                     color: "text-blue-600",
// //                   },
// //                   {
// //                     key: "shipped",
// //                     label: "تم الشحن",
// //                     color: "text-purple-600",
// //                   },
// //                   {
// //                     key: "delivered",
// //                     label: "تم التوصيل",
// //                     color: "text-green-600",
// //                   },
// //                   { key: "cancelled", label: "ملغي", color: "text-red-600" },
// //                 ].map(({ key, label, color }) => (
// //                   <div
// //                     key={key}
// //                     className="flex justify-between text-sm py-1 border-b border-gray-100 dark:border-gray-700 last:border-0"
// //                   >
// //                     <span className={`font-medium ${color}`}>{label}</span>
// //                     <span className="font-bold text-gray-900 dark:text-white">
// //                       {statsData.ordersByStatus?.[
// //                         key as keyof typeof statsData.ordersByStatus
// //                       ] ?? 0}
// //                     </span>
// //                   </div>
// //                 ))}
// //               </div>
// //             )}
// //           </div>
// //         </div>

// //         {/* الرسم البياني وأفضل المنتجات */}
// //         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
// //           <RevenueChart data={chartData} isLoading={analyticsLoading} />
// //           <TopProducts
// //             products={statsData.topProducts ?? []}
// //             isLoading={statsLoading}
// //           />
// //         </div>

// //         {/* توزيع التصنيفات */}
// //         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
// //           <CategoryDistribution
// //             data={categoryDistributionData}
// //             isLoading={statsLoading}
// //           />
// //         </div>
// //       </motion.div>
// //     </PageContainer>
// //   );
// // };

// // src/pages/admin/DashboardPage.tsx
// import { motion } from "framer-motion";
// import {
//   AlertTriangle,
//   DollarSign,
//   Package,
//   ShoppingBag,
//   Users,
// } from "lucide-react";
// import { useTranslation } from "react-i18next";
// import { Link } from "react-router-dom";
// import { ROUTES } from "../../app/router/route.constants";
// import { PageContainer } from "../../components/layout/PageContainer";
// import { Seo } from "../../components/seo/Seo";
// import { CategoryDistribution } from "../../features/admin/components/CategoryDistribution";
// import { RevenueChart } from "../../features/admin/components/RevenueChart";
// import { StatsCard } from "../../features/admin/components/StatsCard";
// import { TopProducts } from "../../features/admin/components/TopProducts";
// import {
//   useDashboardStats,
//   useLowStockProducts,
//   useSalesAnalytics,
// } from "../../features/admin/hooks/useAdmin";
// import { LowStockProduct } from "../../features/admin/types/admin.types";
// import { formatCurrency } from "../../utils/currency";

// export const AdminDashboardPage = () => {
//   const { t } = useTranslation();
//   const { data: stats, isLoading: statsLoading } = useDashboardStats();
//   const { data: analytics, isLoading: analyticsLoading } = useSalesAnalytics();
//   const { data, isLoading: lowStockLoading } = useLowStockProducts(5);
//   const lowStockProducts: LowStockProduct[] = data ?? [];
//   const statsData = stats ?? {};
//   const categoryDistributionData = stats?.categoryDistribution ?? [];

//   return (
//     <PageContainer>
//       <Seo
//         title={t("admin.dashboard") + " - ProStore Admin"}
//         description={t("admin.dashboard") + " - ProStore Admin"}
//       />
//       <motion.div
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.3 }}
//       >
//         <h1 className="text-2xl font-bold mb-6 flex justify-end mr-3">
//           : {t("admin.dashboard")}
//         </h1>

//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
//           <StatsCard
//             title={t("admin.totalUsers")}
//             value={statsData.totalUsers ?? 0}
//             icon={Users}
//             color="blue"
//             isLoading={statsLoading}
//           />
//           <StatsCard
//             title={t("admin.totalProducts")}
//             value={statsData.totalProducts ?? 0}
//             icon={Package}
//             color="green"
//             isLoading={statsLoading}
//           />
//           <StatsCard
//             title={t("admin.totalOrders")}
//             value={statsData.totalOrders ?? 0}
//             icon={ShoppingBag}
//             color="purple"
//             isLoading={statsLoading}
//           />
//           <StatsCard
//             title={t("admin.totalRevenue")}
//             value={formatCurrency(statsData.totalRevenue ?? 0)}
//             icon={DollarSign}
//             color="orange"
//             isLoading={statsLoading}
//           />
//         </div>

//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
//           <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
//             <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
//               {t("admin.userGrowth")}
//             </h3>
//             {statsLoading ? (
//               <div className="flex items-center justify-between">
//                 <div>
//                   <div className="h-8 w-20 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
//                   <div className="mt-1 h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
//                 </div>
//                 <div className="h-8 w-12 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
//               </div>
//             ) : (
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="text-2xl font-bold text-gray-900 dark:text-white">
//                     {statsData.userGrowth?.totalUsers ?? 0}
//                   </p>
//                   <p className="text-xs text-gray-500 dark:text-gray-400">
//                     +{statsData.userGrowth?.newUsersLastMonth ?? 0}{" "}
//                     {t("admin.newUsers")}
//                   </p>
//                 </div>
//                 <span
//                   className={`text-sm font-semibold ${
//                     (statsData.userGrowth?.growthRate ?? 0) > 0
//                       ? "text-green-600"
//                       : "text-red-600"
//                   }`}
//                 >
//                   {statsData.userGrowth?.growthRate ?? 0}%
//                 </span>
//               </div>
//             )}
//           </div>

//           <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
//             <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
//               {t("admin.ordersByStatus")}
//             </h3>
//             {statsLoading ? (
//               <div className="space-y-2">
//                 {[1, 2, 3, 4, 5].map((i) => (
//                   <div
//                     key={i}
//                     className="h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"
//                   />
//                 ))}
//               </div>
//             ) : (
//               <div className="space-y-1">
//                 {[
//                   { key: "pending", label: t("orders.pending") },
//                   { key: "processing", label: t("orders.processing") },
//                   { key: "shipped", label: t("orders.shipped") },
//                   { key: "delivered", label: t("orders.delivered") },
//                   { key: "cancelled", label: t("orders.cancelled") },
//                 ].map(({ key, label }) => (
//                   <div
//                     key={key}
//                     className="flex justify-between text-sm py-1 border-b border-gray-100 dark:border-gray-700 last:border-0"
//                   >
//                     <span className="font-medium">{label}</span>
//                     <span className="font-bold text-gray-900 dark:text-white">
//                       {statsData.ordersByStatus?.[
//                         key as keyof typeof statsData.ordersByStatus
//                       ] ?? 0}
//                     </span>
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>
//         </div>

//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
//           <RevenueChart
//             data={analytics?.data ?? {}}
//             isLoading={analyticsLoading}
//           />
//           <TopProducts
//             products={statsData.topProducts ?? []}
//             isLoading={statsLoading}
//           />
//         </div>

//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//           <CategoryDistribution
//             data={categoryDistributionData}
//             isLoading={statsLoading}
//           />
//         </div>
//         {/* ✅ كارد تنبيهات المخزون المنخفض */}
//         <div className="col-span-1 md:col-span-2 lg:col-span-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-red-200 dark:border-red-800 p-6">
//           <div className="flex items-center justify-between mb-4">
//             <h3 className="text-lg font-semibold text-red-600 dark:text-red-400 flex items-center gap-2">
//               <AlertTriangle className="w-5 h-5" />
//               {t("admin.lowStockAlerts")}
//             </h3>
//             <span className="text-sm text-gray-500 dark:text-gray-400">
//               {t("admin.threshold")}: 5
//             </span>
//           </div>

//           {lowStockLoading ? (
//             <div className="space-y-2">
//               {[1, 2, 3].map((i) => (
//                 <div
//                   key={i}
//                   className="h-10 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"
//                 />
//               ))}
//             </div>
//           ) : !lowStockProducts || lowStockProducts.length === 0 ? (
//             <p className="text-sm text-green-600 dark:text-green-400 flex items-center gap-2">
//               ✅ {t("admin.allStockHealthy")}
//             </p>
//           ) : (
//             <div className="space-y-2 max-h-60 overflow-y-auto">
//               {lowStockProducts?.map((item) => (
//                 <div
//                   key={item.variantId}
//                   className="flex items-center justify-between p-2 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-100 dark:border-red-800"
//                 >
//                   <div className="flex items-center gap-3">
//                     <img
//                       src={item.image || "/images/placeholder.png"}
//                       alt={item.productTitle}
//                       className="w-8 h-8 object-cover rounded"
//                     />
//                     <div>
//                       <p className="text-sm font-medium text-gray-900 dark:text-white">
//                         {item.productTitle}
//                       </p>
//                       <p className="text-xs text-gray-500 dark:text-gray-400">
//                         {t("product.sku")}: {item.sku}
//                       </p>
//                     </div>
//                   </div>
//                   <div className="flex items-center gap-3">
//                     <span className="text-sm font-bold text-red-600 dark:text-red-400">
//                       {item.stock} {t("admin.remaining")}
//                     </span>
//                     <Link
//                       to={ROUTES.ADMIN_PRODUCT_EDIT(item.slug)}
//                       className="px-3 py-1 text-xs bg-blue-600 hover:bg-blue-700 text-white rounded transition"
//                     >
//                       {t("admin.replenish")}
//                     </Link>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>
//       </motion.div>
//     </PageContainer>
//   );
// };

// src/pages/admin/DashboardPage.tsx
import { motion } from "framer-motion";
import {
  AlertTriangle,
  DollarSign,
  Package,
  ShoppingBag,
  Users,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { ROUTES } from "../../app/router/route.constants";
import { PageContainer } from "../../components/layout/PageContainer";
import { Seo } from "../../components/seo/Seo";
import { CategoryDistribution } from "../../features/admin/components/CategoryDistribution";
import { RevenueChart } from "../../features/admin/components/RevenueChart";
import { StatsCard } from "../../features/admin/components/StatsCard";
import { TopProducts } from "../../features/admin/components/TopProducts";
import {
  useDashboardStats,
  useLowStockProducts,
  useSalesAnalytics,
} from "../../features/admin/hooks/useAdmin";
import type { LowStockProduct } from "../../features/admin/types/admin.types";
import { DashboardStats } from "../../types";
import { formatCurrency } from "../../utils/currency";

export const AdminDashboardPage = () => {
  const { t } = useTranslation();
  const { data: stats, isLoading: statsLoading } = useDashboardStats();
  const { data: analytics, isLoading: analyticsLoading } = useSalesAnalytics();
  const { data: lowStockData, isLoading: lowStockLoading } =
    useLowStockProducts(5);

  // ✅ استخدام Partial لتفادي خطأ TypeScript مع خصائص غير موجودة
  const statsData: Partial<DashboardStats> = stats ?? {};
  const lowStockProducts: LowStockProduct[] = lowStockData ?? [];
  const categoryDistributionData = stats?.categoryDistribution ?? [];
  const analyticsData = analytics ?? {
    totalOrders: 0,
    totalRevenue: 0,
    salesData: [],
  }; // ✅ قائمة حالات الطلبات مع `as const` لضمان النوع الصحيح للمفاتيح
  const orderStatusList = [
    { key: "pending" as const, label: t("orders.pending") },
    { key: "processing" as const, label: t("orders.processing") },
    { key: "shipped" as const, label: t("orders.shipped") },
    { key: "delivered" as const, label: t("orders.delivered") },
    { key: "cancelled" as const, label: t("orders.cancelled") },
  ];

  return (
    <PageContainer>
      <Seo
        title={t("admin.dashboard") + " - ProStore Admin"}
        description={t("admin.dashboard") + " - ProStore Admin"}
      />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h1 className="text-2xl font-bold mb-6 flex justify-end mr-3">
          : {t("admin.dashboard")}
        </h1>

        {/* البطاقات الإحصائية الأساسية */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <StatsCard
            title={t("admin.totalUsers")}
            value={statsData.totalUsers ?? 0}
            icon={Users}
            color="blue"
            isLoading={statsLoading}
          />
          <StatsCard
            title={t("admin.totalProducts")}
            value={statsData.totalProducts ?? 0}
            icon={Package}
            color="green"
            isLoading={statsLoading}
          />
          <StatsCard
            title={t("admin.totalOrders")}
            value={statsData.totalOrders ?? 0}
            icon={ShoppingBag}
            color="purple"
            isLoading={statsLoading}
          />
          <StatsCard
            title={t("admin.totalRevenue")}
            value={formatCurrency(statsData.totalRevenue ?? 0)}
            icon={DollarSign}
            color="orange"
            isLoading={statsLoading}
          />
        </div>

        {/* كاردات النمو والحالة */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {/* كارد نمو المستخدمين */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
              {t("admin.userGrowth")}
            </h3>
            {statsLoading ? (
              <div className="flex items-center justify-between">
                <div>
                  <div className="h-8 w-20 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                  <div className="mt-1 h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                </div>
                <div className="h-8 w-12 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {statsData.userGrowth?.totalUsers ?? 0}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    +{statsData.userGrowth?.newUsersLastMonth ?? 0}{" "}
                    {t("admin.newUsers")}
                  </p>
                </div>
                <span
                  className={`text-sm font-semibold ${
                    (statsData.userGrowth?.growthRate ?? 0) > 0
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {statsData.userGrowth?.growthRate ?? 0}%
                </span>
              </div>
            )}
          </div>

          {/* كارد حالة الطلبات */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
              {t("admin.ordersByStatus")}
            </h3>
            {statsLoading ? (
              <div className="space-y-2">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div
                    key={i}
                    className="h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"
                  />
                ))}
              </div>
            ) : (
              <div className="space-y-1">
                {orderStatusList.map(({ key, label }) => (
                  <div
                    key={key}
                    className="flex justify-between text-sm py-1 border-b border-gray-100 dark:border-gray-700 last:border-0"
                  >
                    <span className="font-medium">{label}</span>
                    <span className="font-bold text-gray-900 dark:text-white">
                      {statsData.ordersByStatus?.[key] ?? 0}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* الرسوم البيانية */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <RevenueChart data={analyticsData} isLoading={analyticsLoading} />
          <TopProducts
            products={statsData.topProducts ?? []}
            isLoading={statsLoading}
          />
        </div>

        {/* توزيع التصنيفات */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <CategoryDistribution
            data={categoryDistributionData}
            isLoading={statsLoading}
          />
        </div>

        {/* كارد تنبيهات المخزون المنخفض */}
        <div className="mt-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-red-200 dark:border-red-800 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-red-600 dark:text-red-400 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              {t("admin.lowStockAlerts")}
            </h3>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {t("admin.threshold")}: 5
            </span>
          </div>

          {lowStockLoading ? (
            <div className="space-y-2">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-10 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"
                />
              ))}
            </div>
          ) : lowStockProducts.length === 0 ? (
            <p className="text-sm text-green-600 dark:text-green-400 flex items-center gap-2">
              ✅ {t("admin.allStockHealthy")}
            </p>
          ) : (
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {lowStockProducts.map((item) => (
                <div
                  key={item.variantId}
                  className="flex items-center justify-between p-2 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-100 dark:border-red-800"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={item.image || "/images/placeholder.png"}
                      alt={item.productTitle}
                      className="w-8 h-8 object-cover rounded"
                    />
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {item.productTitle}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {t("product.sku")}: {item.sku}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-bold text-red-600 dark:text-red-400">
                      {item.stock} {t("admin.remaining")}
                    </span>
                    <Link
                      to={ROUTES.ADMIN_PRODUCT_EDIT(item.slug)}
                      className="px-3 py-1 text-xs bg-blue-600 hover:bg-blue-700 text-white rounded transition"
                    >
                      {t("admin.replenish")}
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </PageContainer>
  );
};
