/* =============================================================
   Village Trails Resort CRM — Shared TypeScript Types
   ============================================================= */

// ── Auth ──────────────────────────────────────────────────────
export type Role =
  | "SUPER_ADMIN"
  | "MANAGER"
  | "KITCHEN_HEAD"
  | "RECEPTION"
  | "KITCHEN_STAFF"
  | "ACCOUNTANT";

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatar?: string;
  phone?: string;
  department?: string;
  isActive: boolean;
  createdAt: string;
  lastLogin?: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
}

// ── Rooms ─────────────────────────────────────────────────────
export type RoomStatus = "AVAILABLE" | "BOOKED" | "RESERVED" | "MAINTENANCE" | "CHECKOUT";
export type RoomCategory =
  | "CAMPING_TENT"
  | "AC_CONTAINER_SMALL"
  | "AC_CONTAINER_LARGE"
  | "RABBIT_HILL"
  | "BOULDER_BAY"
  | "HONEY_BEE_HIVE"
  | "TEN_DOWN_STAY"
  | "TRIANGLE_HILLS";

export type BookingType = "PRIVATE" | "CORPORATE";

export interface RoomCategoryInfo {
  id: string;
  name: string;
  slug: RoomCategory;
  description: string;
  pricePerNight: number;
  capacity: number;
  amenities: string[];
  imageUrl: string;
}

export interface Room {
  id: string;
  roomNumber: string;
  floor: number;
  category: RoomCategory;
  categoryInfo: RoomCategoryInfo;
  status: RoomStatus;
  pricePerNight: number;
  capacity: number;
  amenities: string[];
  imageUrl?: string;
  lastCleaned?: string;
  notes?: string;
}

// ── Guests ────────────────────────────────────────────────────
export interface Guest {
  id: string;
  name: string;
  email: string;
  phone: string;
  address?: string;
  idType?: "AADHAR" | "PASSPORT" | "DL";
  idNumber?: string;
  nationality?: string;
  totalBookings: number;
  totalSpent: number;
  lastVisit?: string;
  createdAt: string;
}

// ── Bookings ──────────────────────────────────────────────────
export type BookingStatus =
  | "PENDING"
  | "CONFIRMED"
  | "CHECKED_IN"
  | "CHECKED_OUT"
  | "CANCELLED"
  | "NO_SHOW";

export type PaymentStatus = "PENDING" | "PARTIAL" | "PAID" | "REFUNDED" | "FAILED";
export type PaymentMethod = "CASH" | "CARD" | "UPI" | "BANK_TRANSFER" | "RAZORPAY";

export interface Booking {
  id: string;
  bookingNumber: string;
  guest: Guest;
  room: Room;
  checkIn: string;
  checkOut: string;
  nights: number;
  adults: number;
  children: number;
  status: BookingStatus;
  paymentStatus: PaymentStatus;
  roomRate: number;
  totalAmount: number;
  paidAmount: number;
  balanceDue: number;
  gstAmount: number;
  paymentMethod?: PaymentMethod;
  bookingType?: BookingType;
  specialRequests?: string;
  internalNotes?: string;
  cancellationReason?: string;
  refundAmount?: number;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

// ── Food / Kitchen ─────────────────────────────────────────────
export type MenuCategory =
  | "BREAKFAST"
  | "LUNCH"
  | "DINNER"
  | "SNACKS"
  | "BEVERAGES"
  | "DESSERTS";

export interface MenuItem {
  id: string;
  name: string;
  description?: string;
  category: MenuCategory;
  price: number;
  isVeg: boolean;
  isAvailable: boolean;
  preparationTime: number; // minutes
  imageUrl?: string;
  allergens?: string[];
}

export type OrderStatus =
  | "PENDING"
  | "ACCEPTED"
  | "PREPARING"
  | "READY"
  | "DELIVERED"
  | "CANCELLED";

export interface OrderItem {
  id: string;
  menuItem: MenuItem;
  quantity: number;
  price: number;
  notes?: string;
}

export interface FoodOrder {
  id: string;
  orderNumber: string;
  booking: Pick<Booking, "id" | "bookingNumber">;
  guest: Pick<Guest, "id" | "name">;
  roomNumber: string;
  items: OrderItem[];
  status: OrderStatus;
  totalAmount: number;
  gstAmount: number;
  grandTotal: number;
  paymentStatus: PaymentStatus;
  specialInstructions?: string;
  estimatedTime?: number; // minutes
  placedAt: string;
  acceptedAt?: string;
  preparedAt?: string;
  deliveredAt?: string;
  createdAt: string;
}

// ── Invoices ──────────────────────────────────────────────────
export type InvoiceType = "BOOKING" | "FOOD" | "COMBINED" | "REFUND";

export interface Invoice {
  id: string;
  invoiceNumber: string;
  type: InvoiceType;
  booking?: Pick<Booking, "id" | "bookingNumber">;
  guest: Pick<Guest, "id" | "name" | "email">;
  lineItems: InvoiceLineItem[];
  subTotal: number;
  cgst: number;
  sgst: number;
  totalGst: number;
  grandTotal: number;
  paymentStatus: PaymentStatus;
  issuedAt: string;
  dueDate?: string;
  paidAt?: string;
}

export interface InvoiceLineItem {
  description: string;
  quantity: number;
  unitPrice: number;
  amount: number;
  gstRate: number;
}

// ── Notifications ─────────────────────────────────────────────
export type NotificationType =
  | "BOOKING_NEW"
  | "BOOKING_CANCELLED"
  | "PAYMENT_RECEIVED"
  | "CHECK_IN"
  | "CHECK_OUT"
  | "ORDER_PLACED"
  | "ORDER_READY"
  | "MAINTENANCE_ALERT"
  | "SYSTEM";

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  isRead: boolean;
  link?: string;
  createdAt: string;
}

// ── Audit Logs ────────────────────────────────────────────────
export interface AuditLog {
  id: string;
  userId: string;
  userName: string;
  action: string;
  entity: string;
  entityId: string;
  changes?: Record<string, unknown>;
  ipAddress?: string;
  createdAt: string;
}

// ── Dashboard Stats ───────────────────────────────────────────
export interface DashboardStats {
  totalRevenue: number;
  revenueChange: number; // percentage
  totalBookings: number;
  bookingsChange: number;
  occupancyRate: number;
  occupancyChange: number;
  pendingActions: number;
  checkInsToday: number;
  checkOutsToday: number;
  activeOrders: number;
}

export interface RevenueDataPoint {
  month: string;
  booking: number;
  food: number;
  total: number;
}

export interface OccupancyDataPoint {
  date: string;
  rate: number;
}

// ── Pagination ────────────────────────────────────────────────
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface QueryParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  status?: string;
  fromDate?: string;
  toDate?: string;
}

// ── API Response ──────────────────────────────────────────────
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  errors?: Record<string, string[]>;
}

// ── Staff ─────────────────────────────────────────────────────
export interface StaffMember {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: Role;
  department: string;
  salary?: number;
  joinDate: string;
  isActive: boolean;
  avatar?: string;
  shift?: "MORNING" | "EVENING" | "NIGHT";
}

// ── Report ────────────────────────────────────────────────────
export type ReportType =
  | "REVENUE"
  | "OCCUPANCY"
  | "BOOKINGS"
  | "FOOD_ORDERS"
  | "GST"
  | "STAFF_ATTENDANCE";

export interface Report {
  id: string;
  type: ReportType;
  title: string;
  fromDate: string;
  toDate: string;
  generatedBy: string;
  generatedAt: string;
  fileUrl?: string;
  data: Record<string, unknown>;
}
