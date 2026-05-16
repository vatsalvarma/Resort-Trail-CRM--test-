import { create } from "zustand";
import type { Notification } from "@/types";
import { notifications as mockNotifications } from "@/data/mockData";

interface UIStore {
  sidebarCollapsed: boolean;
  sidebarMobileOpen: boolean;
  notifications: Notification[];
  unreadCount: number;
  theme: "light" | "dark";

  toggleSidebar: () => void;
  setSidebarMobileOpen: (open: boolean) => void;
  markNotificationRead: (id: string) => void;
  markAllRead: () => void;
  addNotification: (n: Notification) => void;
  setTheme: (theme: "light" | "dark") => void;
}

export const useUIStore = create<UIStore>((set, get) => ({
  sidebarCollapsed: false,
  sidebarMobileOpen: false,
  notifications: mockNotifications,
  unreadCount: mockNotifications.filter((n) => !n.isRead).length,
  theme: "light",

  toggleSidebar: () =>
    set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),

  setSidebarMobileOpen: (open) => set({ sidebarMobileOpen: open }),

  markNotificationRead: (id) =>
    set((s) => {
      const updated = s.notifications.map((n) =>
        n.id === id ? { ...n, isRead: true } : n
      );
      return {
        notifications: updated,
        unreadCount: updated.filter((n) => !n.isRead).length,
      };
    }),

  markAllRead: () =>
    set((s) => ({
      notifications: s.notifications.map((n) => ({ ...n, isRead: true })),
      unreadCount: 0,
    })),

  addNotification: (n) =>
    set((s) => ({
      notifications: [n, ...s.notifications],
      unreadCount: s.unreadCount + (n.isRead ? 0 : 1),
    })),

  setTheme: (theme) => set({ theme }),
}));
