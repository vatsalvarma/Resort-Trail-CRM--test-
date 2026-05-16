"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Bell, Moon, Sun, Search, Menu, ChevronDown } from "lucide-react";
import { useTheme } from "next-themes";
import { format } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuthStore } from "@/store/authStore";
import { useUIStore } from "@/store/uiStore";
import { getInitials, ROLE_LABELS } from "@/lib/utils";
import { ClientTime } from "@/components/ui/client-time";
import { cn } from "@/lib/utils";
import type { Notification } from "@/types";

const NOTIF_ICONS: Record<string, string> = {
  CHECK_IN: "🏨", CHECK_OUT: "👋", BOOKING_NEW: "📅",
  BOOKING_CANCELLED: "❌", PAYMENT_RECEIVED: "💰",
  ORDER_PLACED: "🍽️", ORDER_READY: "✅", MAINTENANCE_ALERT: "🔧", SYSTEM: "🔔",
};

function NotificationPanel({ onClose }: { onClose: () => void }) {
  const { notifications, markAllRead, markNotificationRead } = useUIStore();

  return (
    <div className="absolute right-0 top-full mt-2 w-80 bg-background border rounded-xl shadow-xl z-50 overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b">
        <span className="font-semibold text-sm">Notifications</span>
        <button onClick={markAllRead} className="text-xs text-forest-600 hover:underline">
          Mark all read
        </button>
      </div>
      <div className="max-h-80 overflow-y-auto divide-y divide-border">
        {notifications.length === 0 ? (
          <p className="text-center text-sm text-muted-foreground py-8">No notifications</p>
        ) : (
          notifications.map((n: Notification) => (
            <div
              key={n.id}
              onClick={() => markNotificationRead(n.id)}
              className={cn(
                "flex gap-3 px-4 py-3 hover:bg-muted/40 cursor-pointer transition-colors",
                !n.isRead && "bg-forest-50 dark:bg-forest-900/20"
              )}
            >
              <span className="text-lg flex-shrink-0 mt-0.5">{NOTIF_ICONS[n.type] ?? "🔔"}</span>
              <div className="flex-1 min-w-0">
                <p className={cn("text-xs font-medium", !n.isRead && "text-forest-700 dark:text-forest-300")}>
                  {n.title}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{n.message}</p>
                <p className="text-xs text-muted-foreground/60 mt-1"><ClientTime dateStr={n.createdAt} /></p>
              </div>
              {!n.isRead && <div className="w-2 h-2 rounded-full bg-forest-500 flex-shrink-0 mt-1.5" />}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export function Header() {
  const { user, logout } = useAuthStore();
  const { unreadCount, setSidebarMobileOpen } = useUIStore();
  const { theme, setTheme } = useTheme();
  const router = useRouter();
  const [notifOpen, setNotifOpen] = useState(false);
  const today = format(new Date(), "EEEE, d MMMM yyyy");

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between h-16 px-4 md:px-6 bg-background/95 backdrop-blur border-b border-border">
      {/* Left: Mobile menu + title */}
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon-sm"
          className="md:hidden"
          onClick={() => setSidebarMobileOpen(true)}
        >
          <Menu className="w-5 h-5" />
        </Button>
        <div className="hidden sm:block">
          <p className="text-xs text-muted-foreground">{today}</p>
          <p className="text-sm font-semibold text-foreground">
            Welcome back, {user?.name?.split(" ")[0] ?? "User"}
          </p>
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2">
        {/* Search — desktop */}
        <div className="hidden lg:flex items-center gap-2 bg-muted/50 border border-border rounded-lg px-3 py-1.5 w-52">
          <Search className="w-4 h-4 text-muted-foreground flex-shrink-0" />
          <input
            placeholder="Search..."
            className="bg-transparent text-sm outline-none w-full placeholder:text-muted-foreground"
          />
        </div>

        {/* Theme toggle */}
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="text-muted-foreground hover:text-foreground"
        >
          {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </Button>

        {/* Notifications */}
        <div className="relative">
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => setNotifOpen(!notifOpen)}
            className="relative text-muted-foreground hover:text-foreground"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </Button>
          <AnimatePresence>
            {notifOpen && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.15 }}
              >
                <NotificationPanel onClose={() => setNotifOpen(false)} />
              </motion.div>
            )}
          </AnimatePresence>
          {notifOpen && (
            <div className="fixed inset-0 z-40" onClick={() => setNotifOpen(false)} />
          )}
        </div>

        {/* User dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-2 h-9 px-2">
              <Avatar className="h-7 w-7">
                <AvatarImage src={user?.avatar} alt={user?.name} />
                <AvatarFallback className="bg-forest-700 text-white text-xs">
                  {user ? getInitials(user.name) : "?"}
                </AvatarFallback>
              </Avatar>
              <div className="hidden sm:block text-left">
                <p className="text-xs font-semibold leading-none">{user?.name}</p>
                <p className="text-xs text-muted-foreground">{user ? ROLE_LABELS[user.role] : ""}</p>
              </div>
              <ChevronDown className="w-3 h-3 text-muted-foreground hidden sm:block" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuLabel>
              <p className="text-sm font-medium">{user?.name}</p>
              <p className="text-xs text-muted-foreground font-normal">{user?.email}</p>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => router.push("/settings")}>
              Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={logout} className="text-destructive focus:text-destructive">
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
