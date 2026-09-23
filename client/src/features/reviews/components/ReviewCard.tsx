// // src/features/reviews/components/ReviewCard.tsx

// import { Check, Pencil, Star, Trash2, X } from "lucide-react";
// import { useState } from "react";
// import { toast } from "sonner";
// import { formatDate, timeAgo } from "../../../utils/date";
// import { useAuth } from "../../auth/hooks/useAuth";
// import { useDeleteReview, useUpdateReview } from "../hooks/useReviews";
// import type { Review } from "../types/review.types";

// interface ReviewCardProps {
//   review: Review;
//   onUpdate?: () => void;
// }

// export const ReviewCard = ({ review, onUpdate }: ReviewCardProps) => {
//   const { user } = useAuth();
//   const [isEditing, setIsEditing] = useState(false);
//   const [rating, setRating] = useState(review.rating);
//   const [hoverRating, setHoverRating] = useState(0);
//   const [comment, setComment] = useState(review.comment);
//   const updateReview = useUpdateReview();
//   const deleteReview = useDeleteReview();

//   const isOwner = user?.id === review.userId;

//   const handleUpdate = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (comment.trim().length < 3) {
//       toast.error("الرجاء كتابة تعليق مناسب (3 أحرف على الأقل)");
//       return;
//     }
//     updateReview.mutate(
//       { id: review.id, data: { rating, comment: comment.trim() } },
//       {
//         onSuccess: () => {
//           setIsEditing(false);
//           if (onUpdate) onUpdate();
//         },
//       }
//     );
//   };

//   const handleDelete = () => {
//     if (window.confirm("هل أنت متأكد من حذف هذا التقييم؟")) {
//       deleteReview.mutate(review.id, {
//         onSuccess: () => {
//           if (onUpdate) onUpdate();
//         },
//       });
//     }
//   };

//   const handleCancel = () => {
//     setRating(review.rating);
//     setComment(review.comment);
//     setIsEditing(false);
//   };

//   if (isEditing) {
//     return (
//       <div className="border-b border-gray-200 dark:border-gray-700 py-4 last:border-0">
//         <form onSubmit={handleUpdate} className="space-y-4">
//           <div>
//             <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
//               تقييمك
//             </label>
//             <div className="flex items-center gap-1">
//               {[1, 2, 3, 4, 5].map((star) => (
//                 <button
//                   key={star}
//                   type="button"
//                   onClick={() => setRating(star)}
//                   onMouseEnter={() => setHoverRating(star)}
//                   onMouseLeave={() => setHoverRating(0)}
//                   className="focus:outline-none"
//                 >
//                   <Star
//                     className={`w-6 h-6 transition-colors ${
//                       star <= (hoverRating || rating)
//                         ? "fill-yellow-400 text-yellow-400"
//                         : "text-gray-300 dark:text-gray-600"
//                     }`}
//                   />
//                 </button>
//               ))}
//               <span className="text-sm text-gray-500 ml-2">
//                 {rating > 0 ? `${rating} من 5` : "اختر تقييم"}
//               </span>
//             </div>
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
//               تعليقك
//             </label>
//             <textarea
//               value={comment}
//               onChange={(e) => setComment(e.target.value)}
//               placeholder="اكتب رأيك عن المنتج..."
//               className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition resize-none"
//               rows={4}
//             />
//           </div>

//           <div className="flex items-center gap-3">
//             <button
//               type="submit"
//               disabled={updateReview.isPending}
//               className="flex items-center gap-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition disabled:opacity-50"
//             >
//               <Check className="w-4 h-4" />
//               {updateReview.isPending ? "جاري الحفظ..." : "حفظ التغييرات"}
//             </button>
//             <button
//               type="button"
//               onClick={handleCancel}
//               className="flex items-center gap-1 px-4 py-2 text-gray-600 hover:text-gray-800 dark:text-gray-300 dark:hover:text-white font-medium rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition"
//             >
//               <X className="w-4 h-4" />
//               إلغاء
//             </button>
//           </div>
//         </form>
//       </div>
//     );
//   }

//   return (
//     <div className="border-b border-gray-200 dark:border-gray-700 py-4 last:border-0">
//       <div className="flex items-center justify-between mb-2">
//         <div className="flex items-center gap-3">
//           <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-white flex items-center justify-center text-sm font-bold">
//             {review.user.name?.[0]?.toUpperCase() || "U"}
//           </div>
//           <span className="font-medium text-gray-800 dark:text-white">
//             {review.user.name}
//           </span>
//         </div>
//         <div className="flex items-center gap-2">
//           <span
//             className="text-sm text-gray-500 dark:text-gray-400"
//             title={formatDate(review.createdAt)}
//           >
//             {timeAgo(review.createdAt)}
//           </span>
//           {isOwner && (
//             <div className="flex items-center gap-1">
//               <button
//                 onClick={() => setIsEditing(true)}
//                 className="p-1 text-blue-500 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded transition"
//                 aria-label="تعديل التقييم"
//               >
//                 <Pencil className="w-4 h-4" />
//               </button>
//               <button
//                 onClick={handleDelete}
//                 disabled={deleteReview.isPending}
//                 className="p-1 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition disabled:opacity-50"
//                 aria-label="حذف التقييم"
//               >
//                 <Trash2 className="w-4 h-4" />
//               </button>
//             </div>
//           )}
//         </div>
//       </div>

//       <div className="flex items-center gap-1 mb-2">
//         {[1, 2, 3, 4, 5].map((star) => (
//           <Star
//             key={star}
//             className={`w-4 h-4 ${
//               star <= review.rating
//                 ? "fill-yellow-400 text-yellow-400"
//                 : "text-gray-300 dark:text-gray-600"
//             }`}
//           />
//         ))}
//       </div>

//       <p className="text-gray-600 dark:text-gray-300 text-sm">
//         {review.comment}
//       </p>
//     </div>
//   );
// };

// src/features/reviews/components/ReviewCard.tsx
import { Check, Pencil, Star, Trash2, X } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { formatDate, timeAgo } from "../../../utils/date";
import { useAuth } from "../../auth/hooks/useAuth";
import { useDeleteReview, useUpdateReview } from "../hooks/useReviews";
import type { Review } from "../types/review.types";

interface ReviewCardProps {
  review: Review;
  onUpdate?: () => void;
}

export const ReviewCard = ({ review, onUpdate }: ReviewCardProps) => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [rating, setRating] = useState(review.rating);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState(review.comment);
  const updateReview = useUpdateReview();
  const deleteReview = useDeleteReview();

  const isOwner = user?.id === review.userId;

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (comment.trim().length < 3) {
      toast.error(t("validation.minLength", { count: 3 }));
      return;
    }
    updateReview.mutate(
      { id: review.id, data: { rating, comment: comment.trim() } },
      {
        onSuccess: () => {
          setIsEditing(false);
          if (onUpdate) onUpdate();
        },
      }
    );
  };

  const handleDelete = () => {
    if (window.confirm(t("common.confirmDelete"))) {
      deleteReview.mutate(review.id, {
        onSuccess: () => {
          if (onUpdate) onUpdate();
        },
      });
    }
  };

  const handleCancel = () => {
    setRating(review.rating);
    setComment(review.comment);
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className="border-b border-gray-200 dark:border-gray-700 py-4 last:border-0">
        <form onSubmit={handleUpdate} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t("common.rating")}
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
                    className={`w-6 h-6 transition-colors ${
                      star <= (hoverRating || rating)
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-300 dark:text-gray-600"
                    }`}
                  />
                </button>
              ))}
              <span className="text-sm text-gray-500 ml-2">
                {rating > 0
                  ? `${rating} ${t("common.of")} 5`
                  : t("common.selectRating")}
              </span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t("common.comment")}
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder={t("common.writeReview")}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition resize-none"
              rows={4}
            />
          </div>

          <div className="flex items-center gap-3">
            <button
              type="submit"
              disabled={updateReview.isPending}
              className="flex items-center gap-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition disabled:opacity-50"
            >
              <Check className="w-4 h-4" />
              {updateReview.isPending ? t("common.loading") : t("common.save")}
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="flex items-center gap-1 px-4 py-2 text-gray-600 hover:text-gray-800 dark:text-gray-300 dark:hover:text-white font-medium rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition"
            >
              <X className="w-4 h-4" />
              {t("common.cancel")}
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="border-b border-gray-200 dark:border-gray-700 py-4 last:border-0">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-white flex items-center justify-center text-sm font-bold">
            {review.user.name?.[0]?.toUpperCase() || "U"}
          </div>
          <span className="font-medium text-gray-800 dark:text-white">
            {review.user.name}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span
            className="text-sm text-gray-500 dark:text-gray-400"
            title={formatDate(review.createdAt)}
          >
            {timeAgo(review.createdAt)}
          </span>
          {isOwner && (
            <div className="flex items-center gap-1">
              <button
                onClick={() => setIsEditing(true)}
                className="p-1 text-blue-500 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded transition"
                aria-label={t("common.edit")}
              >
                <Pencil className="w-4 h-4" />
              </button>
              <button
                onClick={handleDelete}
                disabled={deleteReview.isPending}
                className="p-1 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition disabled:opacity-50"
                aria-label={t("common.delete")}
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          )}
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

      <p className="text-gray-600 dark:text-gray-300 text-sm">
        {review.comment}
      </p>
    </div>
  );
};
