import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { format, formatDistance, parseISO } from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number, currency = "INR"): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(dateStr: string, fmt = "dd MMM yyyy"): string {
  try {
    return format(parseISO(dateStr), fmt);
  } catch {
    return dateStr;
  }
}

export function formatRelativeTime(dateStr: string): string {
  try {
    return formatDistance(parseISO(dateStr), new Date(), { addSuffix: true });
  } catch {
    return dateStr;
  }
}

export function formatDateTime(dateStr: string): string {
  return formatDate(dateStr, "dd MMM yyyy, hh:mm a");
}

export function calculateNights(checkIn: string, checkOut: string): number {
  const start = new Date(checkIn);
  const end = new Date(checkOut);
  const diff = end.getTime() - start.getTime();
  return Math.max(1, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}

export function calculateGST(
  amount: number,
  rate = 18
): { cgst: number; sgst: number; total: number } {
  const each = (amount * (rate / 2)) / 100;
  return { cgst: each, sgst: each, total: each * 2 };
}

export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function truncate(str: string, length = 40): string {
  return str.length > length ? str.slice(0, length) + "…" : str;
}

export function generateBookingNumber(): string {
  const prefix = "VTR";
  const year = new Date().getFullYear().toString().slice(-2);
  const random = Math.floor(Math.random() * 90000) + 10000;
  return `${prefix}${year}${random}`;
}

export function getRoomStatusColor(status: string): string {
  const map: Record<string, string> = {
    AVAILABLE:   "bg-green-500",
    BOOKED:      "bg-red-500",
    RESERVED:    "bg-amber-500",
    MAINTENANCE: "bg-gray-500",
    CHECKOUT:    "bg-blue-500",
  };
  return map[status] ?? "bg-gray-400";
}

export function getRoomStatusLabel(status: string): string {
  const map: Record<string, string> = {
    AVAILABLE:   "Available",
    BOOKED:      "Occupied",
    RESERVED:    "Reserved",
    MAINTENANCE: "Maintenance",
    CHECKOUT:    "Checkout",
  };
  return map[status] ?? status;
}

export function getBookingStatusColor(status: string): string {
  const map: Record<string, string> = {
    PENDING:    "bg-amber-100 text-amber-800 dark:bg-amber-900/20 dark:text-amber-400",
    CONFIRMED:  "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400",
    CHECKED_IN: "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400",
    CHECKED_OUT:"bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400",
    CANCELLED:  "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400",
    NO_SHOW:    "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400",
  };
  return map[status] ?? "bg-gray-100 text-gray-800";
}

export function getPaymentStatusColor(status: string): string {
  const map: Record<string, string> = {
    PAID:    "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400",
    PARTIAL: "bg-amber-100 text-amber-800 dark:bg-amber-900/20 dark:text-amber-400",
    PENDING: "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400",
    REFUNDED:"bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400",
    FAILED:  "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400",
  };
  return map[status] ?? "bg-gray-100 text-gray-800";
}

export function getOrderStatusColor(status: string): string {
  const map: Record<string, string> = {
    PENDING:   "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
    ACCEPTED:  "bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400",
    PREPARING: "bg-amber-100 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400",
    READY:     "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400",
    DELIVERED: "bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400",
    CANCELLED: "bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400",
  };
  return map[status] ?? "bg-gray-100 text-gray-700";
}

export function debounce<T extends (...args: unknown[]) => unknown>(fn: T, delay: number) {
  let timer: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

export function parseError(error: unknown): string {
  if (error instanceof Error) return error.message;
  if (typeof error === "string") return error;
  return "An unexpected error occurred";
}

export function slugify(text: string): string {
  return text.toLowerCase().replace(/\s+/g, "-").replace(/[^\w-]+/g, "");
}

export const ROLE_LABELS: Record<string, string> = {
  SUPER_ADMIN:   "Super Admin",
  MANAGER:       "Manager",
  KITCHEN_HEAD:  "Kitchen Head",
  RECEPTION:     "Reception",
  KITCHEN_STAFF: "Kitchen Staff",
  ACCOUNTANT:    "Accountant",
};

export const ROOM_CATEGORY_LABELS: Record<string, string> = {
  DELUXE_ROOM:    "Deluxe Room",
  PREMIUM_SUITE:  "Premium Suite",
  JUNGLE_VILLA:   "Jungle Villa",
  TREE_HOUSE:     "Tree House",
  FAMILY_COTTAGE: "Family Cottage",
};
