"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard, BedDouble, CalendarCheck, ChefHat, ShoppingBag,
  Receipt, BarChart3, Users, UserCog, Settings, LogOut, ChevronLeft,
  ChevronRight, TreePine, Bell, Menu,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/authStore";
import { useUIStore } from "@/store/uiStore";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { getInitials, ROLE_LABELS } from "@/lib/utils";

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
  badge?: number;
  module: string;
}

const navItems: NavItem[] = [
  { label: "Dashboard",    href: "/dashboard",  icon: LayoutDashboard, module: "dashboard"  },
  { label: "Rooms",        href: "/rooms",       icon: BedDouble,       module: "rooms"      },
  { label: "Bookings",     href: "/bookings",    icon: CalendarCheck,   module: "bookings"   },
  { label: "Kitchen",      href: "/kitchen",     icon: ChefHat,         module: "kitchen"    },
  { label: "Food Orders",  href: "/orders",      icon: ShoppingBag,     module: "orders"     },
  { label: "Guests",       href: "/guests",      icon: Users,           module: "guests"     },
  { label: "Accounting",   href: "/accounting",  icon: Receipt,         module: "accounting" },
  { label: "Reports",      href: "/reports",     icon: BarChart3,       module: "reports"    },
  { label: "Staff",        href: "/staff",       icon: UserCog,         module: "staff"      },
  { label: "Settings",     href: "/settings",    icon: Settings,        module: "settings"   },
];

export function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuthStore();
  const { sidebarCollapsed, toggleSidebar, unreadCount } = useUIStore();

  const accessible = navItems.filter((item) => {
    if (!user) return false;
    const ROLE_PERMISSIONS: Record<string, string[]> = {
      SUPER_ADMIN:   ["dashboard","rooms","bookings","kitchen","orders","accounting","reports","guests","staff","settings"],
      MANAGER:       ["dashboard","rooms","bookings","kitchen","orders","accounting","reports","guests"],
      KITCHEN_HEAD:  ["kitchen","orders","dashboard"],
      RECEPTION:     ["dashboard","bookings","rooms","guests","orders"],
      KITCHEN_STAFF: ["kitchen","orders"],
      ACCOUNTANT:    ["dashboard","accounting","reports","bookings"],
    };
    return ROLE_PERMISSIONS[user.role]?.includes(item.module) ?? false;
  });

  return (
    <motion.aside
      initial={false}
      animate={{ width: sidebarCollapsed ? 72 : 256 }}
      transition={{ duration: 0.25, ease: "easeInOut" }}
      className="relative hidden md:flex flex-col h-screen bg-forest-900 border-r border-white/5 flex-shrink-0 overflow-hidden z-20"
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-5 border-b border-white/5">
        <div className="flex-shrink-0 w-9 h-9 rounded-xl bg-gold-500 flex items-center justify-center shadow-gold">
          <TreePine className="w-5 h-5 text-white" />
        </div>
        <AnimatePresence>
          {!sidebarCollapsed && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <p className="text-white font-display font-semibold text-sm leading-tight">Village Trails</p>
              <p className="text-forest-400 text-xs">Resort CRM</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-0.5">
        {accessible.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
          const Icon = item.icon;
          return (
            <Link key={item.href} href={item.href}>
              <motion.div
                whileHover={{ x: 2 }}
                className={cn(
                  "relative flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer transition-all duration-150 group",
                  isActive
                    ? "bg-gold-500/15 text-gold-400"
                    : "text-forest-300 hover:bg-white/5 hover:text-white"
                )}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeIndicator"
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-6 bg-gold-400 rounded-r-full"
                  />
                )}
                <Icon className={cn("flex-shrink-0 w-5 h-5", isActive ? "text-gold-400" : "text-forest-400 group-hover:text-white")} />
                <AnimatePresence>
                  {!sidebarCollapsed && (
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="text-sm font-medium whitespace-nowrap overflow-hidden"
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>
                {item.module === "kitchen" && unreadCount > 0 && !sidebarCollapsed && (
                  <Badge variant="gold" className="ml-auto text-xs px-1.5 py-0 h-5">
                    {unreadCount}
                  </Badge>
                )}
              </motion.div>
            </Link>
          );
        })}
      </nav>

      {/* User Profile */}
      <div className="border-t border-white/5 p-3">
        <div className={cn("flex items-center gap-3 p-2 rounded-xl hover:bg-white/5 cursor-pointer transition-colors", sidebarCollapsed && "justify-center")}>
          <Avatar className="h-8 w-8 flex-shrink-0">
            <AvatarImage src={user?.avatar} alt={user?.name} />
            <AvatarFallback className="bg-forest-700 text-white text-xs">
              {user ? getInitials(user.name) : "?"}
            </AvatarFallback>
          </Avatar>
          <AnimatePresence>
            {!sidebarCollapsed && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex-1 min-w-0"
              >
                <p className="text-white text-sm font-medium truncate">{user?.name}</p>
                <p className="text-forest-400 text-xs truncate">{user ? ROLE_LABELS[user.role] : ""}</p>
              </motion.div>
            )}
          </AnimatePresence>
          <AnimatePresence>
            {!sidebarCollapsed && (
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={logout}
                className="p-1 rounded-lg text-forest-400 hover:text-red-400 hover:bg-red-900/20 transition-colors"
                title="Logout"
              >
                <LogOut className="w-4 h-4" />
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Collapse Toggle */}
      <button
        onClick={toggleSidebar}
        className="absolute -right-3 top-20 z-10 w-6 h-6 rounded-full bg-forest-700 border border-white/10 flex items-center justify-center text-white hover:bg-forest-600 transition-colors shadow-lg"
      >
        {sidebarCollapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronLeft className="w-3 h-3" />}
      </button>
    </motion.aside>
  );
}

export function MobileSidebar() {
  const { sidebarMobileOpen, setSidebarMobileOpen } = useUIStore();
  const pathname = usePathname();
  const { user, logout } = useAuthStore();
  const { unreadCount } = useUIStore();

  const accessible = navItems.filter((item) => {
    if (!user) return false;
    const ROLE_PERMISSIONS: Record<string, string[]> = {
      SUPER_ADMIN:   ["dashboard","rooms","bookings","kitchen","orders","accounting","reports","guests","staff","settings"],
      MANAGER:       ["dashboard","rooms","bookings","kitchen","orders","accounting","reports","guests"],
      KITCHEN_HEAD:  ["kitchen","orders","dashboard"],
      RECEPTION:     ["dashboard","bookings","rooms","guests","orders"],
      KITCHEN_STAFF: ["kitchen","orders"],
      ACCOUNTANT:    ["dashboard","accounting","reports","bookings"],
    };
    return ROLE_PERMISSIONS[user.role]?.includes(item.module) ?? false;
  });

  if (!sidebarMobileOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-black/60 z-40 md:hidden"
        onClick={() => setSidebarMobileOpen(false)}
      />
      <motion.aside
        initial={{ x: -256 }}
        animate={{ x: 0 }}
        exit={{ x: -256 }}
        transition={{ duration: 0.25, ease: "easeInOut" }}
        className="fixed left-0 top-0 h-full w-64 bg-forest-900 z-50 md:hidden flex flex-col"
      >
        <div className="flex items-center gap-3 px-4 py-5 border-b border-white/5">
          <div className="w-9 h-9 rounded-xl bg-gold-500 flex items-center justify-center">
            <TreePine className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="text-white font-semibold text-sm">Village Trails</p>
            <p className="text-forest-400 text-xs">Resort CRM</p>
          </div>
        </div>
        <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-0.5">
          {accessible.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link key={item.href} href={item.href} onClick={() => setSidebarMobileOpen(false)}>
                <div className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors",
                  isActive ? "bg-gold-500/15 text-gold-400" : "text-forest-300 hover:bg-white/5 hover:text-white"
                )}>
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  <span className="text-sm font-medium">{item.label}</span>
                </div>
              </Link>
            );
          })}
        </nav>
        <div className="border-t border-white/5 p-3">
          <div className="flex items-center gap-3 p-2">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-forest-700 text-white text-xs">
                {user ? getInitials(user.name) : "?"}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-white text-sm font-medium truncate">{user?.name}</p>
              <p className="text-forest-400 text-xs">{user ? ROLE_LABELS[user.role] : ""}</p>
            </div>
            <button onClick={logout} className="p-1 text-forest-400 hover:text-red-400">
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </motion.aside>
    </>
  );
}
