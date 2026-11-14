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
import {
  CreateProductInput,
  GetProductsInput,
  UpdateProductInput,
  idParamsSchema,
  limitSchema,
  slugParamsSchema,
} from "@/validators/product.validator";

export const getOneProduct = asyncHandler(
  async (req: Request, res: Response) => {
    const { slug } = slugParamsSchema.parse(req.params);
    const product = await getProductBySlug(slug);

    res.json({
      success: true,
      data: product,
    });
  }
);

export const createOneProduct = asyncHandler(
  async (req: Request, res: Response) => {
    const data: CreateProductInput = req.body;

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
  const data: UpdateProductInput = req.body;

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
    // 1. البيانات جاية مفحوصة ومحولة من الـ validateQuery middleware
    //ملاحظة كان فيي جيب السكيما تبع زود واختبر فوراهون بدل ما ادخل بالميدلوير
    //   وانشاء دالة اختبار وتوسيع الريكويست validateQuery(getProductsSchema)
    //لانني لم استخدم دالة تحقق الكويري الا هنا لذلك لست يحاجة لميدوير مثل دالة التحقق  فاليديت تبع البودي التي تستخدم في اماكن كثيرة
    const { search, category, sort, page, limit, isOnSale } =
      req.validatedQuery as GetProductsInput;

    // 2. استدعاء خدمة المنتجات (بدون أي تحويلات يدوية)
    const result = await getProducts({
      search,
      category,
      sort,
      page,
      limit,
      isOnSale,
    });

    // 3. إرجاع النتيجة مع بيانات الـ Pagination
    res.json({
      success: true,
      data: result.products,
      pagination: {
        page,
        limit,
        total: result.total,
        totalPages: Math.ceil(result.total / limit),
      },
    });
  }
);
// ... الدوال الموجودة ...

export const getFeaturedProductsHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const { limit } = limitSchema.parse(req.query);
    // const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 8;
    const products = await getFeaturedProducts(limit);
    res.json({ success: true, data: products });
  }
);

export const getTopSellingProductsHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const { limit } = limitSchema.parse(req.query);

    const products = await getTopSellingProducts(limit);
    res.json({ success: true, data: products });
  }
);
