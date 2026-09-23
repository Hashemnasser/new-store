// // src/features/reviews/components/ReviewForm.tsx

// import { Star } from "lucide-react";
// import { useState } from "react";
// import { toast } from "sonner";
// import { useCreateReview } from "../hooks/useReviews";

// interface ReviewFormProps {
//   productId: string;
//   onSuccess?: () => void;
// }

// export const ReviewForm = ({ productId, onSuccess }: ReviewFormProps) => {
//   const [rating, setRating] = useState(0);
//   const [hoverRating, setHoverRating] = useState(0);
//   const [comment, setComment] = useState("");
//   const createReview = useCreateReview();

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();

//     if (rating === 0) {
//       toast.error("الرجاء اختيار تقييم");
//       return;
//     }

//     if (comment.trim().length < 3) {
//       toast.error("الرجاء كتابة تعليق مناسب (3 أحرف على الأقل)");
//       return;
//     }

//     createReview.mutate(
//       { productId, rating, comment: comment.trim() },
//       {
//         onSuccess: () => {
//           setRating(0);
//           setComment("");
//           if (onSuccess) onSuccess();
//         },
//       }
//     );
//   };

//   return (
//     <form onSubmit={handleSubmit} className="space-y-4">
//       <div>
//         <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
//           تقييمك
//         </label>
//         <div className="flex items-center gap-1">
//           {[1, 2, 3, 4, 5].map((star) => (
//             <button
//               key={star}
//               type="button"
//               onClick={() => setRating(star)}
//               onMouseEnter={() => setHoverRating(star)}
//               onMouseLeave={() => setHoverRating(0)}
//               className="focus:outline-none"
//             >
//               <Star
//                 className={`w-6 h-6 transition-colors ${
//                   star <= (hoverRating || rating)
//                     ? "fill-yellow-400 text-yellow-400"
//                     : "text-gray-300 dark:text-gray-600"
//                 }`}
//               />
//             </button>
//           ))}
//           <span className="text-sm text-gray-500 ml-2">
//             {rating > 0 ? `${rating} من 5` : "اختر تقييم"}
//           </span>
//         </div>
//       </div>

//       <div>
//         <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
//           تعليقك
//         </label>
//         <textarea
//           value={comment}
//           onChange={(e) => setComment(e.target.value)}
//           placeholder="اكتب رأيك عن المنتج..."
//           className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition resize-none"
//           rows={4}
//         />
//       </div>

//       <button
//         type="submit"
//         disabled={createReview.isPending}
//         className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2 rounded-lg transition disabled:opacity-50"
//       >
//         {createReview.isPending ? "جاري الإرسال..." : "إرسال التقييم"}
//       </button>
//     </form>
//   );
// };

// src/features/reviews/components/ReviewForm.tsx

import { Star } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useCreateReview } from "../hooks/useReviews";

interface ReviewFormProps {
  productId: string;
  onSuccess?: () => void;
}

export const ReviewForm = ({ productId, onSuccess }: ReviewFormProps) => {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const createReview = useCreateReview();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (rating === 0) {
      toast.error("الرجاء اختيار تقييم");
      return;
    }

    if (comment.trim().length < 3) {
      toast.error("الرجاء كتابة تعليق مناسب (3 أحرف على الأقل)");
      return;
    }

    createReview.mutate(
      { productId, rating, comment: comment.trim() },
      {
        onSuccess: () => {
          setRating(0);
          setComment("");
          if (onSuccess) onSuccess();
        },
      }
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
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
                className={`w-6 h-6 transition-colors ${
                  star <= (hoverRating || rating)
                    ? "fill-yellow-400 text-yellow-400"
                    : "text-gray-300 dark:text-gray-600"
                }`}
              />
            </button>
          ))}
          <span className="text-sm text-gray-500 ml-2">
            {rating > 0 ? `${rating} من 5` : "اختر تقييم"}
          </span>
        </div>
      </div>

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

      <button
        type="submit"
        disabled={createReview.isPending}
        className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2 rounded-lg transition disabled:opacity-50"
      >
        {createReview.isPending ? "جاري الإرسال..." : "إرسال التقييم"}
      </button>
    </form>
  );
};
