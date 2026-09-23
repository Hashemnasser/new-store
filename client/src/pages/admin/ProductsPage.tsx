// // // src/pages/admin/ProductsPage.tsx

// // import { motion } from "framer-motion";
// // import { Edit, Eye, Package, Plus, Search, Trash2 } from "lucide-react";
// // import { useCallback, useEffect, useMemo, useState } from "react";
// // import { Link } from "react-router-dom";
// // import { ROUTES } from "../../app/router/route.constants";
// // import { PageContainer } from "../../components/layout/PageContainer";
// // import {
// //   useDeleteProduct,
// //   useProducts,
// // } from "../../features/products/hooks/useProducts";
// // import type { Product } from "../../features/products/types/product.types";
// // import { formatCurrency } from "../../utils/currency";

// // export const AdminProductsPage = () => {
// //   const [searchTerm, setSearchTerm] = useState("");
// //   const { data, isLoading, error, refetch } = useProducts({ limit: 100 });
// //   const deleteProduct = useDeleteProduct();
// //   const [products, setProducts] = useState<Product[]>([]);

// //   useEffect(() => {
// //     if (data?.data) {
// //       setProducts(data.data);
// //     }
// //   }, [data]);

// //   const handleDelete = useCallback(
// //     (id: string) => {
// //       if (window.confirm("هل أنت متأكد من حذف هذا المنتج؟")) {
// //         deleteProduct.mutate(id);
// //       }
// //     },
// //     [deleteProduct]
// //   );

// //   const filteredProducts = useMemo(() => {
// //     return products.filter((product) =>
// //       product.title.toLowerCase().includes(searchTerm.toLowerCase())
// //     );
// //   }, [products, searchTerm]);

// //   // ✅ دالة مساعدة لحساب السعر الأصلي والمخفض
// //   const getProductPrices = useCallback((product: Product) => {
// //     const originalPrice = product.variants[0]?.price || 0;
// //     const discountPercent = product.discountPercent || 0;
// //     const hasDiscount = discountPercent > 0;
// //     const discountedPrice = hasDiscount
// //       ? originalPrice * (1 - discountPercent / 100)
// //       : originalPrice;

// //     return { originalPrice, discountedPrice, discountPercent, hasDiscount };
// //   }, []);

// //   if (isLoading) {
// //     return (
// //       <PageContainer>
// //         <div className="flex items-center justify-center min-h-[60vh]">
// //           <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
// //         </div>
// //       </PageContainer>
// //     );
// //   }

// //   if (error) {
// //     return (
// //       <PageContainer>
// //         <div className="text-center py-12">
// //           <p className="text-red-600">حدث خطأ أثناء جلب المنتجات</p>
// //         </div>
// //       </PageContainer>
// //     );
// //   }

// //   return (
// //     <PageContainer>
// //       <motion.div
// //         initial={{ opacity: 0, y: 20 }}
// //         animate={{ opacity: 1, y: 0 }}
// //         transition={{ duration: 0.3 }}
// //       >
// //         {/* Header */}
// //         <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
// //           <h1 className="text-2xl font-bold flex items-center gap-2">
// //             <Package className="w-6 h-6" />
// //             إدارة المنتجات
// //           </h1>
// //           <Link
// //             to={ROUTES.ADMIN_PRODUCTS_CREATE}
// //             className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition"
// //           >
// //             <Plus className="w-4 h-4" />
// //             إضافة منتج
// //           </Link>
// //         </div>

// //         {/* Search */}
// //         <div className="relative mb-6">
// //           <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
// //           <input
// //             type="text"
// //             value={searchTerm}
// //             onChange={(e) => setSearchTerm(e.target.value)}
// //             placeholder="ابحث عن منتج..."
// //             className="w-full pr-10 pl-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
// //           />
// //         </div>

// //         {/* Table */}
// //         {filteredProducts.length === 0 ? (
// //           <div className="text-center py-12">
// //             <div className="text-6xl mb-4">📦</div>
// //             <h2 className="text-xl font-medium text-gray-700 dark:text-gray-300 mb-2">
// //               لا توجد منتجات
// //             </h2>
// //             <p className="text-gray-500 dark:text-gray-400">
// //               أضف منتجاً جديداً للبدء
// //             </p>
// //           </div>
// //         ) : (
// //           <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
// //             <div className="overflow-x-auto">
// //               <table className="w-full text-sm">
// //                 <thead className="bg-gray-50 dark:bg-gray-700/50">
// //                   <tr>
// //                     <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
// //                       المنتج
// //                     </th>
// //                     <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
// //                       السعر
// //                     </th>
// //                     <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
// //                       الخصم
// //                     </th>
// //                     <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
// //                       التصنيف
// //                     </th>
// //                     <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
// //                       المخزون
// //                     </th>
// //                     <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
// //                       الحالة
// //                     </th>
// //                     <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
// //                       الإجراءات
// //                     </th>
// //                   </tr>
// //                 </thead>
// //                 <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
// //                   {filteredProducts.map((product) => {
// //                     const {
// //                       originalPrice,
// //                       discountedPrice,
// //                       discountPercent,
// //                       hasDiscount,
// //                     } = getProductPrices(product);

// //                     return (
// //                       <tr
// //                         key={product.id}
// //                         className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition"
// //                       >
// //                         <td className="px-4 py-3">
// //                           <div className="flex items-center gap-3">
// //                             <img
// //                               src={
// //                                 product.images.find((img) => img.isPrimary)
// //                                   ?.url || "/images/placeholder.png"
// //                               }
// //                               alt={product.title}
// //                               className="w-10 h-10 object-cover rounded-lg"
// //                               loading="lazy"
// //                             />
// //                             <span className="text-gray-900 dark:text-white font-medium line-clamp-1">
// //                               {product.title}
// //                             </span>
// //                           </div>
// //                         </td>
// //                         <td className="px-4 py-3 text-gray-900 dark:text-white">
// //                           {hasDiscount ? (
// //                             <div className="flex flex-col">
// //                               <span className="text-red-600 font-bold">
// //                                 {formatCurrency(discountedPrice)}
// //                               </span>
// //                               <span className="text-xs text-gray-400 line-through">
// //                                 {formatCurrency(originalPrice)}
// //                               </span>
// //                             </div>
// //                           ) : (
// //                             <span>{formatCurrency(originalPrice)}</span>
// //                           )}
// //                         </td>
// //                         <td className="px-4 py-3">
// //                           {hasDiscount ? (
// //                             <span className="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300">
// //                               {discountPercent}%
// //                             </span>
// //                           ) : (
// //                             <span className="text-gray-400">-</span>
// //                           )}
// //                         </td>
// //                         <td className="px-4 py-3 text-gray-500 dark:text-gray-400">
// //                           {product.category?.name || "غير مصنف"}
// //                         </td>
// //                         <td className="px-4 py-3 text-gray-500 dark:text-gray-400">
// //                           {product.variants.reduce(
// //                             (sum, v) => sum + v.stock,
// //                             0
// //                           )}
// //                         </td>
// //                         <td className="px-4 py-3">
// //                           <span
// //                             className={`px-2 py-1 text-xs font-medium rounded-full ${
// //                               product.isPublished
// //                                 ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
// //                                 : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
// //                             }`}
// //                           >
// //                             {product.isPublished ? "منشور" : "غير منشور"}
// //                           </span>
// //                         </td>
// //                         <td className="px-4 py-3">
// //                           <div className="flex items-center gap-2">
// //                             <Link
// //                               to={`/product/${product.slug}`}
// //                               target="_blank"
// //                               className="p-1 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition"
// //                               title="عرض"
// //                             >
// //                               <Eye className="w-4 h-4" />
// //                             </Link>
// //                             <Link
// //                               to={ROUTES.ADMIN_PRODUCT_EDIT(product.slug)}
// //                               className="p-1 text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300 rounded-lg hover:bg-green-50 dark:hover:bg-green-900/20 transition"
// //                               title="تعديل"
// //                             >
// //                               <Edit className="w-4 h-4" />
// //                             </Link>
// //                             <button
// //                               onClick={() => handleDelete(product.id)}
// //                               disabled={deleteProduct.isPending}
// //                               className="p-1 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition disabled:opacity-50"
// //                               title="حذف"
// //                             >
// //                               <Trash2 className="w-4 h-4" />
// //                             </button>
// //                           </div>
// //                         </td>
// //                       </tr>
// //                     );
// //                   })}
// //                 </tbody>
// //               </table>
// //             </div>
// //           </div>
// //         )}
// //       </motion.div>
// //     </PageContainer>
// //   );
// // };

// // src/pages/admin/ProductsPage.tsx

// import { motion } from "framer-motion";
// import { Edit, Eye, Package, Plus, Search, Trash2 } from "lucide-react";
// import { useCallback, useEffect, useMemo, useState } from "react";
// import { useTranslation } from "react-i18next";
// import { Link } from "react-router-dom";
// import { ROUTES } from "../../app/router/route.constants";
// import { PageContainer } from "../../components/layout/PageContainer";
// import {
//   useDeleteProduct,
//   useProducts,
// } from "../../features/products/hooks/useProducts";
// import type { Product } from "../../features/products/types/product.types";
// import { formatCurrency } from "../../utils/currency";

// export const AdminProductsPage = () => {
//   const { t } = useTranslation();
//   const [searchTerm, setSearchTerm] = useState("");
//   const { data, isLoading, error, refetch } = useProducts({ limit: 100 });
//   const deleteProduct = useDeleteProduct();
//   const [products, setProducts] = useState<Product[]>([]);

//   useEffect(() => {
//     if (data?.data) {
//       setProducts(data.data);
//     }
//   }, [data]);

//   const handleDelete = useCallback(
//     (id: string, title: string) => {
//       if (window.confirm(t("common.confirmDelete") + ` "${title}"?`)) {
//         deleteProduct.mutate(id);
//       }
//     },
//     [deleteProduct, t]
//   );

//   const filteredProducts = useMemo(() => {
//     return products.filter((product) =>
//       product.title.toLowerCase().includes(searchTerm.toLowerCase())
//     );
//   }, [products, searchTerm]);

//   // ✅ دالة مساعدة لحساب السعر الأصلي والمخفض
//   const getProductPrices = useCallback((product: Product) => {
//     const originalPrice = product.variants[0]?.price || 0;
//     const discountPercent = product.discountPercent || 0;
//     const hasDiscount = discountPercent > 0;
//     const discountedPrice = hasDiscount
//       ? originalPrice * (1 - discountPercent / 100)
//       : originalPrice;

//     return { originalPrice, discountedPrice, discountPercent, hasDiscount };
//   }, []);

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
//           <p className="text-red-600">{t("common.error")}</p>
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
//         {/* Header */}
//         <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
//           <h1 className="text-2xl font-bold flex items-center gap-2">
//             <Package className="w-6 h-6" />
//             {t("admin.manageProducts")}
//           </h1>
//           <Link
//             to={ROUTES.ADMIN_PRODUCTS_CREATE}
//             className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition"
//           >
//             <Plus className="w-4 h-4" />
//             {t("admin.addProduct")}
//           </Link>
//         </div>

//         {/* Search */}
//         <div className="relative mb-6">
//           <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
//           <input
//             type="text"
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//             placeholder={t("common.search")}
//             className="w-full pr-10 pl-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
//           />
//         </div>

//         {/* Table */}
//         {filteredProducts.length === 0 ? (
//           <div className="text-center py-12">
//             <div className="text-6xl mb-4">📦</div>
//             <h2 className="text-xl font-medium text-gray-700 dark:text-gray-300 mb-2">
//               {t("admin.noProducts")}
//             </h2>
//             <p className="text-gray-500 dark:text-gray-400">
//               {t("admin.startAddingProducts")}
//             </p>
//           </div>
//         ) : (
//           <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
//             <div className="overflow-x-auto">
//               <table className="w-full text-sm">
//                 <thead className="bg-gray-50 dark:bg-gray-700/50">
//                   <tr>
//                     <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
//                       {t("product.title")}
//                     </th>
//                     <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
//                       {t("product.price")}
//                     </th>
//                     <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
//                       {t("product.discount")}
//                     </th>
//                     <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
//                       {t("product.category")}
//                     </th>
//                     <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
//                       {t("product.stock")}
//                     </th>
//                     <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
//                       {t("product.status")}
//                     </th>
//                     <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
//                       {t("common.actions")}
//                     </th>
//                   </tr>
//                 </thead>
//                 <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
//                   {filteredProducts.map((product) => {
//                     const {
//                       originalPrice,
//                       discountedPrice,
//                       discountPercent,
//                       hasDiscount,
//                     } = getProductPrices(product);

//                     return (
//                       <tr
//                         key={product.id}
//                         className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition"
//                       >
//                         <td className="px-4 py-3">
//                           <div className="flex items-center gap-3">
//                             <img
//                               src={
//                                 product.images.find((img) => img.isPrimary)
//                                   ?.url || "/images/placeholder.png"
//                               }
//                               alt={product.title}
//                               className="w-10 h-10 object-cover rounded-lg"
//                               loading="lazy"
//                             />
//                             <span className="text-gray-900 dark:text-white font-medium line-clamp-1">
//                               {product.title}
//                             </span>
//                           </div>
//                         </td>
//                         <td className="px-4 py-3 text-gray-900 dark:text-white">
//                           {hasDiscount ? (
//                             <div className="flex flex-col">
//                               <span className="text-red-600 font-bold">
//                                 {formatCurrency(discountedPrice)}
//                               </span>
//                               <span className="text-xs text-gray-400 line-through">
//                                 {formatCurrency(originalPrice)}
//                               </span>
//                             </div>
//                           ) : (
//                             <span>{formatCurrency(originalPrice)}</span>
//                           )}
//                         </td>
//                         <td className="px-4 py-3">
//                           {hasDiscount ? (
//                             <span className="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300">
//                               {discountPercent}%
//                             </span>
//                           ) : (
//                             <span className="text-gray-400">-</span>
//                           )}
//                         </td>
//                         <td className="px-4 py-3 text-gray-500 dark:text-gray-400">
//                           {product.category?.name || t("admin.uncategorized")}
//                         </td>
//                         <td className="px-4 py-3 text-gray-500 dark:text-gray-400">
//                           {product.variants.reduce(
//                             (sum, v) => sum + v.stock,
//                             0
//                           )}
//                         </td>
//                         <td className="px-4 py-3">
//                           <span
//                             className={`px-2 py-1 text-xs font-medium rounded-full ${
//                               product.isPublished
//                                 ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
//                                 : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
//                             }`}
//                           >
//                             {product.isPublished
//                               ? t("product.published")
//                               : t("product.unpublished")}
//                           </span>
//                         </td>
//                         <td className="px-4 py-3">
//                           <div className="flex items-center gap-2">
//                             <Link
//                               to={`/product/${product.slug}`}
//                               target="_blank"
//                               className="p-1 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition"
//                               title={t("common.view")}
//                             >
//                               <Eye className="w-4 h-4" />
//                             </Link>
//                             <Link
//                               to={ROUTES.ADMIN_PRODUCT_EDIT(product.slug)}
//                               className="p-1 text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300 rounded-lg hover:bg-green-50 dark:hover:bg-green-900/20 transition"
//                               title={t("common.edit")}
//                             >
//                               <Edit className="w-4 h-4" />
//                             </Link>
//                             <button
//                               onClick={() =>
//                                 handleDelete(product.id, product.title)
//                               }
//                               disabled={deleteProduct.isPending}
//                               className="p-1 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition disabled:opacity-50"
//                               title={t("common.delete")}
//                             >
//                               <Trash2 className="w-4 h-4" />
//                             </button>
//                           </div>
//                         </td>

//                       </tr>
//                     );
//                   })}
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         )}
//       </motion.div>
//     </PageContainer>
//   );
// };

// src/pages/admin/ProductsPage.tsx

import { motion } from "framer-motion";
import {
  Edit,
  Eye,
  Package,
  Plus,
  RefreshCw,
  Search,
  Trash2,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { ROUTES } from "../../app/router/route.constants";
import { PageContainer } from "../../components/layout/PageContainer";
import { useReplenishStock } from "../../features/admin/hooks/useAdmin";
import {
  useDeleteProduct,
  useProducts,
} from "../../features/products/hooks/useProducts";
import type { Product } from "../../features/products/types/product.types";
import { formatCurrency } from "../../utils/currency";

export const AdminProductsPage = () => {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState("");
  const { data, isLoading, error, refetch } = useProducts({
    limit: 100,
    includeOutOfStock: true,
  });
  const deleteProduct = useDeleteProduct();
  const replenishStock = useReplenishStock();
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    if (data?.data) {
      setProducts(data.data);
    }
  }, [data]);

  const handleDelete = useCallback(
    (id: string, title: string) => {
      if (window.confirm(t("common.confirmDelete") + ` "${title}"?`)) {
        deleteProduct.mutate(id);
      }
    },
    [deleteProduct, t]
  );

  const handleReplenish = useCallback(
    (variantId: string, productTitle: string) => {
      const quantity = window.prompt(
        t("admin.enterReplenishQuantity", { product: productTitle }),
        "10"
      );
      if (quantity === null) return; // المستخدم ألغى
      const quantityNum = parseInt(quantity, 10);
      if (isNaN(quantityNum) || quantityNum <= 0) {
        toast.error(t("admin.invalidQuantity"));
        return;
      }
      replenishStock.mutate(
        { variantId, quantity: quantityNum },
        {
          onSuccess: () => {
            refetch(); // تحديث القائمة بعد إعادة الملء
          },
        }
      );
    },
    [replenishStock, refetch, t]
  );

  const filteredProducts = useMemo(() => {
    return products.filter((product) =>
      product.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [products, searchTerm]);

  // ✅ دالة مساعدة لحساب السعر الأصلي والمخفض
  const getProductPrices = useCallback((product: Product) => {
    const originalPrice = product.variants[0]?.price || 0;
    const discountPercent = product.discountPercent || 0;
    const hasDiscount = discountPercent > 0;
    const discountedPrice = hasDiscount
      ? originalPrice * (1 - discountPercent / 100)
      : originalPrice;

    return { originalPrice, discountedPrice, discountPercent, hasDiscount };
  }, []);

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
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Package className="w-6 h-6" />
            {t("admin.manageProducts")}
          </h1>
          <Link
            to={ROUTES.ADMIN_PRODUCTS_CREATE}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition"
          >
            <Plus className="w-4 h-4" />
            {t("admin.addProduct")}
          </Link>
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={t("common.search")}
            className="w-full pr-10 pl-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
          />
        </div>

        {/* Table */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📦</div>
            <h2 className="text-xl font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t("admin.noProducts")}
            </h2>
            <p className="text-gray-500 dark:text-gray-400">
              {t("admin.startAddingProducts")}
            </p>
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 dark:bg-gray-700/50">
                  <tr>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      {t("product.title")}
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      {t("product.price")}
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      {t("product.discount")}
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      {t("product.category")}
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      {t("product.stock")}
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      {t("product.status")}
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      {t("common.actions")}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredProducts.map((product) => {
                    const {
                      originalPrice,
                      discountedPrice,
                      discountPercent,
                      hasDiscount,
                    } = getProductPrices(product);

                    // مجموع المخزون لكل المتغيرات
                    const totalStock = product.variants.reduce(
                      (sum, v) => sum + v.stock,
                      0
                    );

                    return (
                      <tr
                        key={product.id}
                        className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition"
                      >
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <img
                              src={
                                product.images.find((img) => img.isPrimary)
                                  ?.url || "/images/placeholder.png"
                              }
                              alt={product.title}
                              className="w-10 h-10 object-cover rounded-lg"
                              loading="lazy"
                            />
                            <span className="text-gray-900 dark:text-white font-medium line-clamp-1">
                              {product.title}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-gray-900 dark:text-white">
                          {hasDiscount ? (
                            <div className="flex flex-col">
                              <span className="text-red-600 font-bold">
                                {formatCurrency(discountedPrice)}
                              </span>
                              <span className="text-xs text-gray-400 line-through">
                                {formatCurrency(originalPrice)}
                              </span>
                            </div>
                          ) : (
                            <span>{formatCurrency(originalPrice)}</span>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          {hasDiscount ? (
                            <span className="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300">
                              {discountPercent}%
                            </span>
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-gray-500 dark:text-gray-400">
                          {product.category?.name || t("admin.uncategorized")}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-gray-900 dark:text-white">
                              {totalStock}
                            </span>
                            {product.variants.length === 1 && (
                              <button
                                onClick={() =>
                                  handleReplenish(
                                    product.variants[0].id,
                                    product.title
                                  )
                                }
                                disabled={replenishStock.isPending}
                                className="p-1 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition disabled:opacity-50"
                                title={t("admin.replenish")}
                              >
                                <RefreshCw className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`px-2 py-1 text-xs font-medium rounded-full ${
                              product.isPublished
                                ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                                : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
                            }`}
                          >
                            {product.isPublished
                              ? t("product.published")
                              : t("product.unpublished")}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <Link
                              to={`/product/${product.slug}`}
                              target="_blank"
                              className="p-1 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition"
                              title={t("common.view")}
                            >
                              <Eye className="w-4 h-4" />
                            </Link>
                            <Link
                              to={ROUTES.ADMIN_PRODUCT_EDIT(product.slug)}
                              className="p-1 text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300 rounded-lg hover:bg-green-50 dark:hover:bg-green-900/20 transition"
                              title={t("common.edit")}
                            >
                              <Edit className="w-4 h-4" />
                            </Link>
                            <button
                              onClick={() =>
                                handleDelete(product.id, product.title)
                              }
                              disabled={deleteProduct.isPending}
                              className="p-1 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition disabled:opacity-50"
                              title={t("common.delete")}
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </motion.div>
    </PageContainer>
  );
};
