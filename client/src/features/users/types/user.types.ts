// src/features/users/types/user.types.ts

import type { User } from "../../../types/common.types";

// يمكننا إعادة استخدام User من common.types
// لكن قد نحتاج إلى أنواع إضافية للـ API
export interface UpdateUserRolePayload {
  role: "USER" | "ADMIN";
}

export interface UpdateUserProfilePayload {
  name?: string;
  email?: string;
  image?: string;
}

// استجابة قائمة المستخدمين (قد تكون مباشرة)
export type UsersResponse = User[];
