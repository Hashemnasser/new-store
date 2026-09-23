// src/features/products/constants/sort.constants.ts

import { z } from "zod";

// ============================================================
// 🔄 خيارات الترتيب (Sort Options)
// ============================================================

export const SORT_OPTIONS = [
  { value: "newest", label: "الأحدث" },
  { value: "price-asc", label: "السعر: من الأقل للأعلى" },
  { value: "price-desc", label: "السعر: من الأعلى للأقل" },
  { value: "title-asc", label: "الاسم: أ-ي" },
  { value: "title-desc", label: "الاسم: ي-أ" },
] as const;
export type SortOption = (typeof SORT_OPTIONS)[number]["value"];
// ✅ الطريقة السهلة: اكتب النوع يدوياً
// export type SortOption = "newest" | "price-asc" | "price-desc" | "title-asc" | "title-desc"
// [number] يحول النوع من مصفوفة الى اجتماع انواع كل عناصر المصفوفة
//اي اذا مثال:::
//  const  SORT_OPTIONS_VALUE = SORT_OPTIONS.map(s=>s.value) as const
//  type SORTOPTIONSVALUE  = typeof SORT_OPTIONS_VALUE   ----->  ["newest" , "price-asc" , "price-desc" , "title-asc" , "title-desc"]
// //  type SORTOPTIONSVALUE  = (typeof SORT_OPTIONS_VALUE)[number]   ----->  "newest" | "price-asc" | "price-desc" | "title-asc" | "title-desc"

// ✅ مخطط Zod للتحقق
export const sortSchema = z.enum([
  "newest",
  "price-asc",
  "price-desc",
  "title-asc",
  "title-desc",
]);

// ✅ دالة مساعدة للتحقق الآمن
export function isValidSort(
  value: string | null | undefined
): value is SortOption {
  if (!value) return false;
  return sortSchema.safeParse(value).success;
}
