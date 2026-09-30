// src/pages/admin/CategoriesPage.tsx

import { motion } from "framer-motion";
import { Edit, Plus, Trash2, X } from "lucide-react";
import { useState } from "react";
import { createPortal } from "react-dom";
import { toast } from "sonner";
import { PageContainer } from "../../components/layout/PageContainer";
import {
  useCategories,
  useCreateCategory,
  useDeleteCategory,
  useUpdateCategory,
} from "../../features/categories/hooks/useCategories";
import type { Category } from "../../types/common.types";

// ============================================================
// 🧩 مودال إضافة/تعديل التصنيف
// ============================================================

interface CategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  initialName?: string;
  categoryId?: string;
  title: string;
}

const CategoryModal = ({
  isOpen,
  onClose,
  onSuccess,
  initialName = "",
  categoryId,
  title,
}: CategoryModalProps) => {
  const [name, setName] = useState(initialName);
  const createCategory = useCreateCategory();
  const updateCategory = useUpdateCategory();
  const isEditing = !!categoryId;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedName = name.trim();

    if (!trimmedName) {
      toast.error("الرجاء إدخال اسم التصنيف");
      return;
    }

    try {
      if (isEditing) {
        await updateCategory.mutateAsync({
          id: categoryId,
          data: { name: trimmedName },
        });
        console.log("dataaaaaaaaaaa:::::", trimmedName);
      } else {
        await createCategory.mutateAsync({ name: trimmedName });
      }
      onSuccess();
      onClose();
      setName("");
    } catch (error: any) {
      // console.log("eroooor", error);
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "حدث خطأ أثناء حفظ التصنيف"
      );
    }
  };

  if (!isOpen) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div className="absolute inset-0 backdrop-blur-sm" onClick={onClose} />
      <div
        className="relative  rounded-xl shadow-2xl max-w-md w-full p-6 z-10"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold ">{title}</h3>
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
            value={name || initialName}
            onChange={(e) => setName(e.target.value)}
            placeholder="اسم التصنيف..."
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg   focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
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
              disabled={createCategory.isPending || updateCategory.isPending}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition disabled:opacity-50"
            >
              {createCategory.isPending || updateCategory.isPending
                ? "جاري..."
                : isEditing
                ? "تحديث"
                : "إضافة"}
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
};

// ============================================================
// 🧩 الصفحة الرئيسية
// ============================================================

export const CategoriesPage = () => {
  const { data, isLoading, error } = useCategories();
  const deleteCategory = useDeleteCategory();
  const categories: Category[] = Array.isArray(data) ? data : [];

  const [modalOpen, setModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  // فتح مودال الإضافة
  const handleAdd = () => {
    setEditingCategory(null);
    setModalOpen(true);
  };

  // فتح مودال التعديل
  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setModalOpen(true);
  };
  console.log("categories&&&&&&&:::::::", categories);
  console.log("editingCategory:::::::", editingCategory);
  // حذف تصنيف مع تأكيد
  const handleDelete = (id: string, name: string) => {
    if (confirm(`هل أنت متأكد من حذف التصنيف "${name}"؟`)) {
      deleteCategory.mutate(id);
    }
  };

  // إغلاق المودال وتحديث القائمة
  const handleModalClose = () => {
    setModalOpen(false);
    setEditingCategory(null);
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

  if (error) {
    return (
      <PageContainer>
        <div className="text-center py-12">
          <p className="text-red-600">حدث خطأ أثناء جلب التصنيفات</p>
        </div>
      </PageContainer>
    );
  }

  const categoryList = categories;
  // Array.isArray(categories)
  // ? categories
  // : Array.isArray(categories?.data)
  // ? categories.data
  // : [];

  return (
    <PageContainer>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold ">إدارة التصنيفات</h1>
          <button
            onClick={handleAdd}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition"
          >
            <Plus className="w-4 h-4" />
            إضافة تصنيف
          </button>
        </div>

        {categoryList.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📂</div>
            <h2 className="text-xl font-medium text-gray-700 dark:text-gray-300">
              لا توجد تصنيفات
            </h2>
            <p className="text-gray-500 dark:text-gray-400 mt-2">
              أضف تصنيفك الأول باستخدام الزر أعلاه
            </p>
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 dark:bg-gray-700/50">
                <tr>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    الاسم
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    المعرف
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    الإجراءات
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {categoryList.map((category) => (
                  <tr
                    key={category.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition"
                  >
                    <td className="px-6 py-4 text-gray-900 dark:text-white">
                      {category.name}
                    </td>
                    <td className="px-6 py-4 text-gray-500 dark:text-gray-400 font-mono text-xs">
                      {category.id.slice(0, 8)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEdit(category)}
                          className="p-1.5 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition"
                          title="تعديل"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() =>
                            handleDelete(category.id, category.name)
                          }
                          disabled={deleteCategory.isPending}
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
        )}
      </motion.div>

      {/* مودال الإضافة/التعديل */}
      <CategoryModal
        isOpen={modalOpen}
        onClose={handleModalClose}
        onSuccess={() => {
          // بعد النجاح، لا حاجة لفعل شيء لأن invalidateQueries سيعيد جلب البيانات
        }}
        initialName={editingCategory?.name || ""}
        categoryId={editingCategory?.id}
        title={editingCategory ? "تعديل التصنيف" : "إضافة تصنيف جديد"}
      />
    </PageContainer>
  );
};
