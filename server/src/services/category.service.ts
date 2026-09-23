import { createError } from "@/errors/app-error";
import { prisma } from "../lib/prisma";

export async function getAllCategories() {
  return prisma.category.findMany({
    orderBy: {
      name: "asc",
    },
  });
}

export async function createCategory(name: string) {
  const existingCategory = await prisma.category.findUnique({
    where: {
      name,
    },
  });

  if (existingCategory) {
    throw createError("CONFLICT", "Category already exists");
  }

  return prisma.category.create({
    data: {
      name,
      slug: createSlug(name),
    },
  });
}

function createSlug(name: string) {
  return name.trim().toLowerCase().replace(/\s+/g, "-");
}

export async function editCategory(id: string, name: string) {
  const existingCategory = await prisma.category.findUnique({
    where: {
      id,
    },
  });
  if (!existingCategory) {
    throw createError("NOT_FOUND", "Category not found");
  }
  const updatedCat = prisma.category.update({
    where: { id },
    data: { name },
  });
  return updatedCat;
}

export async function deleteCategory(id: string) {
  const isExistting = await prisma.category.findUnique({
    where: { id },
  });

  if (!isExistting) throw createError("NOT_FOUND", "Category not found");

  await prisma.category.delete({
    where: { id },
  });
  return { message: "category deleted seccessfully" };
}
