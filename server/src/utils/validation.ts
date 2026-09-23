// src/utils/validation.ts
const SORT_OPTIONS = [
  "newest",
  "price-asc",
  "price-desc",
  "title-asc",
  "title-desc",
];

export const isValidSort = (value: string): boolean => {
  return SORT_OPTIONS.includes(value);
};
