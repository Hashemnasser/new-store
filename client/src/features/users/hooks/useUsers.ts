// src/features/users/hooks/useUsers.ts

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { User } from "../../../types/common.types";
import { usersApi } from "../api/users.api";

// ============================================================
// 👥 Hooks الخاصة بإدارة المستخدمين (للمدير)
// ============================================================

// جلب جميع المستخدمين
export const useAllUsers = () => {
  return useQuery<User[]>({
    queryKey: ["users", "admin", "all"],
    queryFn: () => usersApi.getAllUsers(),
    staleTime: 2 * 60 * 1000, // 2 دقائق
  });
};

// جلب مستخدم محدد
export const useUserById = (id: string) => {
  return useQuery<User>({
    queryKey: ["users", id],
    queryFn: () => usersApi.getUserById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
};

// تحديث دور المستخدم
export const useUpdateUserRole = () => {
  const queryClient = useQueryClient();

  return useMutation<User, Error, { userId: string; role: "USER" | "ADMIN" }>({
    mutationFn: ({ userId, role }) => usersApi.updateUserRole(userId, { role }),
    onSuccess: (_, _variables) => {
      queryClient.invalidateQueries({ queryKey: ["users", "admin", "all"] });
      toast.success("تم تحديث دور المستخدم بنجاح");
    },
    onError: (error: Error) => {
      toast.error(error.message || "حدث خطأ أثناء تحديث الدور");
    },
  });
};

// حذف مستخدم
export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation<{ message: string }, Error, string>({
    mutationFn: (userId: string) => usersApi.deleteUser(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users", "admin", "all"] });
      toast.success("تم حذف المستخدم بنجاح");
    },
    onError: (error: Error) => {
      toast.error(error.message || "حدث خطأ أثناء حذف المستخدم");
    },
  });
};

// تحديث بيانات مستخدم (للمدير)
export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation<
    User,
    Error,
    { userId: string; data: { name?: string; email?: string; image?: string } }
  >({
    mutationFn: ({ userId, data }) => usersApi.updateUser(userId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users", "admin", "all"] });
      toast.success("تم تحديث بيانات المستخدم بنجاح");
    },
    onError: (error: Error) => {
      toast.error(error.message || "حدث خطأ أثناء تحديث البيانات");
    },
  });
};
