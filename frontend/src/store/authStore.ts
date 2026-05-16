import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User, Role } from "@/types";
import { authUsers } from "@/data/mockData";

interface AuthStore {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  clearError: () => void;
  hasRole: (...roles: Role[]) => boolean;
  canAccess: (module: string) => boolean;
}

const ROLE_PERMISSIONS: Record<Role, string[]> = {
  SUPER_ADMIN:   ["dashboard", "rooms", "bookings", "kitchen", "orders", "accounting", "reports", "guests", "staff", "settings"],
  MANAGER:       ["dashboard", "rooms", "bookings", "kitchen", "orders", "accounting", "reports", "guests"],
  KITCHEN_HEAD:  ["kitchen", "orders", "dashboard"],
  RECEPTION:     ["dashboard", "bookings", "rooms", "guests", "orders"],
  KITCHEN_STAFF: ["kitchen", "orders"],
  ACCOUNTANT:    ["dashboard", "accounting", "reports", "bookings"],
};

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (email, password) => {
        set({ isLoading: true, error: null });
        await new Promise((r) => setTimeout(r, 800));

        const found = authUsers.find(
          (u) => u.email === email && u.password === password
        );

        if (!found) {
          set({ isLoading: false, error: "Invalid email or password" });
          return false;
        }

        const { password: _pw, ...user } = found;
        const token = `mock-jwt-${user.id}-${Date.now()}`;

        set({ user, token, isAuthenticated: true, isLoading: false, error: null });
        return true;
      },

      logout: () => {
        set({ user: null, token: null, isAuthenticated: false });
      },

      clearError: () => set({ error: null }),

      hasRole: (...roles) => {
        const { user } = get();
        return user ? roles.includes(user.role) : false;
      },

      canAccess: (module) => {
        const { user } = get();
        if (!user) return false;
        return ROLE_PERMISSIONS[user.role]?.includes(module) ?? false;
      },
    }),
    {
      name: "vt-auth",
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
