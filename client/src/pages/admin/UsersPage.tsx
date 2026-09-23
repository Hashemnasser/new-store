// src/pages/admin/UsersPage.tsx

import { motion } from "framer-motion";
import { Shield, Trash2, Users } from "lucide-react";
import { useCallback, useMemo } from "react";
import { PageContainer } from "../../components/layout/PageContainer";
import {
  useAllUsers,
  useDeleteUser,
  useUpdateUserRole,
} from "../../features/users/hooks/useUsers";
import type { User } from "../../types/common.types";
import { formatDate } from "../../utils/date";
import { isEmpty } from "../../utils/helpers";

export const AdminUsersPage = () => {
  const { data, isLoading, error } = useAllUsers();
  console.log("users......:", data);
  const deleteUser = useDeleteUser();
  const updateUserRole = useUpdateUserRole();

  // ✅ التأكد من أن users مصفوفة (حتى لو كانت فارغة)
  const users: User[] = useMemo(
    () => (Array.isArray(data) ? data : []),
    [data]
  );

  const handleDeleteUser = useCallback(
    (userId: string) => {
      if (window.confirm("هل أنت متأكد من حذف هذا المستخدم؟")) {
        deleteUser.mutate(userId);
      }
    },
    [deleteUser]
  );

  const handleToggleRole = useCallback(
    (userId: string, currentRole: string) => {
      const newRole = currentRole === "ADMIN" ? "USER" : "ADMIN";
      updateUserRole.mutate({ userId, role: newRole });
    },
    [updateUserRole]
  );

  if (isLoading) {
    return (
      <PageContainer>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
        </div>
      </PageContainer>
    );
  }

  if (error) {
    return (
      <PageContainer>
        <div className="text-center py-12">
          <p className="text-red-600">حدث خطأ أثناء جلب المستخدمين</p>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold  flex items-center gap-2">
            <Users className="w-6 h-6" />
            إدارة المستخدمين
          </h1>
          <span className="text-sm text-gray-500! ">
            إجمالي المستخدمين: {users.length || 0}
          </span>
        </div>

        {isEmpty(users) ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">👤</div>
            <h2 className="text-xl font-medium text-gray-700 dark:text-gray-300 mb-2">
              لا توجد مستخدمين
            </h2>
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 dark:bg-gray-700/50">
                  <tr>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      المستخدم
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      البريد الإلكتروني
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      الدور
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      تاريخ التسجيل
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      الإجراءات
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {users.map((user) => (
                    <tr
                      key={user.id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition"
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-white flex items-center justify-center text-sm font-bold">
                            {user.name?.[0]?.toUpperCase() || "U"}
                          </div>
                          <span className="text-gray-900 dark:text-white">
                            {user.name}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-gray-500 dark:text-gray-400">
                        {user.email}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded-full ${
                            user.role === "ADMIN"
                              ? "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300"
                              : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
                          }`}
                        >
                          {user.role === "ADMIN" ? "مدير" : "مستخدم"}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-500 dark:text-gray-400">
                        {formatDate(user.createdAt)}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleToggleRole(user.id, user.role)}
                            className="p-1 text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300 rounded-lg hover:bg-purple-50 dark:hover:bg-purple-900/20 transition"
                            title="تغيير الدور"
                          >
                            <Shield className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteUser(user.id)}
                            disabled={deleteUser.isPending}
                            className="p-1 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition disabled:opacity-50"
                            title="حذف"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </motion.div>
    </PageContainer>
  );
};
