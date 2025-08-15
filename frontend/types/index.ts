export interface User {
  id: number;
  email: string;
  name: string;
  role: "admin" | "manager" | "staff";
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Product {
  id: string;
  name: string;
  description?: string;
  sku: string;
  barcode?: string;
  category: string;
  price: number;
  cost: number;
  stock: number;
  minStock: number;
  images?: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ProductVariant {
  id: string;
  name: string;
  value: string;
  price: number;
  stock: number;
}

export interface Category {
  id: number;
  name: string;
  description?: string;
  color: string;
  icon: string;
  isActive: boolean;
  productCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface Brand {
  id: number;
  name: string;
  description?: string;
  logo?: string; // URL or path to brand logo
  isActive: boolean;
  productCount?: number;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
}

export interface Supplier {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  contactPerson: string;
  paymentTerms: string;
  rating: number;
  createdAt: string;
  updatedAt: string;
}

export interface PurchaseOrder {
  id: string;
  poNumber: string;
  poDate: string;
  supplierId?: number;
  deliveryDate?: string;
  status:
    | "draft"
    | "pending"
    | "approved"
    | "ordered"
    | "received"
    | "cancelled";
  paymentTerms?: string;
  paymentMethod?: string;
  totalAmount: number;
  paidAmount: number;
  notes?: string;
  createdBy?: number;
  creator?: {
    id: number;
    name: string;
    email: string;
  };
  items: PurchaseOrderItem[];
  createdAt: string;
  updatedAt: string;
}

export interface PurchaseOrderItem {
  id: string;
  purchaseOrderId: string;
  productId: string;
  quantity: number;
  unitPrice: number;
  discount: number;
  tax: number;
  lineTotal: number;
  product?: {
    id: string;
    name: string;
    sku: string;
  };
}

export interface SalesOrder {
  id: string;
  orderNumber: string;
  customerId: string;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  totalAmount: number;
  items: SalesOrderItem[];
  createdAt: string;
  updatedAt: string;
}

export interface SalesOrderItem {
  id: string;
  productId: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface StockMovement {
  id: string;
  productId: string;
  type: "in" | "out" | "adjustment" | "transfer";
  quantity: number;
  reference?: string;
  notes?: string;
  createdAt: string;
}

export interface DashboardStats {
  totalProducts: number;
  totalStock: number;
  lowStockItems: number;
  totalSales: number;
  recentMovements: StockMovement[];
}

export interface TableColumn<T> {
  key: keyof T;
  label: string;
  sortable?: boolean;
  filterable?: boolean;
  render?: (value: any, row: T) => React.ReactNode;
}

export interface PaginationState {
  pageIndex: number;
  pageSize: number;
}

export interface SortingState {
  id: string;
  desc: boolean;
}
[];

export interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  totalPages: number;
  page: number;
  limit: number;
}

export interface Unit {
  id: number;
  code: string; // e.g., PCS, KG
  name: string; // e.g., Pieces, Kilogram
  description?: string;
  symbol?: string; // e.g., pc, kg, m
  conversionFactor?: number; // e.g., 1
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
