// // src/pages/cart/CartPage.tsx

// import { AnimatePresence, motion } from "framer-motion";
// import { ArrowLeft, ShoppingCart } from "lucide-react";
// import { Link } from "react-router-dom";
// import { ROUTES } from "../../app/router/route.constants";
// import { PageContainer } from "../../components/layout/PageContainer";
// import { CartItem } from "../../features/cart/components/CartItem";
// import { CartSummary } from "../../features/cart/components/CartSummary";
// import { useCart } from "../../features/cart/hooks/useCart";
// import { isEmpty } from "../../utils/helpers";

// export const CartPage = () => {
//   const {
//     items,
//     total,
//     itemCount,
//     isLoading,
//     updateCartItem,
//     removeFromCart,
//     clearCart,
//     isUpdating,
//     isRemoving,
//     isClearing,
//   } = useCart();

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
//         {/* العنوان */}
//         <div className="flex items-center justify-between mb-6">
//           <h1 className="text-2xl font-bold  flex items-center gap-2">
//             <ShoppingCart className="w-6 h-6" />
//             سلة التسوق
//           </h1>
//           <Link
//             to={ROUTES.PRODUCTS}
//             className="text-sm text-gray-400 hover:text-blue-600 transition flex items-center gap-1"
//           >
//             <ArrowLeft className="w-4 h-4" />
//             العودة للتسوق
//           </Link>
//         </div>

//         {/* محتوى السلة */}
//         {isEmpty(items) ? (
//           <div className="text-center py-12">
//             <div className="text-6xl mb-4">🛒</div>
//             <h2 className="text-xl font-medium  mb-2">سلة التسوق فارغة</h2>
//             <p className="text-gray-400  mb-6">لم تقم بإضافة أي منتجات بعد</p>
//             <Link
//               to={ROUTES.PRODUCTS}
//               className="inline-block bg-blue-600 hover:bg-blue-700 text-amber-50  font-medium px-6 py-3 rounded-lg transition"
//             >
//               استمر بالتسوق
//             </Link>
//           </div>
//         ) : (
//           <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//             {/* قائمة العناصر */}
//             <div className="lg:col-span-2">
//               <AnimatePresence mode="popLayout">
//                 {items.map((item) => (
//                   <CartItem
//                     key={item.id}
//                     item={item}
//                     onUpdateQuantity={(id, quantity) =>
//                       updateCartItem({ id, quantity })
//                     }
//                     onRemove={removeFromCart}
//                     isUpdating={isUpdating}
//                     isRemoving={isRemoving}
//                   />
//                 ))}
//               </AnimatePresence>
//             </div>

//             {/* الملخص */}
//             <div className="lg:col-span-1">
//               <CartSummary
//                 total={total}
//                 itemCount={itemCount}
//                 onClearCart={clearCart}
//                 isClearing={isClearing}
//               />
//             </div>
//           </div>
//         )}
//       </motion.div>
//     </PageContainer>
//   );
// };

// src/pages/cart/CartPage.tsx
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ShoppingCart } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { ROUTES } from "../../app/router/route.constants";
import { PageContainer } from "../../components/layout/PageContainer";
import { CartItem } from "../../features/cart/components/CartItem";
import { CartSummary } from "../../features/cart/components/CartSummary";
import { useCart } from "../../features/cart/hooks/useCart";
import { isEmpty } from "../../utils/helpers";

export const CartPage = () => {
  const { t } = useTranslation();
  const {
    items,
    total,
    itemCount,
    isLoading,
    updateCartItem,
    removeFromCart,
    clearCart,
    isUpdating,
    isRemoving,
    isClearing,
  } = useCart();

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
            <ShoppingCart className="w-6 h-6" />
            {t("cart.title")}
          </h1>
          <Link
            to={ROUTES.PRODUCTS}
            className="text-sm text-gray-500 hover:text-blue-600 transition flex items-center gap-1"
          >
            <ArrowLeft className="w-4 h-4" />
            {t("cart.backToShop")}
          </Link>
        </div>

        {isEmpty(items) ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🛒</div>
            <h2 className="text-xl font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t("cart.empty")}
            </h2>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              {t("cart.empty")}
            </p>
            <Link
              to={ROUTES.PRODUCTS}
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-lg transition"
            >
              {t("cart.backToShop")}
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <AnimatePresence mode="popLayout">
                {items.map((item) => (
                  <CartItem
                    key={item.id}
                    item={item}
                    onUpdateQuantity={(id, quantity) =>
                      updateCartItem({ id, quantity })
                    }
                    onRemove={removeFromCart}
                    isUpdating={isUpdating}
                    isRemoving={isRemoving}
                  />
                ))}
              </AnimatePresence>
            </div>
            <div className="lg:col-span-1">
              <CartSummary
                total={total}
                itemCount={itemCount}
                onClearCart={clearCart}
                isClearing={isClearing}
              />
            </div>
          </div>
        )}
      </motion.div>
    </PageContainer>
  );
};
