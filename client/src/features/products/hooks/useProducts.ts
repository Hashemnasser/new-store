// src/features/products/hooks/useProducts.ts

import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { productsApi } from "../api/products.api";
import type {
  CreateProductInput,
  Product,
  ProductsFilters,
  UpdateProductInput,
} from "../types/product.types";

// ============================================================
// 🪝 Hook لجلب المنتجات مع التصفية والترقيم
// ============================================================

export const useProducts = (filters?: ProductsFilters) => {
  return useQuery({
    queryKey: ["products", filters],
    queryFn: () => productsApi.getAll(filters),
    staleTime: 5 * 60 * 1000,
  });
};

// ============================================================
// 🪝 Hook للتحميل اللانهائي (Infinite Scroll)
// ============================================================

export const useInfiniteProducts = (
  filters?: Omit<ProductsFilters, "page" | "limit">,
  limit: number = 12
) => {
  return useInfiniteQuery({
    queryKey: ["products", "infinite", filters, limit],
    queryFn: ({ pageParam = 1 }) =>
      productsApi.getAll({ ...filters, page: pageParam, limit }),
    getNextPageParam: (lastPage) => {
      const { page, totalPages } = lastPage.pagination;
      return page < totalPages ? page + 1 : undefined;
    },
    initialPageParam: 1,
    staleTime: 5 * 60 * 1000,
  });
};
// ============================================================
// 🪝 Hook لجلب منتج واحد
// ============================================================

export const useProduct = (slug: string) => {
  return useQuery<Product>({
    queryKey: ["product", slug],
    queryFn: () => productsApi.getBySlug(slug),
    enabled: !!slug,
    staleTime: 10 * 60 * 1000,
  });
};

// ============================================================
// ➕ إنشاء منتج جديد (Mutation)
// ============================================================

export const useCreateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation<Product, Error, CreateProductInput>({
    mutationFn: (data) => productsApi.create(data),
    onSuccess: (product) => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success("تم إضافة المنتج بنجاح");
      console.log("product%%%%%%%%%::", product);
    },
    onError: (error: any) => {
      // ✅ استخراج رسالة الخطأ من الباك إند
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "حدث خطأ أثناء إضافة المنتج";
      toast.error(message);
      console.error("❌ Create product error:", error?.response?.data || error);
    },
  });
};

// ============================================================
// ✏️ تحديث منتج (Mutation)
// ============================================================

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();
  return useMutation<
    Product,
    Error,
    { slug: string; data: UpdateProductInput }
  >({
    mutationFn: ({ slug, data }) => productsApi.update(slug, data),
    onSuccess: (product) => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["admin"] });

      queryClient.invalidateQueries({ queryKey: ["product", product.slug] });
      toast.success("تم تحديث المنتج بنجاح");
    },
    onError: (error: Error) => {
      toast.error(error.message || "حدث خطأ أثناء تحديث المنتج");
    },
  });
};

// ============================================================
// 🗑️ حذف منتج (Mutation)
// ============================================================

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();
  return useMutation<{ message: string }, Error, string>({
    mutationFn: (id) => productsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success("تم حذف المنتج بنجاح");
    },
    onError: (error: Error) => {
      toast.error(error.message || "حدث خطأ أثناء حذف المنتج");
    },
  });
};

/**
 * جلب المنتجات المميزة
 */
export const useFeaturedProducts = (limit: number = 8) => {
  return useQuery<Product[]>({
    queryKey: ["products", "featured", limit],
    queryFn: () => productsApi.getFeatured(limit),
    staleTime: 5 * 60 * 1000, // 5 دقائق
  });
};

/**
 * جلب المنتجات الأكثر مبيعاً
 */
export const useTopSellingProducts = (limit: number = 8) => {
  return useQuery<Product[]>({
    queryKey: ["products", "top-selling", limit],
    queryFn: () => {
      return productsApi.getTopSelling(limit);
    },
    staleTime: 5 * 60 * 1000,
  });
};

export const useSortOptions = () => {
  const { t } = useTranslation();
  return [
    { value: "newest", label: t("newest") },
    { value: "price-asc", label: t("priceLowToHigh") },
    { value: "price-desc", label: t("priceHighToLow") },
    { value: "title-asc", label: t("nameAsc") },
    { value: "title-desc", label: t("nameDesc") },
  ];
};
