export const ROLES = {
  ADMIN: "admin",
  MANAGER: "manager",
  STAFF: "staff",
} as const;

export const ORDER_STATUS = {
  DRAFT: "draft",
  PENDING: "pending",
  APPROVED: "approved",
  RECEIVED: "received",
  CANCELLED: "cancelled",
} as const;

export const STOCK_MOVEMENT_TYPES = {
  IN: "in",
  OUT: "out",
  ADJUSTMENT: "adjustment",
  TRANSFER: "transfer",
} as const;

export const STOCK_STATUS_COLORS = {
  "out-of-stock": "text-red-600 bg-red-50",
  "low-stock": "text-yellow-600 bg-yellow-50",
  "medium-stock": "text-blue-600 bg-blue-50",
  "in-stock": "text-green-600 bg-green-50",
} as const;

// These will connect to your NestJS backend
export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3003/api";

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: "/auth/login",
    REGISTER: "/auth/register",
    LOGOUT: "/auth/logout",
    REFRESH: "/auth/refresh",
    PROFILE: "/auth/profile",
  },
  USERS: "/users",
  PRODUCTS: "/products",
  BRANDS: "/brands",
  CATEGORIES: "/categories",
  SUPPLIERS: "/suppliers",
  PURCHASE_ORDERS: "/purchase-orders",
  SALES_ORDERS: "/sales-orders",
  STOCK_MOVEMENTS: "/stock-movements",
  DASHBOARD: "/dashboard",
  REPORTS: "/reports",
  UNITS: "/units" as const,
} as const;

export const PAGINATION_SIZES = [10, 20, 50, 100] as const;

export const DEFAULT_PAGINATION = {
  pageIndex: 0,
  pageSize: 20,
} as const;
