// client/src/pages/user/OrderDetailsPage.tsx

import { motion } from "framer-motion";
import { ArrowLeft, Calendar, RefreshCw, Truck } from "lucide-react";
import { useCallback, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { PageContainer } from "../../components/layout/PageContainer";
import { useCart } from "../../features/cart/hooks/useCart";
import { useOrder } from "../../features/orders/hooks/useOrders";
import { Order } from "../../features/orders/types/order.types";
import { formatCurrency } from "../../utils/currency";
import { formatDate } from "../../utils/date";
import { cn } from "../../utils/helpers";

const statusColors = {
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
  PENDING: "قيد الانتظار",
  PROCESSING: "قيد المعالجة",
  SHIPPED: "تم الشحن",
  DELIVERED: "تم التوصيل",
  CANCELLED: "ملغي",
};

export const OrderDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data, isLoading, error } = useOrder(id!);
  const { addToCart } = useCart();
  const [isReordering, setIsReordering] = useState(false);
  const order: Order = data ?? {};
  // دالة إعادة الطلب
  const handleReorder = useCallback(async () => {
    if (!order) return;
    setIsReordering(true);

    let addedCount = 0;
    const failedItems: string[] = [];

    for (const item of order.items) {
      try {
        await addToCart({
          productId: item.variant.product.id,
          variantId: item.variantId,
          quantity: item.quantity,
        });
        addedCount++;
      } catch (error: any) {
        failedItems.push(item.variant.product.title);
        console.error(`❌ Failed to add ${item.variant.product.title}:`, error);
      }
    }

    setIsReordering(false);

    if (failedItems.length === 0) {
      toast.success(`تم إضافة جميع المنتجات (${addedCount}) إلى السلة`);
    } else if (addedCount === 0) {
      toast.error("تعذر إضافة أي منتج. قد تكون بعض المنتجات غير متوفرة.");
    } else {
      toast.warning(
        `تم إضافة ${addedCount} منتج، ولكن تعذر إضافة: ${failedItems.join(
          "، "
        )}`
      );
    }
  }, [order, addToCart]);
  // حالات التحميل والخطأ
  if (isLoading) {
    return (
      <PageContainer>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
        </div>
      </PageContainer>
    );
  }

  if (error || !order) {
    return (
      <PageContainer>
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-700 dark:text-gray-300">
            الطلب غير موجود
          </h2>
          <button
            onClick={() => navigate("/orders")}
            className="text-blue-600 hover:underline mt-4"
          >
            العودة إلى الطلبات
          </button>
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
        {/* رأس الصفحة مع زر إعادة الطلب */}
        <div className="flex items-center gap-4 my-4">
          <button
            onClick={() => navigate("/orders")}
            className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex-1">
            تفاصيل الطلب #{order.id.slice(0, 8)}
          </h1>
          <button
            onClick={handleReorder}
            disabled={isReordering}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition disabled:opacity-50"
          >
            <RefreshCw
              className={cn("w-4 h-4", isReordering && "animate-spin")}
            />
            {isReordering ? "جاري الإضافة..." : "إعادة الطلب"}
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* العمود الأيسر: معلومات الطلب الأساسية */}
          <div className="lg:col-span-2 space-y-6">
            {/* بطاقة الحالة والتواريخ */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <span
                    className={cn(
                      "px-3 py-1 text-sm font-medium rounded-full",
                      statusColors[order.status]
                    )}
                  >
                    {statusLabels[order.status]}
                  </span>
                  <span className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {formatDate(order.createdAt)}
                  </span>
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  <span className="font-medium">إجمالي الطلب:</span>{" "}
                  <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
                    {formatCurrency(order.totalAmount)}
                  </span>
                </div>
              </div>
            </div>

            {/* قائمة المنتجات */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                المنتجات
              </h3>
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {order.items.map((item) => (
                  <div
                    key={item.id}
                    className="py-4 flex flex-col sm:flex-row sm:items-center gap-4"
                  >
                    <div className="flex items-center gap-3 flex-1">
                      <img
                        src={
                          item.variant.product.images.find(
                            (img) => img.isPrimary
                          )?.url || "/images/placeholder.png"
                        }
                        alt={item.variant.product.title}
                        className="w-16 h-16 object-cover rounded-lg bg-gray-100 dark:bg-gray-700 shrink-0"
                        loading="lazy"
                      />
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {item.variant.product.title}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {item.variant.color &&
                            `اللون: ${item.variant.color} | `}
                          {item.variant.size &&
                            `المقاس: ${item.variant.size} | `}
                          الكمية: {item.quantity}
                        </p>
                      </div>
                    </div>
                    <div className="text-left sm:text-right">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {formatCurrency(item.price)}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        الإجمالي: {formatCurrency(item.price * item.quantity)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* العمود الأيمن: عنوان الشحن */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 sticky top-24">
              <div className="flex items-center gap-2 mb-4">
                <Truck className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  عنوان الشحن
                </h3>
              </div>
              <div className="space-y-1 text-sm text-gray-600 dark:text-gray-300">
                <p>{order.shippingAddress.street}</p>
                <p>{order.shippingAddress.city}</p>
                <p>{order.shippingAddress.postalCode}</p>
                <p>{order.shippingAddress.country}</p>
              </div>

              {/* إظهار معرف الدفع إن وجد */}
              {order.stripePaymentIntentId && (
                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    معرف الدفع:{" "}
                    <span className="font-mono">
                      {order.stripePaymentIntentId}
                    </span>
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </PageContainer>
  );
};
