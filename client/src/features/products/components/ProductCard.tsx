// // src/features/products/components/ProductCard.tsx

// import { motion } from "framer-motion";
// import { Heart, ShoppingCart, Star } from "lucide-react";
// import { Link } from "react-router-dom";
// import { formatCurrency } from "../../../utils/currency";
// import type { Product } from "../types/product.types";

// interface ProductCardProps {
//   product: Product;
//   onAddToCart?: (product: Product) => void;
//   onToggleWishlist?: (product: Product) => void;
//   isInWishlist?: boolean;
// }

// export const ProductCard = ({
//   product,
//   onAddToCart,
//   onToggleWishlist,
//   isInWishlist = false,
// }: ProductCardProps) => {
//   const primaryImage =
//     product.images.find((img) => img.isPrimary)?.url || product.images[0]?.url;

//   // السعر الأصلي (من أول متغير)
//   const rawPrice = product.variants[0]?.price ?? 0;
//   const originalPrice =
//     typeof rawPrice === "number" ? rawPrice : Number(rawPrice) || 0;

//   // نسبة التخفيض (من المنتج)
//   const discountPercent = product.discountPercent ?? 0;
//   const hasDiscount = discountPercent > 0;

//   // السعر بعد التخفيض
//   const discountedPrice = hasDiscount
//     ? originalPrice * (1 - discountPercent / 100)
//     : originalPrice;

//   const hasMultipleVariants = product.variants.length > 1;

//   return (
//     <motion.div
//       initial={{ opacity: 0, y: 20 }}
//       animate={{ opacity: 1, y: 0 }}
//       whileHover={{ y: -4 }}
//       transition={{ duration: 0.3 }}
//       className="group bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-xl transition-shadow duration-300 overflow-hidden flex flex-col"
//     >
//       <Link
//         to={`/product/${product.slug}`}
//         className="relative overflow-hidden aspect-square bg-gray-100 dark:bg-gray-700"
//       >
//         <img
//           src={primaryImage || "/images/placeholder.png"}
//           alt={product.title}
//           className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
//           loading="lazy"
//         />

//         {onToggleWishlist && (
//           <button
//             onClick={(e) => {
//               e.preventDefault();
//               onToggleWishlist(product);
//             }}
//             className="absolute top-3 right-3 p-2 bg-white/90 dark:bg-gray-800/90 rounded-full shadow-md hover:scale-110 transition"
//             aria-label="Add to wishlist"
//           >
//             <Heart
//               className={`w-5 h-5 transition ${
//                 isInWishlist
//                   ? "fill-red-500 text-red-500"
//                   : "text-gray-600 dark:text-gray-300"
//               }`}
//             />
//           </button>
//         )}

//         {product.featured && (
//           <span className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
//             مميز
//           </span>
//         )}

//         {hasDiscount && (
//           <span className="absolute top-3 left-3 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-full">
//             خصم {discountPercent}%
//           </span>
//         )}
//       </Link>

//       <div className="p-4 flex flex-col flex-1">
//         <Link to={`/product/${product.slug}`} className="flex-1">
//           <h3 className="text-sm sm:text-base font-semibold text-gray-800 dark:text-white line-clamp-2 hover:text-blue-600 transition">
//             {product.title}
//           </h3>
//         </Link>

//         <div className="flex items-center gap-1 mt-1">
//           <div className="flex items-center">
//             {[...Array(5)].map((_, i) => (
//               <Star
//                 key={i}
//                 className={`w-4 h-4 ${
//                   i < Math.round(product.averageRating)
//                     ? "fill-yellow-400 text-yellow-400"
//                     : "text-gray-300 dark:text-gray-600"
//                 }`}
//               />
//             ))}
//           </div>
//           <span className="text-xs text-gray-500 dark:text-gray-400">
//             ({product.reviewsCount})
//           </span>
//         </div>

//         <div className="mt-2 flex items-center justify-between">
//           <div className="flex items-baseline gap-2">
//             {hasDiscount ? (
//               <>
//                 <span className="text-lg font-bold text-red-600 dark:text-red-400">
//                   {formatCurrency(discountedPrice)}
//                 </span>
//                 <span className="text-sm text-gray-400 line-through">
//                   {formatCurrency(originalPrice)}
//                 </span>
//               </>
//             ) : (
//               <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
//                 {formatCurrency(originalPrice)}
//               </span>
//             )}
//             {hasMultipleVariants && (
//               <span className="text-xs text-gray-500">
//                 +{product.variants.length - 1} أكثر
//               </span>
//             )}
//           </div>
//         </div>

//         {onAddToCart && (
//           <button
//             onClick={() => onAddToCart(product)}
//             className="mt-3 w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2.5 rounded-lg transition"
//           >
//             <ShoppingCart className="w-4 h-4" />
//             <span>أضف إلى السلة</span>
//           </button>
//         )}
//       </div>
//     </motion.div>
//   );
// };
// src/features/products/components/ProductCard.tsx

import { motion } from "framer-motion";
import { Heart, ShoppingCart, Star } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { formatCurrency } from "../../../utils/currency";
import type { Product } from "../types/product.types";

interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product) => void;
  onToggleWishlist?: (product: Product) => void;
  isInWishlist?: boolean;
}

export const ProductCard = ({
  product,
  onAddToCart,
  onToggleWishlist,
  isInWishlist = false,
}: ProductCardProps) => {
  const { t } = useTranslation();
  const primaryImage =
    product.images.find((img) => img.isPrimary)?.url || product.images[0]?.url;

  const rawPrice = product.variants[0]?.price ?? 0;
  const originalPrice =
    typeof rawPrice === "number" ? rawPrice : Number(rawPrice) || 0;

  const discountPercent = product.discountPercent ?? 0;
  const hasDiscount = discountPercent > 0;
  const discountedPrice = hasDiscount
    ? originalPrice * (1 - discountPercent / 100)
    : originalPrice;

  const hasMultipleVariants = product.variants.length > 1;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3 }}
      className="group bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-xl transition-shadow duration-300 overflow-hidden flex flex-col"
    >
      <Link
        to={`/product/${product.slug}`}
        className="relative overflow-hidden aspect-square bg-gray-100 dark:bg-gray-700"
      >
        <img
          src={primaryImage || "/images/placeholder.png"}
          alt={product.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {onToggleWishlist && (
          <button
            onClick={(e) => {
              e.preventDefault();
              onToggleWishlist(product);
            }}
            className="absolute top-3 right-3 p-2 bg-white/90 dark:bg-gray-800/90 rounded-full shadow-md hover:scale-110 transition"
            aria-label={t("wishlist.add")}
          >
            <Heart
              className={`w-5 h-5 transition ${
                isInWishlist
                  ? "fill-red-500 text-red-500"
                  : "text-gray-600 dark:text-gray-300"
              }`}
            />
          </button>
        )}

        {product.featured && (
          <span className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
            {t("common.featured")}
          </span>
        )}

        {hasDiscount && (
          <span className="absolute top-3 left-3 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-full">
            {t("product.discountPercent")} {discountPercent}%
          </span>
        )}
      </Link>

      <div className="p-4 flex flex-col flex-1">
        <Link to={`/product/${product.slug}`} className="flex-1">
          <h3 className="text-sm sm:text-base font-semibold text-gray-800 dark:text-white line-clamp-2 hover:text-blue-600 transition">
            {product.title}
          </h3>
        </Link>

        <div className="flex items-center gap-1 mt-1">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${
                  i < Math.round(product.averageRating)
                    ? "fill-yellow-400 text-yellow-400"
                    : "text-gray-300 dark:text-gray-600"
                }`}
              />
            ))}
          </div>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            ({product.reviewsCount})
          </span>
        </div>

        <div className="mt-2 flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            {hasDiscount ? (
              <>
                <span className="text-lg font-bold text-red-600 dark:text-red-400">
                  {formatCurrency(discountedPrice)}
                </span>
                <span className="text-sm text-gray-400 line-through">
                  {formatCurrency(originalPrice)}
                </span>
              </>
            ) : (
              <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
                {formatCurrency(originalPrice)}
              </span>
            )}
            {hasMultipleVariants && (
              <span className="text-xs text-gray-500">
                +{product.variants.length - 1} {t("product.variants")}
              </span>
            )}
          </div>
        </div>

        {onAddToCart && (
          <button
            onClick={() => onAddToCart(product)}
            className="mt-3 w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2.5 rounded-lg transition"
          >
            <ShoppingCart className="w-4 h-4" />
            <span>{t("common.addToCart")}</span>
          </button>
        )}
      </div>
    </motion.div>
  );
};
