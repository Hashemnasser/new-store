// src/types/react-query.types.ts

// ============================================================
// 📦 أنواع React Query (سيتم إضافتها لاحقاً)
// ============================================================

import { UseQueryResult } from "@tanstack/react-query";

export type TypedUseQueryResult<TData, TError = Error> = UseQueryResult<
  TData,
  TError
>;
