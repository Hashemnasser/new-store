// src/pages/admin/ProductFormPage.tsx

import { motion } from "framer-motion";
import { ArrowLeft, Save, X } from "lucide-react";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { ROUTES } from "../../app/router/route.constants";
import { PageContainer } from "../../components/layout/PageContainer";
import {
  useCategories,
  useCreateCategory,
} from "../../features/categories/hooks/useCategories";
import {
  useCreateProduct,
  useProduct,
  useUpdateProduct,
} from "../../features/products/hooks/useProducts";
import type { Category } from "../../types/common.types";

// ============================================================
// ✅ أنواع خاصة بالفورم (كل القيم نصوص لأن حقول الإدخال تُرجع string)
// ============================================================
interface FormImage {
  url: string;
  alt: string;
  isPrimary: boolean;
}

interface FormVariant {
  sku: string;
  price: string;
  stock: string;
  color: string;
  size: string;
}

interface FormData {
  title: string;
  description: string;
  categoryId: string;
  discountPercent: string;
  images: FormImage[];
  variants: FormVariant[];
  featured: boolean;
}

// ============================================================
// 🧩 مكون المودال (يُعرض عبر Portal)
// ============================================================

interface AddCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCategoryAdded: (categoryId: string) => void;
}

const AddCategoryModal = ({
  isOpen,
  onClose,
  onCategoryAdded,
}: AddCategoryModalProps) => {
  const [name, setName] = useState("");
  const createCategory = useCreateCategory();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedName = name.trim();
    if (!trimmedName) {
      toast.error("الرجاء إدخال اسم التصنيف");
      return;
    }
    try {
      const result = await createCategory.mutateAsync({ name: trimmedName });
      onCategoryAdded(result.id);
      setName("");
      onClose();
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || error?.message || "فشلت إضافة التصنيف"
      );
    }
  };

  if (!isOpen) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <div
        className="relative bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-md w-full p-6 z-10"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            إضافة تصنيف جديد
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition"
          >
            <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="اسم التصنيف..."
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            autoFocus
          />
          <div className="flex justify-end gap-2 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 dark:text-gray-300 dark:hover:text-white rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition"
            >
              إلغاء
            </button>
            <button
              type="submit"
              disabled={createCategory.isPending}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition disabled:opacity-50"
            >
              {createCategory.isPending ? "جاري..." : "إضافة"}
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
};

// ============================================================
// 🧩 المكون الرئيسي (ProductFormPage)
// ============================================================

export const ProductFormPage = () => {
  const { slug } = useParams<{ slug: string | undefined }>();
  const navigate = useNavigate();
  const isEditing = !!slug;

  // ---- جلب البيانات ----
  const { data: productData, isLoading: productLoading } = useProduct(
    slug || ""
  );
  const { data: categoriesData, isLoading: categoriesLoading } =
    useCategories();
  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();

  // ---- حالة الفورم ----
  const [formData, setFormData] = useState<FormData>({
    title: "",
    description: "",
    categoryId: "",
    discountPercent: "0",
    images: [{ url: "", alt: "", isPrimary: true }],
    variants: [{ sku: "", price: "", stock: "", color: "", size: "" }],
    featured: false,
  });

  // ---- حالة المودال ----
  const [showAddCategory, setShowAddCategory] = useState(false);

  // ---- ملء البيانات عند التعديل ----
  useEffect(() => {
    if (productData && isEditing) {
      const product = productData;

      // ✅ تحويل بيانات الـ API إلى صيغة الفورم (الأرقام → نصوص)
      const formattedImages: FormImage[] = product.images?.length
        ? product.images.map((img: any) => ({
            url: img.url ?? "",
            alt: img.alt ?? "",
            isPrimary: img.isPrimary ?? false,
          }))
        : [{ url: "", alt: "", isPrimary: true }];

      const formattedVariants: FormVariant[] = product.variants?.length
        ? product.variants.map((v: any) => ({
            sku: v.sku ?? "",
            price: v.price != null ? String(v.price) : "",
            stock: v.stock != null ? String(v.stock) : "",
            color: v.color ?? "",
            size: v.size ?? "",
          }))
        : [{ sku: "", price: "", stock: "", color: "", size: "" }];

      setFormData({
        title: product.title || "",
        description: product.description || "",
        categoryId: product.categoryId || "",
        discountPercent: product.discountPercent?.toString() || "0",
        images: formattedImages,
        variants: formattedVariants,
        featured: product.featured || false,
      });
    }
  }, [productData, isEditing]);

  // ---- معالجة تغييرات الحقول ----
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // ---- عند إضافة تصنيف جديد ----
  const handleCategoryAdded = (newCategoryId: string) => {
    setFormData((prev) => ({ ...prev, categoryId: newCategoryId }));
  };

  // ---- إرسال الفورم ----
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      toast.error("الرجاء إدخال عنوان المنتج");
      return;
    }
    if (!formData.categoryId) {
      toast.error("الرجاء اختيار التصنيف");
      return;
    }
    if (formData.images.some((img) => !img.url.trim())) {
      toast.error("الرجاء إدخال رابط صورة صحيح");
      return;
    }
    if (formData.variants.some((v) => !v.price || parseFloat(v.price) <= 0)) {
      toast.error("الرجاء إدخال سعر صحيح للمتغير");
      return;
    }

    try {
      // ✅ التحويل من FormData (نصوص) إلى payload (أرقام/null)
      const payload = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        categoryId: formData.categoryId,
        featured: formData.featured,
        discountPercent: parseFloat(formData.discountPercent) || 0,
        images: formData.images
          .filter((img) => img.url.trim() !== "")
          .map((img) => ({
            url: img.url.trim(),
            alt: img.alt.trim() || null, // ✅ string | null
            order: 0,
            isPrimary: img.isPrimary ?? false,
          })),
        variants: formData.variants
          .filter((v) => v.price && parseFloat(v.price) > 0)
          .map((v) => ({
            sku: v.sku.trim() || `SKU-${Date.now()}`,
            price: parseFloat(v.price) || 0, // ✅ number
            stock: parseInt(v.stock) || 0, // ✅ number
            color: v.color?.trim() || null, // ✅ string | null
            size: v.size?.trim() || null, // ✅ string | null
          })),
      };

      if (payload.images.length === 0) {
        toast.error("الرجاء إضافة صورة واحدة على الأقل");
        return;
      }
      if (payload.variants.length === 0) {
        toast.error("الرجاء إضافة متغير واحد على الأقل");
        return;
      }

      if (isEditing) {
        if (!slug) throw new Error("Slug is required for update");
        await updateProduct.mutateAsync({ slug, data: payload });
        toast.success("تم تحديث المنتج بنجاح");
      } else {
        await createProduct.mutateAsync(payload);
        toast.success("تم إضافة المنتج بنجاح");
      }
      navigate(ROUTES.ADMIN_PRODUCTS);
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        (isEditing
          ? "حدث خطأ أثناء تحديث المنتج"
          : "حدث خطأ أثناء إضافة المنتج");
      toast.error(message);
      console.error("❌ Submit error:", error);
    }
  };

  // ---- دوال إدارة الصور ----
  const addImage = () => {
    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, { url: "", alt: "", isPrimary: false }],
    }));
  };

  const removeImage = (index: number) => {
    if (formData.images.length <= 1) {
      toast.error("يجب أن يكون هناك صورة واحدة على الأقل");
      return;
    }
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  // ---- دوال إدارة المتغيرات ----
  const addVariant = () => {
    setFormData((prev) => ({
      ...prev,
      variants: [
        ...prev.variants,
        { sku: "", price: "", stock: "", color: "", size: "" },
      ],
    }));
  };

  const removeVariant = (index: number) => {
    if (formData.variants.length <= 1) {
      toast.error("يجب أن يكون هناك متغير واحد على الأقل");
      return;
    }
    setFormData((prev) => ({
      ...prev,
      variants: prev.variants.filter((_, i) => i !== index),
    }));
  };

  // ---- استخراج قائمة التصنيفات ----
  const categories: Category[] = Array.isArray(categoriesData)
    ? categoriesData
    : [];
  // : Array.isArray(categoriesData?.data)
  // ? categoriesData.data

  // ---- حالات التحميل ----
  if (productLoading || categoriesLoading) {
    return (
      <PageContainer>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
        </div>
      </PageContainer>
    );
  }

  // ---- العرض ----
  return (
    <PageContainer>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => navigate(ROUTES.ADMIN_PRODUCTS)}
            className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {isEditing ? "تعديل المنتج" : "إضافة منتج جديد"}
          </h1>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 space-y-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                عنوان المنتج *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                placeholder="مثال: هاتف ذكي"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                التصنيف *
              </label>
              <div className="flex gap-2">
                <select
                  name="categoryId"
                  value={formData.categoryId}
                  onChange={handleChange}
                  required
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                >
                  <option value="">اختر تصنيف</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={() => setShowAddCategory(true)}
                  className="px-2 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg transition whitespace-nowrap"
                >
                  Add Category
                </button>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              الوصف *
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              placeholder="وصف المنتج..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                نسبة التخفيض (%)
              </label>
              <input
                type="number"
                name="discountPercent"
                value={formData.discountPercent}
                onChange={handleChange}
                min="0"
                max="100"
                step="0.01"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                placeholder="0"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              الصور *
            </label>
            {formData.images.map((img, index) => (
              <div key={index} className="flex items-center gap-3 mb-2">
                <input
                  type="url"
                  value={img.url}
                  onChange={(e) => {
                    const newImages = [...formData.images];
                    newImages[index] = {
                      ...newImages[index],
                      url: e.target.value,
                    };
                    setFormData((prev) => ({ ...prev, images: newImages }));
                  }}
                  placeholder="رابط الصورة"
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  required
                />
                <input
                  type="text"
                  value={img.alt}
                  onChange={(e) => {
                    const newImages = [...formData.images];
                    newImages[index] = {
                      ...newImages[index],
                      alt: e.target.value,
                    };
                    setFormData((prev) => ({ ...prev, images: newImages }));
                  }}
                  placeholder="نص بديل (اختياري)"
                  className="w-32 px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="px-3 py-2 text-red-600 hover:text-red-700 font-medium rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition"
                >
                  حذف
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={addImage}
              className="mt-2 text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              + إضافة صورة أخرى
            </button>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-5">
              المتغيرات *
            </label>
            {formData.variants.map((v, index) => (
              <div
                key={index}
                className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-2"
              >
                <div className="flex-col text-center gap-1">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    SKU
                  </label>
                  <input
                    type="text"
                    value={v.sku}
                    onChange={(e) => {
                      const newVariants = [...formData.variants];
                      newVariants[index] = {
                        ...newVariants[index],
                        sku: e.target.value,
                      };
                      setFormData((prev) => ({
                        ...prev,
                        variants: newVariants,
                      }));
                    }}
                    placeholder="SKU"
                    className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  />
                </div>
                <div className="flex-col text-center gap-1">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    السعر
                  </label>
                  <input
                    type="number"
                    value={v.price}
                    onChange={(e) => {
                      const newVariants = [...formData.variants];
                      newVariants[index] = {
                        ...newVariants[index],
                        price: e.target.value,
                      };
                      setFormData((prev) => ({
                        ...prev,
                        variants: newVariants,
                      }));
                    }}
                    placeholder="السعر"
                    step="0.01"
                    className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  />
                </div>
                <div className="flex-col text-center gap-1">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    المخزون
                  </label>
                  <input
                    type="number"
                    value={v.stock}
                    onChange={(e) => {
                      const newVariants = [...formData.variants];
                      newVariants[index] = {
                        ...newVariants[index],
                        stock: e.target.value,
                      };
                      setFormData((prev) => ({
                        ...prev,
                        variants: newVariants,
                      }));
                    }}
                    placeholder="المخزون"
                    className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  />
                </div>
                <div className="flex-col text-center gap-1">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    اللون
                  </label>
                  <input
                    type="text"
                    value={v.color}
                    onChange={(e) => {
                      const newVariants = [...formData.variants];
                      newVariants[index] = {
                        ...newVariants[index],
                        color: e.target.value,
                      };
                      setFormData((prev) => ({
                        ...prev,
                        variants: newVariants,
                      }));
                    }}
                    placeholder="اللون (اختياري)"
                    className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  />
                </div>
                <div className="flex-col text-center gap-1">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    المقاس
                  </label>
                  <input
                    type="text"
                    value={v.size}
                    onChange={(e) => {
                      const newVariants = [...formData.variants];
                      newVariants[index] = {
                        ...newVariants[index],
                        size: e.target.value,
                      };
                      setFormData((prev) => ({
                        ...prev,
                        variants: newVariants,
                      }));
                    }}
                    placeholder="المقاس (اختياري)"
                    className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removeVariant(index)}
                  className="px-3 py-2 text-red-600 hover:text-red-700 font-medium rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition"
                >
                  حذف المتغير
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={addVariant}
              className="mt-2 text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              + إضافة متغير آخر
            </button>
          </div>

          <div className="flex items-center gap-2">
            <input
              name="featured"
              type="checkbox"
              checked={formData.featured}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, featured: e.target.checked }))
              }
              className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
            />
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              مميز (Featured)
            </label>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={() => navigate(ROUTES.ADMIN_PRODUCTS)}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 dark:text-gray-300 dark:hover:text-white font-medium rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition"
            >
              إلغاء
            </button>
            <button
              type="submit"
              disabled={createProduct.isPending || updateProduct.isPending}
              className="flex items-center gap-2 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              {createProduct.isPending || updateProduct.isPending
                ? "جاري الحفظ..."
                : isEditing
                ? "تحديث المنتج"
                : "إضافة المنتج"}
            </button>
          </div>
        </form>
      </motion.div>

      <AddCategoryModal
        isOpen={showAddCategory}
        onClose={() => setShowAddCategory(false)}
        onCategoryAdded={handleCategoryAdded}
      />
    </PageContainer>
  );
};
