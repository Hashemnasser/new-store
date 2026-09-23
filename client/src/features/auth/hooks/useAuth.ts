// // src/features/auth/hooks/useAuth.ts

// import { useAuthStore } from "../../../store/auth.store";

// // ============================================================
// // 🪝 Hook مخصص لاستخدام المصادقة
// // ============================================================

// export const useAuth = () => {
//   const {
//     user,
//     token,
//     isAuthenticated,
//     isLoading,
//     login,
//     register,
//     logout,
//     getUserProfile,
//     updateUser,
//   } = useAuthStore();

//   return {
//     user,
//     token,
//     isAuthenticated,
//     isLoading,
//     login,
//     register,
//     logout,
//     getUserProfile,
//     updateUser,
//   };
// };

// export default useAuth;

// src/features/auth/hooks/useAuth.ts
// src/features/auth/hooks/useAuth.ts

import { useAuthStore } from "../../../store/auth.store";

export const useAuth = () => {
  const {
    user,
    token,
    isAuthenticated,
    isLoading,
    login,
    register,
    logout,
    getUserProfile,
    updateUser,
    changePassword,
  } = useAuthStore();

  console.log("🔍 useAuth - user:", user);
  console.log("🔍 useAuth - token:", token);
  console.log("🔍 useAuth - isAuthenticated:", isAuthenticated);
  console.log("🔍 useAuth - isLoading:", isLoading);

  return {
    user,
    token,
    isAuthenticated,
    isLoading,
    login,
    register,
    logout,
    getUserProfile,
    updateUser,
    changePassword,
  };
};

export default useAuth;
