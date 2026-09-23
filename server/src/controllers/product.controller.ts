// // src/controllers/product.controller.ts

import { Request, Response } from "express";

import {
  createProduct,
  deleteProduct,
  getFeaturedProducts,
  getProductBySlug,
  getProducts,
  getTopSellingProducts,
  updateProduct,
} from "@/services/product.service";

import { asyncHandler } from "@/utils/asyncHandler";
import { isValidSort } from "@/utils/validation";
import {
  createProductSchema,
  idParamsSchema,
  slugParamsSchema,
  updateProductSchema,
} from "@/validators/product.validator";

// export const getAllProducts = asyncHandler(
//   async (req: Request, res: Response) => {
//     const params = req.query;
//     console.log("paaaaaaaaaaaaarrrrrrrrrrrraaaaaaaaaaaaaa", params);
//     const products = await getProducts();

//     res.json({
//       success: true,
//       data: products,
//     });
//   }
// );

export const getOneProduct = asyncHandler(
  async (req: Request, res: Response) => {
    const { slug } = slugParamsSchema.parse(req.params);
    const product = await getProductBySlug(slug);
    console.log("product  server", product);

    res.json({
      success: true,
      data: product,
    });
  }
);

export const createOneProduct = asyncHandler(
  async (req: Request, res: Response) => {
    const data = createProductSchema.parse(req.body);

    const product = await createProduct(data);

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      data: product,
    });
  }
);

// ✅ تحديث بواسطة slug
export const updateOneProduct = asyncHandler(async (req, res) => {
  const { slug } = slugParamsSchema.parse(req.params);
  const data = updateProductSchema.parse(req.body);

  const product = await updateProduct(slug, data);

  res.json({
    success: true,
    data: product,
  });
});

// ✅ حذف بواسطة slug
export const deleteOneProduct = asyncHandler(async (req, res) => {
  const { id } = idParamsSchema.parse(req.params);

  if (!id) {
    return res.status(400).json({
      success: false,
      message: "Product ID is required",
    });
  }
  const result = await deleteProduct(id);

  res.json({
    success: true,
    ...result,
  });
});

export const getAllProducts = asyncHandler(
  async (req: Request, res: Response) => {
    // 1. استخراج المعاملات من req.query
    const {
      search,
      category,
      sort,
      page = "1",
      limit = "12",
      isOnSale,
    } = req.query;

    // 2. تحويل القيم إلى الأنواع المناسبة
    const pageNumber = parseInt(page as string, 10) || 1;
    const limitNumber = parseInt(limit as string, 10) || 12;

    // 3. التحقق من صحة قيمة الترتيب (اختياري)
    const sortOption = isValidSort(sort as string)
      ? (sort as string)
      : "newest";
    const isOnSaleFilter = isOnSale === "true" ? true : undefined;
    // 4. استدعاء خدمة المنتجات مع المعاملات
    const result = await getProducts({
      search: search as string,
      category: category as string,
      sort: sortOption,
      page: pageNumber,
      limit: limitNumber,
      isOnSale: isOnSaleFilter,
    });

    // 5. إرجاع النتيجة
    res.json({
      success: true,
      data: result.products,
      pagination: {
        page: pageNumber,
        limit: limitNumber,
        total: result.total,
        totalPages: Math.ceil(result.total / limitNumber),
      },
    });
  }
);

// ... الدوال الموجودة ...

export const getFeaturedProductsHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 8;
    const products = await getFeaturedProducts(limit);
    res.json({ success: true, data: products });
  }
);

export const getTopSellingProductsHandler = asyncHandler(
  async (req: Request, res: Response) => {
    console.log("getTopSellingProductsHandler....");

    const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 8;
    console.log("getTopSellingProductsHandler....", limit);

    const products = await getTopSellingProducts(limit);
    console.log("getTopSellingProductsHandler....", products);
    res.json({ success: true, data: products });
  }
);
