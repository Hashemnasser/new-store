// src/store/auth.store.ts
// src/store/auth.store.ts
// src/store/auth.store.ts
// src/store/auth.store.ts

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { authApi } from "../features/auth/api/auth.api";
import type { AuthState } from "../features/auth/types/auth.types";
import type { User } from "../types/common.types";

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,

      login: async (email: string, password: string) => {
        console.log("🔍 Store - login called with:", email);
        set({ isLoading: true });
        try {
          const response = await authApi.login({ email, password });
          console.log("✅ Store - Full login response:", response);

          // ✅ استخراج token و user من response.data
          const { token, user } = response.data;
          console.log("✅ Store - Token:", token);
          console.log("✅ Store - User:", user);

          if (!token || !user) {
            throw new Error("Invalid login response: missing token or user");
          }

          localStorage.setItem("token", token);
          localStorage.setItem("user", JSON.stringify(user));

          set({
            user,
            token,
            isAuthenticated: true,
            isLoading: false,
          });

          console.log("✅ Store - Token and user saved to localStorage");
        } catch (error) {
          console.error("❌ Store - Login error:", error);
          set({ isLoading: false });
          throw error;
        }
      },
      changePassword: async (currentPassword: string, newPassword: string) => {
        console.log("Store...change Password");
        set({ isLoading: true });
        try {
          const response = await authApi.changePassword({
            currentPassword,
            newPassword,
          });
          console.log("✅ Store - change password response:", response);
          const { message } = response;
          set({ isLoading: false });
          return { message };
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },
      register: async (name: string, email: string, password: string) => {
        console.log("🔍 Store - register called");
        set({ isLoading: true });
        try {
          const response = await authApi.register({ name, email, password });
          console.log("✅ Store - Register response:", response);

          // ✅ استخراج token و user من response.data
          const { token, user } = response.data;

          if (!token || !user) {
            throw new Error("Invalid register response: missing token or user");
          }

          localStorage.setItem("token", token);
          localStorage.setItem("user", JSON.stringify(user));

          set({
            user,
            token,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error) {
          console.error("❌ Store - Register error:", error);
          set({ isLoading: false });
          throw error;
        }
      },

      logout: () => {
        console.log("🔍 Store - logout called");
        authApi.logout();
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          isLoading: false,
        });
        console.log("✅ Store - Logout successful");
      },

      // src/store/auth.store.ts

      getUserProfile: async () => {
        console.log("🔍 Store - getUserProfile called");
        const { token } = get();
        if (!token) {
          console.log("❌ Store - No token found");
          return;
        }

        set({ isLoading: true });
        try {
          const response = await authApi.getProfile();
          console.log("✅ Store - Profile response:", response);

          // ✅ response.data هو User مباشرة
          const user = response.data;
          if (!user) {
            throw new Error("Invalid profile response: missing user");
          }

          set({
            user,
            isAuthenticated: true,
            isLoading: false,
          });
          localStorage.setItem("user", JSON.stringify(user));
          console.log("✅ Store - Profile fetched successfully");
        } catch (error) {
          console.error("❌ Store - Get profile error:", error);
          set({ isLoading: false });
          throw error;
        }
      },

      updateUser: (user: User) => {
        console.log("🔍 Store - updateUser called");
        set({ user });
        localStorage.setItem("user", JSON.stringify(user));
        console.log("✅ Store - User updated");
      },
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        token: state.token,
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          if (!state.user || !state.token) {
            state.isAuthenticated = false;
          } else {
            state.isAuthenticated = true;
          }
          console.log("🔍 Store - Rehydrated state:", state);
        }
      },
    }
  )
);
