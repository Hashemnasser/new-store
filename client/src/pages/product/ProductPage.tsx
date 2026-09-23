// src/pages/product/ProductPage.tsx

import { motion } from "framer-motion";
import {
  Heart,
  Minus,
  Plus,
  RefreshCw,
  Share2,
  Shield,
  ShoppingCart,
  Star,
  Truck,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { toast } from "sonner";
import { PageContainer } from "../../components/layout/PageContainer";
import { Seo } from "../../components/seo/Seo";
import { useAuth } from "../../features/auth/hooks/useAuth";
import { useCart } from "../../features/cart/hooks/useCart";
import { useProduct } from "../../features/products/hooks/useProducts";
import type {
  ProductImage,
  ProductVariant,
} from "../../features/products/types/product.types";
import { ReviewCard } from "../../features/reviews/components/ReviewCard";
import { ReviewForm } from "../../features/reviews/components/ReviewForm";
import { useProductReviews } from "../../features/reviews/hooks/useReviews";
import type { Review } from "../../features/reviews/types/review.types";
import { useWishlist } from "../../features/wishlist/hooks/useWishlist";
import { formatCurrency } from "../../utils/currency";
import { copyToClipboard } from "../../utils/helpers";

export const ProductPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const [quantity, setQuantity] = useState(1);
  const { data, isLoading, error } = useProduct(slug!);
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

  const product = data;
  const { data: reviewsData, refetch: refetchReviews } = useProductReviews(
    product?.id || ""
  );
  const { user } = useAuth();

  const reviews: Review[] = Array.isArray(reviewsData?.data)
    ? reviewsData?.data
    : [];

  const userReview = reviews.find((r) => r.userId === user?.id);
  const hasReviewed = !!userReview;

  const [selectedVariantId, setSelectedVariantId] = useState<string>("");

  useEffect(() => {
    if (product?.variants[0]?.id) {
      setSelectedVariantId(product.variants[0].id);
    }
  }, [product]);

  const handleAddToCart = () => {
    if (!product) return;
    if (!selectedVariantId) {
      toast.error("الرجاء اختيار المتغير المناسب");
      return;
    }

    addToCart({
      productId: product.id,
      variantId: selectedVariantId,
      quantity: quantity,
    });
  };

  const handleToggleWishlist = () => {
    if (!product) return;
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
      toast.success("تم إزالة المنتج من قائمة الرغبات");
    } else {
      addToWishlist(product.id);
      toast.success("تم إضافة المنتج إلى قائمة الرغبات");
    }
  };

  const handleShare = async () => {
    const success = await copyToClipboard(window.location.href);
    if (success) {
      toast.success("تم نسخ رابط المنتج");
    } else {
      toast.error("حدث خطأ أثناء نسخ الرابط");
    }
  };

  if (isLoading) {
    return (
      <PageContainer>
        <div className="animate-pulse">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="aspect-square bg-gray-200 rounded-xl" />
            <div className="space-y-4">
              <div className="h-8 bg-gray-200 rounded w-3/4" />
              <div className="h-4 bg-gray-200 rounded w-1/2" />
              <div className="h-12 bg-gray-200 rounded w-1/3" />
              <div className="h-24 bg-gray-200 rounded" />
            </div>
          </div>
        </div>
      </PageContainer>
    );
  }

  if (error || !product) {
    return (
      <PageContainer>
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-700 dark:text-gray-300">
            المنتج غير موجود
          </h2>
          <Link
            to="/products"
            className="text-blue-600 hover:underline mt-4 inline-block"
          >
            العودة إلى المنتجات
          </Link>
        </div>
      </PageContainer>
    );
  }

  const primaryImage =
    product.images.find((img: ProductImage) => img.isPrimary)?.url ||
    product.images[0]?.url;

  const selectedVariant = product.variants.find(
    (v: ProductVariant) => v.id === selectedVariantId
  );

  // السعر الأصلي (من المتغير المختار أو الأول)
  const originalPrice =
    selectedVariant?.price || product.variants[0]?.price || 0;

  // نسبة التخفيض من المنتج
  const discountPercent = product.discountPercent ?? 0;
  const hasDiscount = discountPercent > 0;

  // السعر بعد الخصم (إذا كان هناك خصم)
  const discountedPrice = hasDiscount
    ? originalPrice * (1 - discountPercent / 100)
    : originalPrice;

  // السعر المعروض (المخفض إذا وجد)
  const displayPrice = hasDiscount ? discountedPrice : originalPrice;
  const totalPrice = displayPrice * quantity;

  return (
    <PageContainer>
      <Seo
        title={`${product.title} - ProStore`}
        description={product.description.slice(0, 160)}
        image={primaryImage || "/images/placeholder.png"}
        url={`${window.location.origin}/product/${product.slug}`}
        keywords={product.title + ", تسوق, منتج"}
      />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <nav className="flex items-center gap-2 text-sm dark:text-olive-200 mb-6">
          <Link to="/" className="hover:text-blue-600">
            الرئيسية
          </Link>
          <span>/</span>
          <Link to="/products" className="hover:text-blue-600">
            المنتجات
          </Link>
          <span>/</span>
          <span className="font-medium truncate">{product.title}</span>
        </nav>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="rounded-2xl overflow-hidden shadow-lg border h-fit"
          >
            <img
              src={primaryImage || "/images/placeholder.png"}
              alt={product.title}
              className="w-full h-auto aspect-square object-cover"
              loading="lazy"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="space-y-6"
          >
            <div className="flex items-center gap-3 flex-wrap">
              <span className="text-blue-800 dark:text-blue-300 text-xs font-medium px-3 py-1 rounded-full">
                {product.category?.name || "غير مصنف"}
              </span>
              {product.isPublished ? (
                <span className="bg-green-100 dark:bg-green-900/40 text-green-800 dark:text-green-300 text-xs font-medium px-3 py-1 rounded-full flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />{" "}
                  متوفر
                </span>
              ) : (
                <span className="bg-red-100 dark:bg-red-900/40 text-red-800 dark:text-red-300 text-xs font-medium px-3 py-1 rounded-full">
                  غير متوفر
                </span>
              )}
            </div>

            <h1 className="text-3xl font-bold">{product.title}</h1>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${
                      i < Math.round(product.averageRating)
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-300 dark:text-gray-600"
                    }`}
                  />
                ))}
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300 ml-2">
                  {product.averageRating.toFixed(1)}
                </span>
              </div>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                ({product.reviewsCount} تقييم)
              </span>
            </div>

            {/* عرض السعر مع التخفيض */}
            <div className="flex items-baseline gap-3">
              {hasDiscount ? (
                <>
                  <span className="text-4xl font-bold text-red-600 dark:text-red-400">
                    {formatCurrency(discountedPrice)}
                  </span>
                  <span className="text-lg text-gray-400 line-through">
                    {formatCurrency(originalPrice)}
                  </span>
                  <span className="bg-red-100 text-red-700 px-2 py-1 rounded-full text-sm font-semibold">
                    -{discountPercent}%
                  </span>
                </>
              ) : (
                <span className="text-4xl font-bold text-blue-600 dark:text-blue-400">
                  {formatCurrency(originalPrice)}
                </span>
              )}
              {product.variants.length > 1 && (
                <span className="text-sm text-gray-500">
                  + {product.variants.length - 1} متغيرات
                </span>
              )}
            </div>

            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              {product.description}
            </p>

            {product.variants.length > 1 && (
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  المتغير:
                </span>
                <select
                  value={selectedVariantId}
                  onChange={(e) => setSelectedVariantId(e.target.value)}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                >
                  {product.variants.map((variant: ProductVariant) => (
                    <option key={variant.id} value={variant.id}>
                      {variant.color || variant.size || variant.sku} -{" "}
                      {formatCurrency(variant.price)}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div className="flex items-center gap-4">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                الكمية:
              </span>
              <div className="flex items-center border border-gray-300 dark:border-gray-700 rounded-lg">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                  disabled={quantity <= 1}
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-12 text-center font-medium">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleAddToCart}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition flex items-center justify-center gap-2"
              >
                <ShoppingCart className="w-5 h-5" />
                أضف إلى السلة ({formatCurrency(totalPrice)})
              </button>

              <button
                onClick={handleToggleWishlist}
                className="p-3 border-2 border-gray-300 dark:border-gray-700 rounded-lg hover:border-blue-600 dark:hover:border-blue-500 transition"
                aria-label="قائمة الرغبات"
              >
                <Heart
                  className={`w-5 h-5 ${
                    isInWishlist(product.id)
                      ? "fill-red-500 text-red-500"
                      : "text-gray-600 dark:text-gray-400"
                  }`}
                />
              </button>

              <button
                onClick={handleShare}
                className="p-3 border-2 border-gray-300 dark:border-gray-700 rounded-lg hover:border-blue-600 dark:hover:border-blue-500 transition"
                aria-label="مشاركة"
              >
                <Share2 className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <Truck className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <span>توصيل مجاني</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <Shield className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <span>ضمان الجودة</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <RefreshCw className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <span>إرجاع خلال 14 يوم</span>
              </div>
            </div>

            {/* التقييمات */}
            <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                التقييمات ({reviews.length || 0})
              </h3>

              {user && (
                <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                  {hasReviewed ? (
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      لقد قمت بتقييم هذا المنتج مسبقاً. يمكنك تعديل تقييمك أو
                      حذفه باستخدام الأزرار الموجودة على تقييمك.
                    </p>
                  ) : (
                    <ReviewForm
                      productId={product.id}
                      onSuccess={refetchReviews}
                    />
                  )}
                </div>
              )}

              <div className="space-y-4">
                {reviews.length === 0 ? (
                  <p className="text-gray-500 dark:text-gray-400 text-center py-4">
                    لا توجد تقييمات حتى الآن. كن أول من يقيم هذا المنتج!
                  </p>
                ) : (
                  reviews.map((review: Review) => (
                    <ReviewCard
                      key={review.id}
                      review={review}
                      onUpdate={refetchReviews}
                    />
                  ))
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </PageContainer>
  );
};
