// // src/features/cart/components/CartItem.tsx

// import { motion } from "framer-motion";
// import { Minus, Plus, Trash2 } from "lucide-react";
// import { Link } from "react-router-dom";
// import type { CartItem as CartItemType } from "../types/cart.types";

// interface CartItemProps {
//   item: CartItemType;
//   onUpdateQuantity: (id: string, quantity: number) => void;
//   onRemove: (id: string) => void;
//   isUpdating?: boolean;
//   isRemoving?: boolean;
// }

// export const CartItem = ({
//   item,
//   onUpdateQuantity,
//   onRemove,
//   isUpdating = false,
//   isRemoving = false,
// }: CartItemProps) => {
//   const primaryImage =
//     item.product.images.find((img) => img.isPrimary)?.url ||
//     item.product.images[0]?.url;

//   return (
//     <motion.div
//       initial={{ opacity: 0, x: -20 }}
//       animate={{ opacity: 1, x: 0 }}
//       exit={{ opacity: 0, x: 20 }}
//       className="flex items-start gap-4 py-4 border-b "
//     >
//       {/* صورة المنتج */}
//       <Link
//         to={`/product/${item.product.slug}`}
//         className="shrink-0 w-20 h-20  rounded-lg overflow-hidden"
//       >
//         <img
//           src={primaryImage || "/images/placeholder.png"}
//           alt={item.product.title}
//           className="w-full h-full object-cover"
//           loading="lazy"
//         />
//       </Link>

//       {/* معلومات المنتج */}
//       <div className="flex-1 min-w-0">
//         <Link
//           to={`/product/${item.product.slug}`}
//           className="text-sm font-medium  hover:text-blue-600 transition line-clamp-2"
//         >
//           {item.product.title}
//         </Link>

//         {/* الخيارات (حجم، لون) */}
//         <div className="flex flex-wrap items-center gap-2 mt-1 text-xs text-gray-400 ">
//           {item.variant.color && <span>اللون: {item.variant.color}</span>}
//           {item.variant.size && <span>المقاس: {item.variant.size}</span>}
//           <span>SKU: {item.variant.sku}</span>
//         </div>

//         {/* السعر والكمية */}
//         <div className="flex items-center justify-between mt-2">
//           <div className="flex items-center gap-3">
//             {/* أزرار التحكم بالكمية */}
//             <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-lg">
//               <button
//                 onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
//                 disabled={isUpdating || item.quantity <= 1}
//                 className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 transition disabled:opacity-50"
//               >
//                 <Minus className="w-4 h-4" />
//               </button>
//               <span className="w-8 text-center text-sm font-medium">
//                 {isUpdating ? "..." : item.quantity}
//               </span>
//               <button
//                 onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
//                 disabled={isUpdating}
//                 className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 transition disabled:opacity-50"
//               >
//                 <Plus className="w-4 h-4" />
//               </button>
//             </div>

//             <span className="text-sm font-semibold ">
//               ${(item.variant.price * item.quantity).toFixed(2)}
//             </span>
//           </div>

//           {/* زر الحذف */}
//           <button
//             onClick={() => onRemove(item.id)}
//             disabled={isRemoving}
//             className="p-1 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition disabled:opacity-50"
//           >
//             <Trash2 className="w-4 h-4" />
//           </button>
//         </div>
//       </div>
//     </motion.div>
//   );
// };

// src/features/cart/components/CartItem.tsx
import { motion } from "framer-motion";
import { Minus, Plus, Trash2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import type { CartItem as CartItemType } from "../types/cart.types";

interface CartItemProps {
  item: CartItemType;
  onUpdateQuantity: (id: string, quantity: number) => void;
  onRemove: (id: string) => void;
  isUpdating?: boolean;
  isRemoving?: boolean;
}

export const CartItem = ({
  item,
  onUpdateQuantity,
  onRemove,
  isUpdating = false,
  isRemoving = false,
}: CartItemProps) => {
  const { t } = useTranslation();
  const primaryImage =
    item.product.images.find((img) => img.isPrimary)?.url ||
    item.product.images[0]?.url;

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="flex items-start gap-4 py-4 border-b border-gray-200 dark:border-gray-700"
    >
      <Link
        to={`/product/${item.product.slug}`}
        className="shrink-0 w-20 h-20 bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden"
      >
        <img
          src={primaryImage || "/images/placeholder.png"}
          alt={item.product.title}
          className="w-full h-full object-cover"
          loading="lazy"
        />
      </Link>

      <div className="flex-1 min-w-0">
        <Link
          to={`/product/${item.product.slug}`}
          className="text-sm font-medium text-gray-800 dark:text-white hover:text-blue-600 transition line-clamp-2"
        >
          {item.product.title}
        </Link>

        <div className="flex flex-wrap items-center gap-2 mt-1 text-xs text-gray-500 dark:text-gray-400">
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
          <span>SKU: {item.variant.sku}</span>
        </div>

        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center gap-3">
            <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-lg">
              <button
                onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                disabled={isUpdating || item.quantity <= 1}
                className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 transition disabled:opacity-50"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="w-8 text-center text-sm font-medium">
                {isUpdating ? "..." : item.quantity}
              </span>
              <button
                onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                disabled={isUpdating}
                className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 transition disabled:opacity-50"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            <span className="text-sm font-semibold text-gray-900 dark:text-white">
              ${(item.variant.price * item.quantity).toFixed(2)}
            </span>
          </div>

          <button
            onClick={() => onRemove(item.id)}
            disabled={isRemoving}
            className="p-1 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition disabled:opacity-50"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};
