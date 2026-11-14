"use strict";
// // src/controllers/product.controller.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTopSellingProductsHandler = exports.getFeaturedProductsHandler = exports.getAllProducts = exports.deleteOneProduct = exports.updateOneProduct = exports.createOneProduct = exports.getOneProduct = void 0;
const product_service_1 = require("../services/product.service.js");
const asyncHandler_1 = require("../utils/asyncHandler.js");
const product_validator_1 = require("../validators/product.validator.js");
exports.getOneProduct = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { slug } = product_validator_1.slugParamsSchema.parse(req.params);
    const product = await (0, product_service_1.getProductBySlug)(slug);
    res.json({
        success: true,
        data: product,
    });
});
exports.createOneProduct = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const data = req.body;
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
    const data = req.body;
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
    // 1. البيانات جاية مفحوصة ومحولة من الـ validateQuery middleware
    //ملاحظة كان فيي جيب السكيما تبع زود واختبر فوراهون بدل ما ادخل بالميدلوير
    //   وانشاء دالة اختبار وتوسيع الريكويست validateQuery(getProductsSchema)
    //لانني لم استخدم دالة تحقق الكويري الا هنا لذلك لست يحاجة لميدوير مثل دالة التحقق  فاليديت تبع البودي التي تستخدم في اماكن كثيرة
    const { search, category, sort, page, limit, isOnSale } = req.validatedQuery;
    // 2. استدعاء خدمة المنتجات (بدون أي تحويلات يدوية)
    const result = await (0, product_service_1.getProducts)({
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
});
// ... الدوال الموجودة ...
exports.getFeaturedProductsHandler = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { limit } = product_validator_1.limitSchema.parse(req.query);
    // const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 8;
    const products = await (0, product_service_1.getFeaturedProducts)(limit);
    res.json({ success: true, data: products });
});
exports.getTopSellingProductsHandler = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { limit } = product_validator_1.limitSchema.parse(req.query);
    const products = await (0, product_service_1.getTopSellingProducts)(limit);
    res.json({ success: true, data: products });
});
