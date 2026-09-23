// src/features/products/api/products.api.ts (تعديل)
import http from "../../../services/http";
import type {
  CreateProductInput,
  Product,
  ProductsFilters,
  ProductsResponse,
  UpdateProductInput,
} from "../types/product.types";

export const productsApi = {
  getAll: async (filters?: ProductsFilters): Promise<ProductsResponse> => {
    const params: any = { ...filters };
    if (filters?.isOnSale !== undefined) {
      params.isOnSale = String(filters.isOnSale);
    }
    return http.get("/products", { params });
  },
  getBySlug: async (slug: string): Promise<Product> => {
    return http
      .get<{ success: boolean; data: Product }>(`/product/${slug}`)
      .then((res) => res.data);
  },
  create: async (data: CreateProductInput): Promise<Product> => {
    return http.post("/products", data).then((res) => res.data);
  },
  update: async (slug: string, data: UpdateProductInput): Promise<Product> => {
    return http.patch(`/product/${slug}`, data).then((res) => res.data);
  },
  getFeatured: async (limit: number = 8): Promise<Product[]> => {
    return http
      .get<{ success: boolean; data: Product[] }>(
        `/products/featured?limit=${limit}`
      )
      .then((res) => res.data);
  },
  getTopSelling: async (limit: number = 8): Promise<Product[]> => {
    return http
      .get<{ success: boolean; data: Product[] }>(
        `/products/top-selling?limit=${limit}`
      )
      .then((res) => res.data);
  },
  delete: async (
    id: string
  ): Promise<{ success: boolean; message: string }> => {
    return http.delete<{ success: boolean; message: string }>(`/product/${id}`);
  },
};
