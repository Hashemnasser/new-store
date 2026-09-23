import { Request, Response } from "express";

import { idParamsSchema } from "@/validators/product.validator";
import {
  createCategory,
  deleteCategory,
  editCategory,
  getAllCategories,
} from "../services/category.service";
import { asyncHandler } from "../utils/asyncHandler";

export const getCategories = asyncHandler(
  async (_req: Request, res: Response) => {
    const categories = await getAllCategories();

    res.status(200).json({
      success: true,
      data: categories,
    });
  }
);

export const storeCategory = asyncHandler(
  async (req: Request, res: Response) => {
    const { name } = req.body;

    const category = await createCategory(name);

    res.status(201).json({
      success: true,
      data: category,
    });
  }
);

export const updateCategory = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = idParamsSchema.parse(req.params);

    const { name } = req.body;
    const updatedCategory = await editCategory(id, name);

    res.json({
      success: true,
      data: updatedCategory,
    });
  }
);

export const deleteOneCategory = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = idParamsSchema.parse(req.params);
    const deletedCategory = await deleteCategory(id);
    res.json({
      success: true,
      ...deletedCategory,
    });
  }
);
