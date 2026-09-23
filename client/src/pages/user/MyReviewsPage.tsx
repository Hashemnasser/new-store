// client/src/pages/user/MyReviewsPage.tsx

import { motion } from "framer-motion";
import { MessageSquare, Pencil, Star, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { PageContainer } from "../../components/layout/PageContainer";
import { Button } from "../../components/ui/Button";
import {
  useDeleteReview,
  useUpdateReview,
  useUserReviews,
} from "../../features/reviews/hooks/useReviews";
import { Review } from "../../features/reviews/types/review.types";
import { formatDate } from "../../utils/date";
import { cn, isEmpty } from "../../utils/helpers";

// ============================================================
// 🧩 مودال تعديل التقييم (Modal)
// ============================================================

interface EditReviewModalProps {
  review: {
    id: string;
    productId: string;
    rating: number;
    comment: string;
  } | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const EditReviewModal = ({
  review,
  isOpen,
  onClose,
  onSuccess,
}: EditReviewModalProps) => {
  const [rating, setRating] = useState(review?.rating || 0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState(review?.comment || "");
  const updateReview = useUpdateReview();
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen || !review) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) {
      toast.error("الرجاء اختيار تقييم");
      return;
    }
    if (comment.trim().length < 3) {
      toast.error("الرجاء كتابة تعليق مناسب (3 أحرف على الأقل)");
      return;
    }

    setIsSubmitting(true);
    try {
      await updateReview.mutateAsync({
        id: review.id,
        data: { rating, comment: comment.trim() },
      });
      toast.success("تم تحديث التقييم بنجاح");
      onSuccess();
      onClose();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "حدث خطأ أثناء التحديث");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-md w-full p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          تعديل التقييم
        </h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* نجوم التقييم */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              تقييمك
            </label>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="focus:outline-none"
                >
                  <Star
                    className={cn(
                      "w-8 h-8 transition-colors",
                      star <= (hoverRating || rating)
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-300 dark:text-gray-600"
                    )}
                  />
                </button>
              ))}
              <span className="text-sm text-gray-500 mr-2">
                {rating > 0 ? `${rating} من 5` : "اختر تقييم"}
              </span>
            </div>
          </div>

          {/* حقل التعليق */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              تعليقك
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="اكتب رأيك عن المنتج..."
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition resize-none"
              rows={4}
            />
          </div>

          {/* أزرار الإجراءات */}
          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="ghost" onClick={onClose}>
              إلغاء
            </Button>
            <Button
              type="submit"
              isLoading={isSubmitting}
              disabled={isSubmitting}
            >
              {isSubmitting ? "جاري الحفظ..." : "حفظ التغييرات"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ============================================================
// 🧩 الصفحة الرئيسية: تقييماتي
// ============================================================

export const MyReviewsPage = () => {
  const { data: reviews, isLoading, error, refetch } = useUserReviews();
  const deleteReview = useDeleteReview();

  const [editingReview, setEditingReview] = useState<{
    id: string;
    productId: string;
    rating: number;
    comment: string;
  } | null>(null);

  // ✅ تحويل البيانات إلى مصفوفة (حماية)
  const reviewList: Review[] = Array.isArray(reviews)
    ? reviews
    : Array.isArray(reviews?.data)
    ? reviews.data
    : [];

  // ✅ دالة حذف التقييم
  const handleDelete = (reviewId: string) => {
    if (!window.confirm("هل أنت متأكد من حذف هذا التقييم؟")) return;
    deleteReview.mutate(reviewId, {
      onSuccess: () => {
        toast.success("تم حذف التقييم بنجاح");
        refetch();
      },
      onError: (error: any) => {
        toast.error(error?.response?.data?.message || "حدث خطأ أثناء الحذف");
      },
    });
  };

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

  if (error) {
    return (
      <PageContainer>
        <div className="text-center py-12">
          <p className="text-red-600">حدث خطأ أثناء جلب تقييماتك</p>
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
        <div className="flex items-center gap-2 mb-6">
          <MessageSquare className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            تقييماتي
          </h1>
        </div>

        {isEmpty(reviewList) ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">⭐</div>
            <h2 className="text-xl font-medium text-gray-700 dark:text-gray-300 mb-2">
              لم تقم بتقييم أي منتج حتى الآن
            </h2>
            <p className="text-gray-500 dark:text-gray-400">
              قم بتقييم المنتجات التي اشتريتها لمشاركة رأيك مع الآخرين.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {reviewList.map((review) => (
              <motion.div
                key={review.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    {/* المنتج */}
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {review.product?.title || "منتج غير معروف"}
                    </h3>

                    {/* نجوم التقييم */}
                    <div className="flex items-center gap-1 mt-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={cn(
                            "w-4 h-4",
                            star <= review.rating
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-gray-300 dark:text-gray-600"
                          )}
                        />
                      ))}
                      <span className="text-xs text-gray-500 mr-2">
                        ({formatDate(review.createdAt)})
                      </span>
                    </div>

                    {/* التعليق */}
                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                      {review.comment}
                    </p>
                  </div>

                  {/* أزرار الإجراءات */}
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() =>
                        setEditingReview({
                          id: review.id,
                          productId: review.productId,
                          rating: review.rating,
                          comment: review.comment,
                        })
                      }
                      className="p-2 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition"
                      title="تعديل"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(review.id)}
                      disabled={deleteReview.isPending}
                      className="p-2 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition disabled:opacity-50"
                      title="حذف"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>

      {/* مودال التعديل */}
      <EditReviewModal
        review={editingReview}
        isOpen={!!editingReview}
        onClose={() => setEditingReview(null)}
        onSuccess={refetch}
      />
    </PageContainer>
  );
};
