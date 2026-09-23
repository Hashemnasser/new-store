// src/features/coupons/components/CouponModal.tsx

import { zodResolver } from "@hookform/resolvers/zod";
import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "../../../components/ui/Button";
import { useCreateCoupon, useUpdateCoupon } from "../hooks/useCoupons";
import type { Coupon } from "../types/coupon.types";

// ============================================================
// 📋 مخطط التحقق (Zod Schema) مع preprocess
// ============================================================

// دالة مساعدة لتحويل النص إلى رقم (للحقول الاختيارية)
const numberFromString = z.preprocess((val) => {
  if (val === "" || val === null || val === undefined) return undefined;
  const num = Number(val);
  return isNaN(num) ? undefined : num;
}, z.number().min(0));

// دالة مساعدة للقيم الإجبارية (مثل discountValue)
const requiredNumber = z.preprocess((val) => {
  const num = Number(val);
  return isNaN(num) ? 0 : num;
}, z.number().positive("يجب أن تكون القيمة أكبر من 0"));

const couponSchema = z
  .object({
    code: z
      .string()
      .min(2, "الرمز يجب أن يكون حرفين على الأقل")
      .max(20, "الرمز طويل جداً")
      .regex(
        /^[A-Z0-9]+$/,
        "الرمز يجب أن يحتوي على أحرف وأرقام فقط (بدون مسافات)"
      )
      .transform((val) => val.toUpperCase().trim()),
    description: z.string().optional(),
    discountType: z.enum(["PERCENTAGE", "FIXED"]),
    discountValue: requiredNumber,
    minOrderValue: numberFromString.optional(),
    maxDiscount: numberFromString.optional(),
    startsAt: z.string().min(1, "تاريخ البدء مطلوب"),
    expiresAt: z.string().min(1, "تاريخ الانتهاء مطلوب"),
    usageLimit: z.preprocess(
      (val) => (val === "" ? undefined : Number(val)),
      z.number().int().min(1).optional()
    ),
    isActive: z.boolean().default(true),
  })
  .refine((data) => new Date(data.startsAt) < new Date(data.expiresAt), {
    message: "تاريخ البدء يجب أن يكون قبل تاريخ الانتهاء",
    path: ["expiresAt"],
  });

// ✅ فصل النوعين: الإدخال (ما يملأه المستخدم) والإخراج (ما يصل بعد المعالجة)
type CouponFormInput = z.input<typeof couponSchema>;
type CouponFormOutput = z.output<typeof couponSchema>;

// ============================================================
// 🧩 مكون المودال
// ============================================================

interface CouponModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  editingCoupon?: Coupon | null;
}

export const CouponModal = ({
  isOpen,
  onClose,
  onSuccess,
  editingCoupon,
}: CouponModalProps) => {
  const isEditing = !!editingCoupon;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const createCoupon = useCreateCoupon();
  const updateCoupon = useUpdateCoupon();

  // ✅ دالة الحصول على القيم الافتراضية - من نوع الإدخال (CouponFormInput)
  const getDefaultValues = (): CouponFormInput => {
    if (editingCoupon) {
      return {
        code: editingCoupon.code || "",
        description: editingCoupon.description || "",
        discountType: editingCoupon.discountType || "PERCENTAGE",
        discountValue: Number(editingCoupon.discountValue),
        minOrderValue:
          editingCoupon.minOrderValue !== null &&
          editingCoupon.minOrderValue !== undefined
            ? Number(editingCoupon.minOrderValue)
            : undefined,
        maxDiscount:
          editingCoupon.maxDiscount !== null &&
          editingCoupon.maxDiscount !== undefined
            ? Number(editingCoupon.maxDiscount)
            : undefined,
        startsAt: editingCoupon.startsAt
          ? new Date(editingCoupon.startsAt).toISOString().split("T")[0]
          : new Date().toISOString().split("T")[0],
        expiresAt: editingCoupon.expiresAt
          ? new Date(editingCoupon.expiresAt).toISOString().split("T")[0]
          : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
              .toISOString()
              .split("T")[0],
        usageLimit: editingCoupon.usageLimit ?? undefined,
        isActive: editingCoupon.isActive ?? true,
      };
    }

    return {
      code: "",
      description: "",
      discountType: "PERCENTAGE",
      discountValue: 0,
      minOrderValue: undefined,
      maxDiscount: undefined,
      startsAt: new Date().toISOString().split("T")[0],
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0],
      usageLimit: undefined,
      isActive: true,
    };
  };

  // ✅ useForm مع ثلاثة أنواع: إدخال، سياق (any)، إخراج
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<CouponFormInput, any, CouponFormOutput>({
    resolver: zodResolver(couponSchema),
    defaultValues: getDefaultValues(),
  });

  const discountType = watch("discountType");

  // ✅ إعادة تعيين النموذج عند تغيير editingCoupon
  useEffect(() => {
    reset(getDefaultValues());
  }, [editingCoupon, reset]);

  // ✅ دالة الإرسال - تستقبل بيانات من نوع الإخراج (CouponFormOutput)
  const onSubmit = async (data: CouponFormOutput) => {
    setIsSubmitting(true);
    try {
      // تجهيز الـ payload المطلوب للـ API
      const payload = {
        ...data,

        startsAt: new Date(data.startsAt),
        expiresAt: new Date(data.expiresAt),
        minOrderValue: data?.minOrderValue ?? undefined,
        maxDiscount: data?.maxDiscount ?? undefined,
        usageLimit: data?.usageLimit ?? undefined,
      };

      if (isEditing) {
        await updateCoupon.mutateAsync({
          id: editingCoupon!.id,
          data: payload,
        });
      } else {
        await createCoupon.mutateAsync(payload);
      }

      onSuccess();
      onClose();
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "حدث خطأ أثناء حفظ الكوبون"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {isEditing ? "تعديل الكوبون" : "إضافة كوبون جديد"}
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition"
          >
            <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* رمز الكوبون */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              رمز الكوبون *
            </label>
            <input
              {...register("code")}
              readOnly={isEditing}
              className={`w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition uppercase ${
                isEditing
                  ? "bg-gray-100 dark:bg-gray-900 cursor-not-allowed text-gray-500 dark:text-gray-400"
                  : ""
              }`}
              placeholder="مثال: SUMMER25"
            />
            {errors.code && (
              <p className="mt-1 text-sm text-red-600">{errors.code.message}</p>
            )}
          </div>

          {/* الوصف */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              الوصف (اختياري)
            </label>
            <input
              {...register("description")}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              placeholder="مثال: خصم 25% للعملاء الجدد"
            />
          </div>

          {/* نوع الخصم والقيمة */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                نوع الخصم *
              </label>
              <select
                {...register("discountType")}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              >
                <option value="PERCENTAGE">نسبة مئوية</option>
                <option value="FIXED">مبلغ ثابت</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {discountType === "PERCENTAGE" ? "النسبة (%) *" : "المبلغ *"}
              </label>
              <input
                type="number"
                step="0.01"
                {...register("discountValue")}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                placeholder={discountType === "PERCENTAGE" ? "25" : "50.00"}
              />
              {errors.discountValue && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.discountValue.message}
                </p>
              )}
            </div>
          </div>

          {/* الحد الأدنى للطلب والحد الأقصى للخصم */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                الحد الأدنى للطلب
              </label>
              <input
                type="number"
                step="0.01"
                {...register("minOrderValue")}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                placeholder="100.00"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                الحد الأقصى للخصم
              </label>
              <input
                type="number"
                step="0.01"
                {...register("maxDiscount")}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                placeholder="50.00"
              />
              {errors.maxDiscount && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.maxDiscount.message}
                </p>
              )}
            </div>
          </div>

          {/* تاريخ البدء والانتهاء */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                تاريخ البدء *
              </label>
              <input
                type="date"
                {...register("startsAt")}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              />
              {errors.startsAt && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.startsAt.message}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                تاريخ الانتهاء *
              </label>
              <input
                type="date"
                {...register("expiresAt")}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              />
              {errors.expiresAt && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.expiresAt.message}
                </p>
              )}
            </div>
          </div>

          {/* عدد الاستخدامات */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              الحد الأقصى لعدد الاستخدامات (اختياري)
            </label>
            <input
              type="number"
              {...register("usageLimit")}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              placeholder="100"
            />
          </div>

          {/* الحالة (نشط/غير نشط) */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              {...register("isActive")}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              الكوبون نشط
            </label>
          </div>

          {/* أزرار الإجراءات */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            <Button type="button" variant="ghost" onClick={onClose}>
              إلغاء
            </Button>
            <Button
              type="submit"
              isLoading={isSubmitting}
              disabled={isSubmitting}
            >
              {isEditing ? "تحديث" : "إضافة"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
