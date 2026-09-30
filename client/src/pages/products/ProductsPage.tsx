// src/pages/products/ProductsPage.tsx

import { motion } from "framer-motion";
import { Loader2, Search, X } from "lucide-react";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { useIntersectionObserver } from "../../app/hooks/useIntersectionObserver";
import { PageContainer } from "../../components/layout/PageContainer";
import { Seo } from "../../components/seo/Seo";
import { useCart } from "../../features/cart/hooks/useCart";
import { useCategories } from "../../features/categories/hooks/useCategories";
import { ProductGrid } from "../../features/products/components/ProductGrid";
import type { SortOption } from "../../features/products/constants/sort.constants";
import {
  SORT_OPTIONS,
  isValidSort,
} from "../../features/products/constants/sort.constants";
import { useInfiniteProducts } from "../../features/products/hooks/useProducts";
import type { Product } from "../../features/products/types/product.types";
import { useWishlist } from "../../features/wishlist/hooks/useWishlist";
import { Category } from "../../types/common.types";
import { isEmpty } from "../../utils/helpers";

const PRODUCTS_PER_PAGE = 12;

export const ProductsPage = () => {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { data: categ } = useCategories();

  const categoryData: Category[] = useMemo(() => {
    return Array.isArray(categ) ? categ : [];
  }, [categ]);

  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [category, setCategory] = useState(searchParams.get("category") || "");
  const [sort, setSort] = useState<SortOption>(() => {
    const param = searchParams.get("sort");
    return isValidSort(param) ? param : "newest";
  });
  const [isOnSale, setIsOnSale] = useState(
    searchParams.get("onSale") === "true"
  );

  // ✅ استخدام useInfiniteProducts بدلاً من useProducts
  const {
    data,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
  } = useInfiniteProducts(
    {
      search: search || undefined,
      category: category || undefined,
      sort,
      isOnSale: isOnSale || undefined,
    },
    PRODUCTS_PER_PAGE
  );

  // ✅ تجميع جميع الصفحات في مصفوفة واحدة
  const products: Product[] = useMemo(() => {
    if (!data?.pages) return [];
    return data.pages.flatMap((page) => page.data);
  }, [data]);

  // ✅ الحصول على إجمالي المنتجات من الصفحة الأخيرة
  const totalProducts = useMemo(() => {
    if (!data?.pages || data.pages.length === 0) return 0;
    return data.pages[0].pagination.total;
  }, [data]);

  // ✅ Sentinel (عنصر المراقبة) لتحميل المزيد عند الوصول له
  const { ref: loadMoreRef, isIntersecting } =
    useIntersectionObserver<HTMLDivElement>({
      threshold: 0.1,
      rootMargin: "200px", // يبدأ التحميل قبل 200px من الوصول للنهاية
      enabled: !!hasNextPage && !isFetchingNextPage,
    });

  // ✅ تحميل المزيد عند وصول Sentinel للمجال المرئي
  useEffect(() => {
    if (isIntersecting && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [isIntersecting, hasNextPage, isFetchingNextPage, fetchNextPage]);

  // ✅ إعادة تعيين عند تغيير الفلاتر (لضمان بدء التمرير من البداية)
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [search, category, sort, isOnSale]);

  // ✅ تحديث URL عند تغيير التصفيات
  useEffect(() => {
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (category) params.set("category", category);
    if (sort && sort !== "newest") params.set("sort", sort);
    if (isOnSale) params.set("onSale", "true");
    setSearchParams(params, { replace: true });
  }, [search, category, sort, isOnSale, setSearchParams]);

  const handleSearch = useCallback((e: React.FormEvent) => {
    e.preventDefault();
  }, []);

  const clearFilters = useCallback(() => {
    setSearch("");
    setCategory("");
    setSort("newest");
    setIsOnSale(false);
  }, []);

  const handleSortChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const value = e.target.value;
      if (isValidSort(value)) {
        setSort(value);
      }
    },
    []
  );

  const handleAddToCart = useCallback(
    (product: Product) => {
      const variantId = product.variants[0]?.id;
      if (!variantId) {
        toast.error(t("product.outOfStock"));
        return;
      }
      addToCart({
        productId: product.id,
        variantId: variantId,
        quantity: 1,
      });
    },
    [addToCart, t]
  );

  return (
    <PageContainer>
      <Seo
        title={t("common.products") + " - ProStore"}
        description={t("common.products") + " - ProStore"}
      />

      {/* ✅ شريط الفلاتر (يبقى ثابتاً في الأعلى) */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="flex flex-col sm:flex-row mb-6 gap-4 items-center justify-between w-full"
      >
        <div className="flex flex-col sm:flex-row gap-8 justify-between pt-8">
          <form onSubmit={handleSearch} className="flex-1 flex gap-6 w-full">
            <div className="relative flex-1 w-130">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={t("common.search")}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              />
            </div>
          </form>

          <div className="flex gap-2">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            >
              <option value="">{t("common.allCategories")}</option>
              {categoryData?.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>

            <select
              value={sort}
              onChange={handleSortChange}
              className="px-2 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            >
              {SORT_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {t(`sort.${option.value}`)}
                </option>
              ))}
            </select>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="onSale"
                checked={isOnSale}
                onChange={(e) => setIsOnSale(e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
              />
              <label
                htmlFor="onSale"
                className="text-sm text-gray-700 dark:text-gray-300 whitespace-nowrap"
              >
                {t("common.onSale")}
              </label>
            </div>

            {(search || category || sort !== "newest" || isOnSale) && (
              <button
                onClick={clearFilters}
                className="px-3 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
        <h1 className="text-xl md:text-2xl lg:text-3xl font-semibold">
          : {t("common.products")}
        </h1>
      </motion.div>

      {/* ✅ شبكة المنتجات */}
      <ProductGrid
        products={products}
        loading={isLoading}
        onAddToCart={handleAddToCart}
        onToggleWishlist={(product) => {
          if (isInWishlist(product.id)) {
            removeFromWishlist(product.id);
          } else {
            addToWishlist({ productId: product.id });
          }
        }}
        isInWishlist={isInWishlist}
        columns={{ default: 1, sm: 2, md: 3, lg: 4 }}
      />

      {/* ✅ عدّاد المنتجات */}
      {!isLoading && !isEmpty(products) && (
        <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-6">
          {t("common.showing")} {products.length} {t("common.of")}{" "}
          {totalProducts} {t("common.products")}
        </p>
      )}

      {/* ✅ Sentinel: منطقة المراقبة لتحميل المزيد */}
      {hasNextPage && (
        <div
          ref={loadMoreRef}
          className="flex items-center justify-center py-8"
        >
          {isFetchingNextPage ? (
            <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span className="text-sm">{t("common.loading")}</span>
            </div>
          ) : (
            <div className="h-8" /> // مساحة فارغة لتفعيل المراقبة
          )}
        </div>
      )}

      {/* ✅ رسالة عدم وجود المزيد */}
      {!hasNextPage && !isLoading && !isEmpty(products) && (
        <p className="text-center text-sm text-gray-400 dark:text-gray-500 py-8">
          {t("common.noMoreProducts")}
        </p>
      )}

      {/* ✅ عرض الخطأ */}
      {error && (
        <div className="text-center py-12">
          <p className="text-red-600">{t("common.error")}</p>
          <button
            onClick={() => refetch()}
            className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
          >
            {t("common.retry")}
          </button>
        </div>
      )}
    </PageContainer>
  );
};
