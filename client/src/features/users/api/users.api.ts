// src/features/users/api/users.api.ts

import http from "../../../services/http";
import type { User } from "../../../types/common.types";
import type { UpdateUserRolePayload } from "../types/user.types";

// ============================================================
// 👥 دوال API الخاصة بإدارة المستخدمين (للمدير)
// ============================================================

export const usersApi = {
  // جلب جميع المستخدمين (للمدير)
  getAllUsers: (): Promise<User[]> => {
    return http
      .get<{ success: boolean; data: User[] }>("/users/admin/all")
      .then((res) => res.data);
  },

  // جلب مستخدم محدد (للمدير)
  getUserById: (id: string): Promise<User> => {
    return http.get<User>(`/users/admin/${id}`);
  },

  // تحديث دور المستخدم (للمدير)
  updateUserRole: (id: string, data: UpdateUserRolePayload): Promise<User> => {
    return http.patch<User>(`/users/admin/${id}/role`, data);
  },

  // حذف مستخدم (للمدير)
  deleteUser: (id: string): Promise<{ message: string }> => {
    return http.delete<{ message: string }>(`/users/admin/${id}`);
  },

  // تحديث بيانات مستخدم (للمدير)
  updateUser: (
    id: string,
    data: { name?: string; email?: string; image?: string }
  ): Promise<User> => {
    return http.patch<User>(`/users/admin/${id}`, data);
  },
};
