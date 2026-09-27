"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllCategories = getAllCategories;
exports.createCategory = createCategory;
exports.editCategory = editCategory;
exports.deleteCategory = deleteCategory;
const app_error_1 = require("../errors/app-error.js");
const prisma_1 = require("../lib/prisma");
async function getAllCategories() {
    return prisma_1.prisma.category.findMany({
        orderBy: {
            name: "asc",
        },
    });
}
async function createCategory(name) {
    const existingCategory = await prisma_1.prisma.category.findUnique({
        where: {
            name,
        },
    });
    if (existingCategory) {
        throw (0, app_error_1.createError)("CONFLICT", "Category already exists");
    }
    return prisma_1.prisma.category.create({
        data: {
            name,
            slug: createSlug(name),
        },
    });
}
function createSlug(name) {
    return name.trim().toLowerCase().replace(/\s+/g, "-");
}
async function editCategory(id, name) {
    const existingCategory = await prisma_1.prisma.category.findUnique({
        where: {
            id,
        },
    });
    if (!existingCategory) {
        throw (0, app_error_1.createError)("NOT_FOUND", "Category not found");
    }
    const updatedCat = prisma_1.prisma.category.update({
        where: { id },
        data: { name },
    });
    return updatedCat;
}
async function deleteCategory(id) {
    const isExistting = await prisma_1.prisma.category.findUnique({
        where: { id },
    });
    if (!isExistting)
        throw (0, app_error_1.createError)("NOT_FOUND", "Category not found");
    await prisma_1.prisma.category.delete({
        where: { id },
    });
    return { message: "category deleted seccessfully" };
}
