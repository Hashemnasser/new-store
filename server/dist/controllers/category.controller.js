"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteOneCategory = exports.updateCategory = exports.storeCategory = exports.getCategories = void 0;
const product_validator_1 = require("../validators/product.validator.js");
const category_service_1 = require("../services/category.service");
const asyncHandler_1 = require("../utils/asyncHandler");
exports.getCategories = (0, asyncHandler_1.asyncHandler)(async (_req, res) => {
    const categories = await (0, category_service_1.getAllCategories)();
    res.status(200).json({
        success: true,
        data: categories,
    });
});
exports.storeCategory = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { name } = req.body;
    const category = await (0, category_service_1.createCategory)(name);
    res.status(201).json({
        success: true,
        data: category,
    });
});
exports.updateCategory = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { id } = product_validator_1.idParamsSchema.parse(req.params);
    const { name } = req.body;
    const updatedCategory = await (0, category_service_1.editCategory)(id, name);
    res.json({
        success: true,
        data: updatedCategory,
    });
});
exports.deleteOneCategory = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { id } = product_validator_1.idParamsSchema.parse(req.params);
    const deletedCategory = await (0, category_service_1.deleteCategory)(id);
    res.json({
        success: true,
        ...deletedCategory,
    });
});
