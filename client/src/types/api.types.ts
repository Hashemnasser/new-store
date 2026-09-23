// src/types/api.types.ts

// ============================================================
// 📦 أنواع API (سيتم إضافتها لاحقاً)
// ============================================================

export interface ApiResponse<T = any> {
  success: boolean;
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
