// src/pages/admin/ReviewsPage.tsx

import { motion } from "framer-motion";
import { MessageSquare, Star, Trash2 } from "lucide-react";
import { PageContainer } from "../../components/layout/PageContainer";
import {
  useAllReviews,
  useDeleteReviewAsAdmin,
} from "../../features/reviews/hooks/useReviews";
import { Review } from "../../features/reviews/types/review.types";
import { formatDate } from "../../utils/date";
import { isEmpty } from "../../utils/helpers";

export const AdminReviewsPage = () => {
  const { data, isLoading, error } = useAllReviews();
  const deleteReview = useDeleteReviewAsAdmin();
  console.log("data!!!!!!!!!!!!!!::", data);
  // ✅ التأكد من أن reviews مصفوفة (حتى لو كانت فارغة)
  const reviews: Review[] = Array.isArray(data?.data) ? data.data : [];

  const handleDeleteReview = (reviewId: string) => {
    if (window.confirm("هل أنت متأكد من حذف هذا التقييم؟")) {
      deleteReview.mutate(reviewId);
    }
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
          <p className="text-red-600">حدث خطأ أثناء جلب التقييمات</p>
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
          <h1 className="text-2xl font-bold  flex items-center gap-2">
            <MessageSquare className="w-6 h-6" />
            إدارة التقييمات
          </h1>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            إجمالي التقييمات: {reviews.length || 0}
          </span>
        </div>

        {isEmpty(reviews) ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">⭐</div>
            <h2 className="text-xl font-medium text-gray-700 dark:text-gray-300 mb-2">
              لا توجد تقييمات
            </h2>
          </div>
        ) : (
          <div className="space-y-4">
            {reviews.map((review) => (
              <motion.div
                key={review.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-8 h-8 rounded-full bg-linear-to-r from-blue-500 to-purple-500 text-white flex items-center justify-center text-sm font-bold">
                        {review.user?.name?.[0]?.toUpperCase() || "U"}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {review.user?.name || "مستخدم غير معروف"}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {formatDate(review.createdAt)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 mb-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`w-4 h-4 ${
                            star <= review.rating
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-gray-300 dark:text-gray-600"
                          }`}
                        />
                      ))}
                    </div>

                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {review.comment}
                    </p>

                    {review.product && (
                      <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                        المنتج: {review.product.title}
                      </p>
                    )}
                  </div>

                  <button
                    onClick={() => handleDeleteReview(review.id)}
                    disabled={deleteReview.isPending}
                    className="p-2 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition disabled:opacity-50"
                    title="حذف"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </PageContainer>
  );
};
