// // src/providers/AuthProvider.tsx

// import React, { createContext, useContext, useEffect, useState } from "react";
// import type { User } from "../types/common.types";

// // ============================================================
// // 🔐 أنواع الـ Context
// // ============================================================

// interface AuthContextType {
//   user: User | null;
//   token: string | null;
//   isLoading: boolean;
//   isAuthenticated: boolean;
//   login: (token: string, user: User) => void;
//   logout: () => void;
//   updateUser: (user: User) => void;
// }

// // ============================================================
// // 🏗️ إنشاء الـ Context
// // ============================================================

// const AuthContext = createContext<AuthContextType | undefined>(undefined);

// export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
//   const [user, setUser] = useState<User | null>(null);
//   const [token, setToken] = useState<string | null>(null);
//   const [isLoading, setIsLoading] = useState(true);

//   // ============================================================
//   // 🧠 تحميل المستخدم عند بدء التطبيق
//   // ============================================================

//   useEffect(() => {
//     const loadUser = async () => {
//       const storedToken = localStorage.getItem("token");
//       const storedUser = localStorage.getItem("user");

//       if (storedToken && storedUser) {
//         try {
//           setToken(storedToken);
//           setUser(JSON.parse(storedUser));
//         } catch {
//           localStorage.removeItem("token");
//           localStorage.removeItem("user");
//         } finally {
//           setIsLoading(false);
//         }
//       }
//     };

//     loadUser();
//   }, []);

//   // ============================================================
//   // ✅ دوال المصادقة
//   // ============================================================

//   const login = (newToken: string, newUser: User) => {
//     setToken(newToken);
//     setUser(newUser);
//     localStorage.setItem("token", newToken);
//     localStorage.setItem("user", JSON.stringify(newUser));
//   };

//   const logout = () => {
//     setToken(null);
//     setUser(null);
//     localStorage.removeItem("token");
//     localStorage.removeItem("user");
//   };

//   const updateUser = (updatedUser: User) => {
//     setUser(updatedUser);
//     localStorage.setItem("user", JSON.stringify(updatedUser));
//   };

//   // ============================================================
//   // 📦 القيم المصدرة
//   // ============================================================

//   const value = {
//     user,
//     token,
//     isLoading,
//     isAuthenticated: !!user && !!token,
//     login,
//     logout,
//     updateUser,
//   };

//   return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
// };

// // ============================================================
// // 🪝 Hook لاستخدام المصادقة
// // ============================================================

// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (!context) {
//     throw new Error("useAuth must be used within an AuthProvider");
//   }
//   return context;
// };

// src/providers/AuthProvider.tsx

import React, { createContext, useContext, useEffect, useState } from "react";
import type { User } from "../types/common.types";

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
  updateUser: (user: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadUser = () => {
      try {
        const storedToken = localStorage.getItem("token");
        const storedUser = localStorage.getItem("user");

        console.log("🔍 AuthProvider - Loading user from localStorage");
        console.log("🔍 AuthProvider - storedToken:", storedToken);
        console.log("🔍 AuthProvider - storedUser:", storedUser);

        if (storedToken && storedUser) {
          setToken(storedToken);
          setUser(JSON.parse(storedUser));
          console.log("✅ AuthProvider - User loaded successfully");
        } else {
          console.log("❌ AuthProvider - No user found in localStorage");
        }
      } catch (error) {
        console.error("❌ AuthProvider - Error loading user:", error);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();
  }, []);

  const login = (newToken: string, newUser: User) => {
    console.log("🔍 AuthProvider - login called");
    console.log("🔍 AuthProvider - newToken:", newToken);
    console.log("🔍 AuthProvider - newUser:", newUser);

    setToken(newToken);
    setUser(newUser);
    localStorage.setItem("token", newToken);
    localStorage.setItem("user", JSON.stringify(newUser));
    setIsLoading(false);

    console.log("✅ AuthProvider - User logged in successfully");
  };

  const logout = () => {
    console.log("🔍 AuthProvider - logout called");
    setToken(null);
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsLoading(false);
    console.log("✅ AuthProvider - User logged out");
  };

  const updateUser = (updatedUser: User) => {
    console.log("🔍 AuthProvider - updateUser called");
    setUser(updatedUser);
    localStorage.setItem("user", JSON.stringify(updatedUser));
    console.log("✅ AuthProvider - User updated");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        isAuthenticated: !!user && !!token, // ✅ تحسب ديناميكياً
        login,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
