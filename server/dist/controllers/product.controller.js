"use strict";
// // src/controllers/product.controller.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTopSellingProductsHandler = exports.getFeaturedProductsHandler = exports.getAllProducts = exports.deleteOneProduct = exports.updateOneProduct = exports.createOneProduct = exports.getOneProduct = void 0;
const product_service_1 = require("../services/product.service.js");
const asyncHandler_1 = require("../utils/asyncHandler.js");
const validation_1 = require("../utils/validation.js");
const product_validator_1 = require("../validators/product.validator.js");
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
exports.getOneProduct = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { slug } = product_validator_1.slugParamsSchema.parse(req.params);
    const product = await (0, product_service_1.getProductBySlug)(slug);
    console.log("product  server", product);
    res.json({
        success: true,
        data: product,
    });
});
exports.createOneProduct = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const data = product_validator_1.createProductSchema.parse(req.body);
    const product = await (0, product_service_1.createProduct)(data);
    res.status(201).json({
        success: true,
        message: "Product created successfully",
        data: product,
    });
});
// ✅ تحديث بواسطة slug
exports.updateOneProduct = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { slug } = product_validator_1.slugParamsSchema.parse(req.params);
    const data = product_validator_1.updateProductSchema.parse(req.body);
    const product = await (0, product_service_1.updateProduct)(slug, data);
    res.json({
        success: true,
        data: product,
    });
});
// ✅ حذف بواسطة slug
exports.deleteOneProduct = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { id } = product_validator_1.idParamsSchema.parse(req.params);
    if (!id) {
        return res.status(400).json({
            success: false,
            message: "Product ID is required",
        });
    }
    const result = await (0, product_service_1.deleteProduct)(id);
    res.json({
        success: true,
        ...result,
    });
});
exports.getAllProducts = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    // 1. استخراج المعاملات من req.query
    const { search, category, sort, page = "1", limit = "12", isOnSale, } = req.query;
    // 2. تحويل القيم إلى الأنواع المناسبة
    const pageNumber = parseInt(page, 10) || 1;
    const limitNumber = parseInt(limit, 10) || 12;
    // 3. التحقق من صحة قيمة الترتيب (اختياري)
    const sortOption = (0, validation_1.isValidSort)(sort)
        ? sort
        : "newest";
    const isOnSaleFilter = isOnSale === "true" ? true : undefined;
    // 4. استدعاء خدمة المنتجات مع المعاملات
    const result = await (0, product_service_1.getProducts)({
        search: search,
        category: category,
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
});
// ... الدوال الموجودة ...
exports.getFeaturedProductsHandler = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const limit = req.query.limit ? parseInt(req.query.limit, 10) : 8;
    const products = await (0, product_service_1.getFeaturedProducts)(limit);
    res.json({ success: true, data: products });
});
exports.getTopSellingProductsHandler = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    console.log("getTopSellingProductsHandler....");
    const limit = req.query.limit ? parseInt(req.query.limit, 10) : 8;
    console.log("getTopSellingProductsHandler....", limit);
    const products = await (0, product_service_1.getTopSellingProducts)(limit);
    console.log("getTopSellingProductsHandler....", products);
    res.json({ success: true, data: products });
});
