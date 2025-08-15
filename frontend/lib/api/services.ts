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
  Brand,
  Unit,
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
  getUsers: (params?: {
    page?: number;
    limit?: number;
    search?: string;
    role?: string;
  }) => apiClient.get<PaginatedResponse<User>>(API_ENDPOINTS.USERS, { params }),

  getUser: (id: number) => apiClient.get<User>(`${API_ENDPOINTS.USERS}/${id}`),

  createUser: (userData: Partial<User>) =>
    apiClient.post<User>(API_ENDPOINTS.USERS, userData),

  updateUser: (id: number, userData: Partial<User>) =>
    apiClient.patch<User>(`${API_ENDPOINTS.USERS}/${id}`, userData),

  deleteUser: (id: number) =>
    apiClient.delete<void>(`${API_ENDPOINTS.USERS}/${id}`),
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
  getCategories: (params?: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
  }) =>
    apiClient.get<PaginatedResponse<Category>>(API_ENDPOINTS.CATEGORIES, {
      params,
    }),

  getAllCategories: () =>
    apiClient.get<Category[]>(`${API_ENDPOINTS.CATEGORIES}/all`),

  getCategory: (id: number) =>
    apiClient.get<Category>(`${API_ENDPOINTS.CATEGORIES}/${id}`),

  createCategory: (categoryData: Partial<Category>) =>
    apiClient.post<Category>(API_ENDPOINTS.CATEGORIES, categoryData),

  updateCategory: (id: number, categoryData: Partial<Category>) =>
    apiClient.patch<Category>(
      `${API_ENDPOINTS.CATEGORIES}/${id}`,
      categoryData
    ),

  deleteCategory: (id: number) =>
    apiClient.delete<void>(`${API_ENDPOINTS.CATEGORIES}/${id}`),

  getStats: () =>
    apiClient.get<{
      total: number;
      active: number;
      inactive: number;
      withProducts: number;
    }>(`${API_ENDPOINTS.CATEGORIES}/stats`),
};

// Brand Services
export const brandService = {
  getBrands: (params?: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
  }) =>
    apiClient.get<PaginatedResponse<Brand>>(API_ENDPOINTS.BRANDS, { params }),

  getAllBrands: () => apiClient.get<Brand[]>(`${API_ENDPOINTS.BRANDS}/all`),

  getBrand: (id: number) =>
    apiClient.get<Brand>(`${API_ENDPOINTS.BRANDS}/${id}`),

  createBrand: (brandData: Partial<Brand>) =>
    apiClient.post<Brand>(API_ENDPOINTS.BRANDS, brandData),

  updateBrand: (id: number, brandData: Partial<Brand>) =>
    apiClient.patch<Brand>(`${API_ENDPOINTS.BRANDS}/${id}`, brandData),

  deleteBrand: (id: number) =>
    apiClient.delete<void>(`${API_ENDPOINTS.BRANDS}/${id}`),

  getStats: () =>
    apiClient.get<{
      total: number;
      active: number;
      inactive: number;
      withProducts: number;
    }>(`${API_ENDPOINTS.BRANDS}/stats`),
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
    search?: string;
    status?: string;
  }) =>
    apiClient.get<PaginatedResponse<PurchaseOrder>>(
      API_ENDPOINTS.PURCHASE_ORDERS,
      { params }
    ),

  getPurchaseOrder: (id: string) =>
    apiClient.get<PurchaseOrder>(`${API_ENDPOINTS.PURCHASE_ORDERS}/${id}`),

  createPurchaseOrder: (orderData: any) =>
    apiClient.post<PurchaseOrder>(API_ENDPOINTS.PURCHASE_ORDERS, orderData),

  updatePurchaseOrder: (id: string, orderData: any) =>
    apiClient.patch<PurchaseOrder>(
      `${API_ENDPOINTS.PURCHASE_ORDERS}/${id}`,
      orderData
    ),

  deletePurchaseOrder: (id: string) =>
    apiClient.delete<void>(`${API_ENDPOINTS.PURCHASE_ORDERS}/${id}`),

  updatePurchaseOrderStatus: (id: string, status: string) =>
    apiClient.patch<PurchaseOrder>(
      `${API_ENDPOINTS.PURCHASE_ORDERS}/${id}/status`,
      { status }
    ),

  getPurchaseOrdersByStatus: (status: string) =>
    apiClient.get<PurchaseOrder[]>(
      `${API_ENDPOINTS.PURCHASE_ORDERS}/status/${status}`
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

// Unit Services
export const unitService = {
  getUnits: (params?: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
  }) =>
    apiClient.get<PaginatedResponse<Unit>>(API_ENDPOINTS.UNITS, {
      params,
    }),

  getAllUnits: () => apiClient.get<Unit[]>(`${API_ENDPOINTS.UNITS}/all`),

  getUnit: (id: number) => apiClient.get<Unit>(`${API_ENDPOINTS.UNITS}/${id}`),

  createUnit: (unitData: Partial<Unit>) =>
    apiClient.post<Unit>(API_ENDPOINTS.UNITS, unitData),

  updateUnit: (id: number, unitData: Partial<Unit>) =>
    apiClient.patch<Unit>(`${API_ENDPOINTS.UNITS}/${id}`, unitData),

  deleteUnit: (id: number) =>
    apiClient.delete<void>(`${API_ENDPOINTS.UNITS}/${id}`),

  getStats: () =>
    apiClient.get<{
      total: number;
      active: number;
      inactive: number;
    }>(`${API_ENDPOINTS.UNITS}/stats`),
};
