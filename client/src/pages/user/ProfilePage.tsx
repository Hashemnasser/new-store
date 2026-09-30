// client/src/pages/user/ProfilePage.tsx

import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { Calendar, Camera, Mail, Save, Shield, User } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { PageContainer } from "../../components/layout/PageContainer";
import { Button } from "../../components/ui/Button";
import { authApi } from "../../features/auth/api/auth.api";
import { useAuth } from "../../features/auth/hooks/useAuth";
import { formatDate } from "../../utils/date";

// ============================================================
// 📝 مخطط التحقق (Zod Schema) لتحديث الملف الشخصي
// ============================================================

const profileSchema = z.object({
  name: z.string().min(2, "الاسم يجب أن يكون حرفين على الأقل").max(50),
  image: z
    .string()
    .url("الرجاء إدخال رابط صورة صحيح")
    .optional()
    .or(z.literal("")),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

// ============================================================
// 🧩 المكون الرئيسي
// ============================================================

export const ProfilePage = () => {
  const { user, updateUser, getUserProfile } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  // ✅ إعداد النموذج مع القيم الافتراضية من المستخدم
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isDirty },
    // setValue,
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name || "",
      image: user?.image || "",
    },
  });

  // ✅ مراقبة قيمة حقل الصورة لعرض المعاينة الفورية
  const imageUrl = watch("image");

  // ✅ دالة معالجة التحديث
  const onSubmit = async (data: ProfileFormValues) => {
    setIsLoading(true);
    try {
      // إزالة القيم الفارغة (إذا كان المستخدم لم يضع صورة)
      const payload: { name?: string; image?: string } = {};
      if (data.name && data.name !== user?.name) payload.name = data.name;
      if (data.image && data.image !== user?.image) payload.image = data.image;

      // إذا لم يتغير شيء، نوقف العملية
      if (Object.keys(payload).length === 0) {
        toast.info("لم تقم بتغيير أي بيانات");
        setIsLoading(false);
        return;
      }

      // 1. تحديث البيانات في الخادم (Backend)
      const response = await authApi.updateProfile(payload);

      // 2. تحديث الـ Store المحلي و localStorage
      if (response.success && response.data) {
        updateUser(response.data); // تحديث Zustand و localStorage

        // ✅ إعادة جلب البروفايل للتأكد من التزامن (اختياري ولكن مفيد)
        await getUserProfile();

        toast.success("تم تحديث الملف الشخصي بنجاح");
      } else {
        throw new Error("فشل تحديث الملف الشخصي");
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "حدث خطأ أثناء التحديث");
    } finally {
      setIsLoading(false);
    }
  };

  // إذا لم يكن المستخدم مسجلاً دخوله (حماية إضافية)
  if (!user) {
    return (
      <PageContainer>
        <div className="text-center py-12">
          <h2 className="text-xl font-medium text-gray-700 dark:text-gray-300">
            يرجى تسجيل الدخول أولاً
          </h2>
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
        <h1 className="text-2xl font-bold  mb-6">الملف الشخصي</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* ============================================================
              العمود الأيسر: بطاقة المعلومات
              ============================================================ */}
          <div className="lg:col-span-1">
            <div className=" rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 sticky top-24 text-center">
              {/* صورة الملف الشخصي */}
              <div className="relative inline-block mx-auto">
                <div className="w-32 h-32 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-5xl text-white font-bold overflow-hidden border-4 border-blue-100 dark:border-gray-600">
                  {user.image ? (
                    <img
                      src={user.image}
                      alt={user.name}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  ) : (
                    user.name?.[0]?.toUpperCase() || "U"
                  )}
                </div>
                <div className="absolute bottom-0 right-0 bg-blue-600 p-1.5 rounded-full border-2 border-white dark:border-gray-800">
                  <Camera className="w-4 h-4 text-white" />
                </div>
              </div>

              <h2 className="mt-4 text-xl font-bold ">{user.name}</h2>
              <p className="text-sm text-gray-400">
                {user.role === "ADMIN" ? "مدير" : "مستخدم"}
              </p>

              <div className="mt-6 space-y-3 text-right">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">
                    <Mail className="inline w-4 h-4 ml-2" />
                  </span>
                  <span className="">{user.email}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">
                    <Calendar className="inline w-4 h-4 ml-2" />
                  </span>
                  <span className="">{formatDate(user.createdAt)}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">
                    <Shield className="inline w-4 h-4 ml-2" />
                  </span>
                  <span className="">
                    {user.role === "ADMIN" ? "صلاحيات إدارية" : "مستخدم عادي"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* ============================================================
              العمود الأيمن: نموذج التحديث
              ============================================================ */}
          <div className="lg:col-span-2">
            <form
              onSubmit={handleSubmit(onSubmit)}
              className=" rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 space-y-6"
            >
              <h3 className="text-lg font-semibold ">تعديل البيانات الشخصية</h3>

              {/* حقل الاسم */}
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium   mb-1"
                >
                  الاسم الكامل
                </label>
                <div className="relative">
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <User className="w-5 h-5" />
                  </div>
                  <input
                    id="name"
                    type="text"
                    className="w-full pr-10 pl-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg  focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    placeholder="أدخل اسمك الكامل"
                    {...register("name")}
                  />
                </div>
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.name.message}
                  </p>
                )}
              </div>

              {/* حقل رابط الصورة (مع معاينة فورية) */}
              <div>
                <label
                  htmlFor="image"
                  className="block text-sm font-medium  mb-1"
                >
                  رابط الصورة الشخصية
                </label>
                <div className="relative">
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <Camera className="w-5 h-5" />
                  </div>
                  <input
                    id="image"
                    type="url"
                    className="w-full pr-10 pl-4 py-2 border   border-gray-300 dark:border-gray-700 rounded-lg  focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    placeholder="https://example.com/avatar.jpg"
                    {...register("image")}
                  />
                </div>
                {errors.image && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.image.message}
                  </p>
                )}

                {/* ✅ معاينة الصورة */}
                {imageUrl && (
                  <div className="mt-3 flex items-center gap-3 p-3  rounded-lg">
                    <img
                      src={imageUrl}
                      alt="معاينة الصورة"
                      className="w-12 h-12 rounded-full object-cover border-2 border-blue-500"
                      onError={(e) => {
                        // إذا فشل تحميل الصورة، نعرض أيقونة بديلة
                        (e.target as HTMLImageElement).style.display = "none";
                      }}
                      loading="lazy"
                    />
                    <span className="text-sm text-gray-400">
                      معاينة الصورة الجديدة
                    </span>
                  </div>
                )}
              </div>

              {/* أزرار الإجراءات */}
              <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                <Button
                  type="submit"
                  isLoading={isLoading}
                  disabled={!isDirty || isLoading}
                  className="flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  {isLoading ? "جاري الحفظ..." : "حفظ التغييرات"}
                </Button>
              </div>
            </form>

            {/* ============================================================
                قسم تغيير كلمة المرور (سيأتي في الخطوة التالية)
                ============================================================ */}
            <div className="mt-6  rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold  mb-2">تغيير كلمة المرور</h3>
              <p className="text-sm text-gray-400 mb-4">
                لتغيير كلمة المرور، انتقل إلى صفحة الإعدادات.
              </p>
              <Button
                variant="outline"
                onClick={() => (window.location.href = "/settings")}
                className="text-sm"
              >
                الذهاب إلى الإعدادات
              </Button>
            </div>
          </div>
        </div>
      </motion.div>
    </PageContainer>
  );
};

// ============================================================
// 📦 استيراد authApi للاستخدام في الدالة (يجب إضافته في الأعلى)
// ============================================================
// أضف هذا السطر في أعلى الملف مع باقي الـ imports:
// import { authApi } from "../../features/auth/api/auth.api";
