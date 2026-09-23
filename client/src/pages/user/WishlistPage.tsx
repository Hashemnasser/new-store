// // src/pages/user/WishlistPage.tsx

// import { AnimatePresence, motion } from "framer-motion";
// import { Heart, ShoppingCart, Trash2 } from "lucide-react";
// import { useCallback } from "react";
// import { Link } from "react-router-dom";
// import { toast } from "sonner";
// import { ROUTES } from "../../app/router/route.constants";
// import { PageContainer } from "../../components/layout/PageContainer";
// import { useCart } from "../../features/cart/hooks/useCart";
// import { useWishlist } from "../../features/wishlist/hooks/useWishlist";
// import type { WishlistItem } from "../../features/wishlist/types/wishlist.types";
// import { formatCurrency } from "../../utils/currency";
// import { isEmpty } from "../../utils/helpers";

// export const WishlistPage = () => {
//   const {
//     items,
//     isLoading,
//     removeFromWishlist,
//     clearWishlist,
//     isRemoving,
//     isClearing,
//   } = useWishlist();
//   const { addToCart } = useCart();

//   // ✅ تحويل النوع بأمان
//   const wishlistItems: WishlistItem[] = items;
//   console.log("wishlistItems55555555555555555:::", wishlistItems);
//   const handleAddToCart = useCallback(
//     (productId: string) => {
//       const item = wishlistItems.find((i) => i.productId === productId);
//       if (!item) return;

//       const variantId = item.product.variants[0]?.id;
//       if (!variantId) {
//         toast.error("هذا المنتج لا يحتوي على متغيرات متاحة");
//         return;
//       }

//       addToCart({
//         productId: productId,
//         variantId: variantId,
//         quantity: 1,
//       });
//     },
//     [addToCart, wishlistItems]
//   );

//   if (isLoading) {
//     return (
//       <PageContainer>
//         <div className="flex items-center justify-center min-h-[60vh]">
//           <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
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
//           <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
//             <Heart className="w-6 h-6 text-red-500" />
//             قائمة الرغبات
//           </h1>
//         </div>

//         {isEmpty(wishlistItems) ? (
//           <div className="text-center py-12">
//             <div className="text-6xl mb-4">❤️</div>
//             <h2 className="text-xl font-medium text-gray-700 dark:text-gray-300 mb-2">
//               قائمة الرغبات فارغة
//             </h2>
//             <p className="text-gray-500 dark:text-gray-400 mb-6">
//               أضف المنتجات التي تعجبك إلى قائمة الرغبات
//             </p>
//             <Link
//               to={ROUTES.PRODUCTS}
//               className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-lg transition"
//             >
//               استكشف المنتجات
//             </Link>
//           </div>
//         ) : (
//           <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
//             <AnimatePresence mode="popLayout">
//               {wishlistItems.map((item) => (
//                 <motion.div
//                   key={item.id}
//                   layout
//                   initial={{ opacity: 0, scale: 0.9 }}
//                   animate={{ opacity: 1, scale: 1 }}
//                   exit={{ opacity: 0, scale: 0.8 }}
//                   transition={{ duration: 0.3 }}
//                   className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden group"
//                 >
//                   <Link
//                     to={`/product/${item.product.slug}`}
//                     className="block relative aspect-square overflow-hidden bg-gray-100 dark:bg-gray-700"
//                   >
//                     <img
//                       src={
//                         item.product.images[0]?.url || "/images/placeholder.png"
//                       }
//                       alt={item.product.title}
//                       className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
//                       loading="lazy"
//                     />
//                     <button
//                       onClick={(e) => {
//                         e.preventDefault();
//                         removeFromWishlist(item.productId);
//                       }}
//                       disabled={isRemoving}
//                       className="absolute top-2 right-2 p-1 bg-white/90 dark:bg-gray-800/90 rounded-full shadow-md hover:scale-110 transition disabled:opacity-50"
//                     >
//                       <Trash2 className="w-3 h-3  fill-red-200 text-red-400" />
//                     </button>
//                   </Link>

//                   <div className="p-4">
//                     <Link to={`/product/${item.product.slug}`}>
//                       <h3 className="text-sm font-semibold text-gray-800 dark:text-white line-clamp-2 hover:text-blue-600 transition">
//                         {item.product.title}
//                       </h3>
//                     </Link>

//                     <div className="mt-2 flex items-center justify-between">
//                       <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
//                         {formatCurrency(item.product.variants[0].price)}
//                       </span>
//                       <button
//                         onClick={() => handleAddToCart(item.productId)}
//                         className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
//                       >
//                         <ShoppingCart className="w-4 h-4" />
//                       </button>
//                     </div>
//                   </div>
//                 </motion.div>
//               ))}
//             </AnimatePresence>
//           </div>
//         )}
//         <div className=" flex justify-end  mt-7">
//           {!isEmpty(wishlistItems) && (
//             <button
//               onClick={() => clearWishlist()}
//               disabled={isClearing}
//               className="text-sm text-red-700 hover:text-red-700 font-medium border rounded-lg p-2 bg-red-200  flex items-center gap-1 disabled:opacity-50"
//             >
//               <Trash2 className="w-4 h-4" />
//               {isClearing ? "جاري التفريغ..." : "تفريغ الكل"}
//             </button>
//           )}
//         </div>
//       </motion.div>
//     </PageContainer>
//   );
// };

// src/pages/user/WishlistPage.tsx
import { AnimatePresence, motion } from "framer-motion";
import { Heart, ShoppingCart, Trash2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { ROUTES } from "../../app/router/route.constants";
import { PageContainer } from "../../components/layout/PageContainer";
import { useCart } from "../../features/cart/hooks/useCart";
import { useWishlist } from "../../features/wishlist/hooks/useWishlist";
import type { WishlistItem } from "../../features/wishlist/types/wishlist.types";
import { formatCurrency } from "../../utils/currency";
import { isEmpty } from "../../utils/helpers";

export const WishlistPage = () => {
  const { t } = useTranslation();
  const {
    items,
    isLoading,
    removeFromWishlist,
    clearWishlist,
    isRemoving,
    isClearing,
  } = useWishlist();
  const { addToCart } = useCart();

  const wishlistItems = items as WishlistItem[];

  const handleAddToCart = (productId: string) => {
    const item = wishlistItems.find((i) => i.productId === productId);
    if (!item) return;

    const variantId = item.product.variants[0]?.id;
    if (!variantId) {
      toast.error(t("product.outOfStock"));
      return;
    }

    addToCart({
      productId: productId,
      variantId: variantId,
      quantity: 1,
    });
  };

  if (isLoading) {
    return (
      <PageContainer>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
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
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Heart className="w-6 h-6 text-red-500" />
            {t("wishlist.title")}
          </h1>
        </div>

        {isEmpty(wishlistItems) ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">❤️</div>
            <h2 className="text-xl font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t("wishlist.empty")}
            </h2>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              {t("wishlist.empty")}
            </p>
            <Link
              to={ROUTES.PRODUCTS}
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-lg transition"
            >
              {t("cart.backToShop")}
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            <AnimatePresence mode="popLayout">
              {wishlistItems.map((item) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden group"
                >
                  <Link
                    to={`/product/${item.product.slug}`}
                    className="block relative aspect-square overflow-hidden bg-gray-100 dark:bg-gray-700"
                  >
                    <img
                      src={
                        item.product.images[0]?.url || "/images/placeholder.png"
                      }
                      alt={item.product.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        removeFromWishlist(item.productId);
                      }}
                      disabled={isRemoving}
                      className="absolute top-2 right-2 p-1 bg-white/90 dark:bg-gray-800/90 rounded-full shadow-md hover:scale-110 transition disabled:opacity-50"
                    >
                      <Trash2 className="w-3 h-3 fill-red-200 text-red-400" />
                    </button>
                  </Link>

                  <div className="p-4">
                    <Link to={`/product/${item.product.slug}`}>
                      <h3 className="text-sm font-semibold text-gray-800 dark:text-white line-clamp-2 hover:text-blue-600 transition">
                        {item.product.title}
                      </h3>
                    </Link>

                    <div className="mt-2 flex items-center justify-between">
                      <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
                        {formatCurrency(item.product.variants[0].price)}
                      </span>
                      <button
                        onClick={() => handleAddToCart(item.productId)}
                        className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
                      >
                        <ShoppingCart className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
        <div className="flex justify-end mt-7">
          {!isEmpty(wishlistItems) && (
            <button
              onClick={() => clearWishlist()}
              disabled={isClearing}
              className="text-sm text-red-700 hover:text-red-700 font-medium border rounded-lg p-2 bg-red-200 flex items-center gap-1 disabled:opacity-50"
            >
              <Trash2 className="w-4 h-4" />
              {isClearing ? t("wishlist.clear") : t("wishlist.clear")}
            </button>
          )}
        </div>
      </motion.div>
    </PageContainer>
  );
};
