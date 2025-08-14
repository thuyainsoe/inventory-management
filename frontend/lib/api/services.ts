import { apiClient } from "./client";
import { API_ENDPOINTS } from "../constants";
import type {
  User,
  Product,
  Category,
  Supplier,
  PurchaseOrder,
  SalesOrder,
  StockMovement,
  DashboardStats,
  PaginatedResponse,
  ApiResponse,
} from "../../types";

// Auth Services
export const authService = {
  login: (credentials: { email: string; password: string }) =>
    apiClient.post<ApiResponse<{ user: User; token: string }>>(
      API_ENDPOINTS.AUTH.LOGIN,
      credentials
    ),

  register: (userData: {
    name: string;
    email: string;
    password: string;
    role?: string;
  }) =>
    apiClient.post<ApiResponse<{ user: User; token: string }>>(
      API_ENDPOINTS.AUTH.REGISTER,
      userData
    ),

  logout: () => apiClient.post<ApiResponse<null>>(API_ENDPOINTS.AUTH.LOGOUT),

  getProfile: () =>
    apiClient.get<ApiResponse<User>>(API_ENDPOINTS.AUTH.PROFILE),

  refreshToken: () =>
    apiClient.post<ApiResponse<{ token: string }>>(API_ENDPOINTS.AUTH.REFRESH),
};

// User Services
export const userService = {
  getUsers: (params?: { page?: number; limit?: number; search?: string }) =>
    apiClient.get<PaginatedResponse<User>>(API_ENDPOINTS.USERS, { params }),

  getUser: (id: string) =>
    apiClient.get<ApiResponse<User>>(`${API_ENDPOINTS.USERS}/${id}`),

  createUser: (userData: Partial<User>) =>
    apiClient.post<ApiResponse<User>>(API_ENDPOINTS.USERS, userData),

  updateUser: (id: string, userData: Partial<User>) =>
    apiClient.put<ApiResponse<User>>(`${API_ENDPOINTS.USERS}/${id}`, userData),

  deleteUser: (id: string) =>
    apiClient.delete<ApiResponse<null>>(`${API_ENDPOINTS.USERS}/${id}`),
};

// Product Services
export const productService = {
  getProducts: (params?: {
    page?: number;
    limit?: number;
    search?: string;
    category?: string;
  }) =>
    apiClient.get<PaginatedResponse<Product>>(API_ENDPOINTS.PRODUCTS, {
      params,
    }),

  getProduct: (id: string) =>
    apiClient.get<Product>(`${API_ENDPOINTS.PRODUCTS}/${id}`),

  createProduct: (productData: Partial<Product>) =>
    apiClient.post<ApiResponse<Product>>(API_ENDPOINTS.PRODUCTS, productData),

  updateProduct: (id: string, productData: Partial<Product>) =>
    apiClient.put<ApiResponse<Product>>(
      `${API_ENDPOINTS.PRODUCTS}/${id}`,
      productData
    ),

  deleteProduct: (id: string) =>
    apiClient.delete<ApiResponse<null>>(`${API_ENDPOINTS.PRODUCTS}/${id}`),
};

// Category Services
export const categoryService = {
  getCategories: () =>
    apiClient.get<ApiResponse<Category[]>>(API_ENDPOINTS.CATEGORIES),

  createCategory: (categoryData: Partial<Category>) =>
    apiClient.post<ApiResponse<Category>>(
      API_ENDPOINTS.CATEGORIES,
      categoryData
    ),

  updateCategory: (id: string, categoryData: Partial<Category>) =>
    apiClient.put<ApiResponse<Category>>(
      `${API_ENDPOINTS.CATEGORIES}/${id}`,
      categoryData
    ),

  deleteCategory: (id: string) =>
    apiClient.delete<ApiResponse<null>>(`${API_ENDPOINTS.CATEGORIES}/${id}`),
};

// Supplier Services
export const supplierService = {
  getSuppliers: (params?: { page?: number; limit?: number; search?: string }) =>
    apiClient.get<PaginatedResponse<Supplier>>(API_ENDPOINTS.SUPPLIERS, {
      params,
    }),

  getSupplier: (id: string) =>
    apiClient.get<ApiResponse<Supplier>>(`${API_ENDPOINTS.SUPPLIERS}/${id}`),

  createSupplier: (supplierData: Partial<Supplier>) =>
    apiClient.post<ApiResponse<Supplier>>(
      API_ENDPOINTS.SUPPLIERS,
      supplierData
    ),

  updateSupplier: (id: string, supplierData: Partial<Supplier>) =>
    apiClient.put<ApiResponse<Supplier>>(
      `${API_ENDPOINTS.SUPPLIERS}/${id}`,
      supplierData
    ),

  deleteSupplier: (id: string) =>
    apiClient.delete<ApiResponse<null>>(`${API_ENDPOINTS.SUPPLIERS}/${id}`),
};

// Purchase Order Services
export const purchaseOrderService = {
  getPurchaseOrders: (params?: {
    page?: number;
    limit?: number;
    status?: string;
  }) =>
    apiClient.get<PaginatedResponse<PurchaseOrder>>(
      API_ENDPOINTS.PURCHASE_ORDERS,
      { params }
    ),

  getPurchaseOrder: (id: string) =>
    apiClient.get<ApiResponse<PurchaseOrder>>(
      `${API_ENDPOINTS.PURCHASE_ORDERS}/${id}`
    ),

  createPurchaseOrder: (orderData: Partial<PurchaseOrder>) =>
    apiClient.post<ApiResponse<PurchaseOrder>>(
      API_ENDPOINTS.PURCHASE_ORDERS,
      orderData
    ),

  updatePurchaseOrder: (id: string, orderData: Partial<PurchaseOrder>) =>
    apiClient.put<ApiResponse<PurchaseOrder>>(
      `${API_ENDPOINTS.PURCHASE_ORDERS}/${id}`,
      orderData
    ),

  deletePurchaseOrder: (id: string) =>
    apiClient.delete<ApiResponse<null>>(
      `${API_ENDPOINTS.PURCHASE_ORDERS}/${id}`
    ),
};

// Sales Order Services
export const salesOrderService = {
  getSalesOrders: (params?: {
    page?: number;
    limit?: number;
    status?: string;
  }) =>
    apiClient.get<PaginatedResponse<SalesOrder>>(API_ENDPOINTS.SALES_ORDERS, {
      params,
    }),

  getSalesOrder: (id: string) =>
    apiClient.get<ApiResponse<SalesOrder>>(
      `${API_ENDPOINTS.SALES_ORDERS}/${id}`
    ),

  createSalesOrder: (orderData: Partial<SalesOrder>) =>
    apiClient.post<ApiResponse<SalesOrder>>(
      API_ENDPOINTS.SALES_ORDERS,
      orderData
    ),

  updateSalesOrder: (id: string, orderData: Partial<SalesOrder>) =>
    apiClient.put<ApiResponse<SalesOrder>>(
      `${API_ENDPOINTS.SALES_ORDERS}/${id}`,
      orderData
    ),

  deleteSalesOrder: (id: string) =>
    apiClient.delete<ApiResponse<null>>(`${API_ENDPOINTS.SALES_ORDERS}/${id}`),
};

// Stock Movement Services
export const stockMovementService = {
  getStockMovements: (params?: {
    page?: number;
    limit?: number;
    productId?: string;
    type?: string;
  }) =>
    apiClient.get<PaginatedResponse<StockMovement>>(
      API_ENDPOINTS.STOCK_MOVEMENTS,
      { params }
    ),

  createStockMovement: (movementData: Partial<StockMovement>) =>
    apiClient.post<ApiResponse<StockMovement>>(
      API_ENDPOINTS.STOCK_MOVEMENTS,
      movementData
    ),
};

// Dashboard Services
export const dashboardService = {
  getStats: () =>
    apiClient.get<ApiResponse<DashboardStats>>(API_ENDPOINTS.DASHBOARD),

  getReports: (type: string, params?: Record<string, any>) =>
    apiClient.get<ApiResponse<any>>(`${API_ENDPOINTS.REPORTS}/${type}`, {
      params,
    }),
};
