// src/pages/admin/AdminCouponsPage.tsx

import { motion } from "framer-motion";
import { DollarSign, Edit, Percent, Plus, Tag, Trash2 } from "lucide-react";
import { useCallback, useState } from "react";
import { toast } from "sonner";
import { PageContainer } from "../../components/layout/PageContainer";
import { Seo } from "../../components/seo/Seo";
import { CouponModal } from "../../features/coupons/components/CouponModal";
import {
  useAllCoupons,
  useDeleteCoupon,
} from "../../features/coupons/hooks/useCoupons";
import type { Coupon } from "../../features/coupons/types/coupon.types";
import { formatCurrency } from "../../utils/currency";
import { formatDate } from "../../utils/date";
import { isEmpty } from "../../utils/helpers";

export const AdminCouponsPage = () => {
  const { data: couponsData, isLoading, refetch } = useAllCoupons();
  const deleteCoupon = useDeleteCoupon();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const coupons = couponsData?.data || [];

  // ✅ حذف كوبون
  const handleDelete = useCallback(
    async (id: string, code: string) => {
      if (!window.confirm(`هل أنت متأكد من حذف الكوبون "${code}"؟`)) return;
      setDeletingId(id);
      try {
        await deleteCoupon.mutateAsync(id);
        toast.success(`تم حذف الكوبون "${code}" بنجاح`);
        refetch();
      } catch (error: any) {
        toast.error(
          error?.response?.data?.message ||
            error?.message ||
            "حدث خطأ أثناء الحذف"
        );
      } finally {
        setDeletingId(null);
      }
    },
    [deleteCoupon, refetch]
  );

  // ✅ دوال مساعدة للعرض
  const getStatusBadge = useCallback((coupon: Coupon) => {
    const now = new Date();
    const expiresAt = new Date(coupon.expiresAt);
    const isExpired = expiresAt < now;

    if (!coupon.isActive) {
      return (
        <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
          غير نشط
        </span>
      );
    }
    if (isExpired) {
      return (
        <span className="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300">
          منتهي
        </span>
      );
    }
    return (
      <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
        نشط
      </span>
    );
  }, []);

  const getDiscountLabel = useCallback((coupon: Coupon) => {
    const value = Number(coupon.discountValue);
    if (coupon.discountType === "PERCENTAGE") {
      return `${value}%`;
    }
    return formatCurrency(value);
  }, []);

  return (
    <PageContainer>
      <Seo
        title="إدارة الكوبونات - ProStore Admin"
        description="إدارة كوبونات الخصم في المتجر"
      />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Tag className="w-6 h-6" />
            إدارة الكوبونات
          </h1>
          <button
            onClick={() => {
              setEditingCoupon(null);
              setModalOpen(true);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition"
          >
            <Plus className="w-4 h-4" />
            إضافة كوبون
          </button>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : isEmpty(coupons) ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🏷️</div>
            <h2 className="text-xl font-medium text-gray-700 dark:text-gray-300 mb-2">
              لا توجد كوبونات
            </h2>
            <p className="text-gray-500 dark:text-gray-400">
              أضف كوبوناً جديداً لبدء تقديم الخصومات لعملائك
            </p>
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 dark:bg-gray-700/50">
                  <tr>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      الرمز
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      الخصم
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      الحد الأدنى
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      الاستخدامات
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      الصلاحية
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      الحالة
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      الإجراءات
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {coupons.map((coupon: Coupon) => (
                    <tr
                      key={coupon.id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition"
                    >
                      <td className="px-4 py-3 font-mono text-sm font-bold text-gray-900 dark:text-white">
                        {coupon.code}
                      </td>
                      <td className="px-4 py-3 text-gray-900 dark:text-white">
                        <span className="flex items-center gap-1">
                          {coupon.discountType === "PERCENTAGE" ? (
                            <Percent className="w-3 h-3 text-blue-500" />
                          ) : (
                            <DollarSign className="w-3 h-3 text-green-500" />
                          )}
                          {getDiscountLabel(coupon)}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-500 dark:text-gray-400">
                        {coupon.minOrderValue
                          ? formatCurrency(coupon.minOrderValue)
                          : "بدون حد"}
                      </td>
                      <td className="px-4 py-3 text-gray-500 dark:text-gray-400">
                        {coupon.usedCount}
                        {coupon.usageLimit && ` / ${coupon.usageLimit}`}
                      </td>
                      <td className="px-4 py-3 text-gray-500 dark:text-gray-400 text-xs">
                        <div>
                          {formatDate(coupon.startsAt)}
                          <br />
                          <span className="text-gray-400">→</span>
                          {formatDate(coupon.expiresAt)}
                        </div>
                      </td>
                      <td className="px-4 py-3">{getStatusBadge(coupon)}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              setEditingCoupon(coupon);
                              setModalOpen(true);
                            }}
                            className="p-1.5 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition"
                            title="تعديل"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(coupon.id, coupon.code)}
                            disabled={deletingId === coupon.id}
                            className="p-1.5 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition disabled:opacity-50"
                            title="حذف"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
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

      {/* مودال الإضافة/التعديل */}
      <CouponModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditingCoupon(null);
        }}
        onSuccess={refetch}
        editingCoupon={editingCoupon}
      />
    </PageContainer>
  );
};
