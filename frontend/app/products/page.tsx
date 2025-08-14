"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MainLayout } from "@/components/layout/main-layout";
import {
  DataTable,
  createSortableHeader,
  createActionColumn,
} from "@/components/tables/data-table";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Plus, Package, AlertCircle, TrendingUp } from "lucide-react";
import type { Product } from "@/types";
import {
  ColumnDef,
  PaginationState,
  SortingState,
  RowSelectionState,
} from "@tanstack/react-table";
import { formatCurrency, getStockStatus } from "@/lib/utils";
import { STOCK_STATUS_COLORS } from "@/lib/constants";
import { useProducts, useDeleteProduct } from "@/hooks/use-products";
import { PageHeader } from "@/components/ui/page-header";
import ProtectedRoute from "@/components/auth/protected-route";
import { useAuth } from "@/contexts/auth-context";

export default function ProductsPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [globalFilter, setGlobalFilter] = useState("");
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

  // Use TanStack Query to fetch products
  const {
    data: productsData,
    isLoading,
    error,
  } = useProducts({
    page: pagination.pageIndex + 1,
    limit: pagination.pageSize,
    search: globalFilter,
  });

  const deleteProductMutation = useDeleteProduct();

  const handleEdit = (product: Product) => {
    console.log("Edit product:", product);
    // Implement edit logic - could open a modal or navigate to edit page
  };

  const handleDelete = async (product: Product) => {
    if (window.confirm(`Are you sure you want to delete "${product.name}"?`)) {
      try {
        await deleteProductMutation.mutateAsync(product.id);
      } catch (error) {
        console.error("Failed to delete product:", error);
      }
    }
  };

  const handleView = (product: Product) => {
    router.push(`/products/${product.id}`);
  };

  const handleAddProduct = () => {
    console.log("Add new product");
    // Implement add product logic - could open a modal or navigate to add page
  };

  // Extract products and pagination info
  const products = productsData?.data || [];
  const totalProducts = productsData?.total || 0;
  const pageCount = productsData?.totalPages || 0;

  // Calculate stats
  const totalValue = products.reduce(
    (sum, product) => sum + product.price * product.stock,
    0
  );
  const lowStockCount = products.filter(
    (product) =>
      getStockStatus(product.stock, product.minStock) === "low-stock" ||
      getStockStatus(product.stock, product.minStock) === "out-of-stock"
  ).length;
  const totalStock = products.reduce((sum, product) => sum + product.stock, 0);

  const columns: ColumnDef<Product>[] = [
    {
      accessorKey: "name",
      header: ({ column }) => createSortableHeader(column, "Name"),
      cell: ({ row }) => (
        <div className="min-w-[200px]">
          <div className="font-medium">{row.getValue("name")}</div>
          <div className="text-sm text-muted-foreground">
            {row.original.sku}
          </div>
        </div>
      ),
    },
    {
      accessorKey: "category",
      header: ({ column }) => createSortableHeader(column, "Category"),
      cell: ({ row }) => (
        <Badge variant="secondary">{row.getValue("category")}</Badge>
      ),
    },
    {
      accessorKey: "price",
      header: ({ column }) => createSortableHeader(column, "Price"),
      cell: ({ row }) => formatCurrency(row.getValue("price")),
    },
    {
      accessorKey: "stock",
      header: ({ column }) => createSortableHeader(column, "Stock"),
      cell: ({ row }) => {
        const stock = row.getValue("stock") as number;
        const minStock = row.original.minStock;
        const status = getStockStatus(stock, minStock);

        return (
          <div className="flex items-center space-x-2 min-w-[100px]">
            <span className="font-medium">{stock}</span>
            <Badge
              variant="secondary"
              className={
                STOCK_STATUS_COLORS[status as keyof typeof STOCK_STATUS_COLORS]
              }
            >
              {status.replace("-", " ")}
            </Badge>
          </div>
        );
      },
    },
    {
      accessorKey: "barcode",
      header: "Barcode",
      cell: ({ row }) => (
        <code className="text-sm bg-muted px-2 py-1 rounded">
          {row.getValue("barcode")}
        </code>
      ),
    },
    {
      accessorKey: "description",
      header: "Description",
      cell: ({ row }) => (
        <div className="max-w-[200px] truncate">
          {row.original.description || "No description"}
        </div>
      ),
    },
    {
      id: "supplier",
      header: "Supplier",
      cell: ({ row }) => <div className="min-w-[120px]">N/A</div>,
    },
    {
      id: "location",
      header: "Location",
      cell: ({ row }) => <div className="min-w-[100px]">Warehouse A</div>,
    },
    {
      accessorKey: "updatedAt",
      header: "Last Updated",
      cell: ({ row }) => (
        <div className="min-w-[120px] text-sm text-muted-foreground">
          {new Date(row.getValue("updatedAt")).toLocaleDateString()}
        </div>
      ),
    },
    createActionColumn<Product>(handleEdit, handleDelete, handleView, [
      {
        label: "Duplicate",
        onClick: (product) => console.log("Duplicate:", product),
      },
      {
        label: "Generate Barcode",
        onClick: (product) => console.log("Generate barcode:", product),
      },
    ]),
  ];

  return (
    <ProtectedRoute>
      <MainLayout user={user || undefined}>
      <div className="space-y-6">
        {/* Page Header */}
        <PageHeader
          title="Products"
          description="Manage your product inventory"
          action={{
            label: "Add Product",
            onClick: handleAddProduct,
            icon: <Plus className="h-4 w-4" />,
          }}
        />

        {/* Stats Cards */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card className="modern-card border-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Products
              </CardTitle>
              <div className="p-2 rounded-lg gradient-blue text-white">
                <Package className="h-4 w-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">
                {totalProducts}
              </div>
              <p className="text-sm text-muted-foreground">
                Active products in inventory
              </p>
            </CardContent>
          </Card>

          <Card className="modern-card border-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Stock Value
              </CardTitle>
              <div className="p-2 rounded-lg gradient-green text-white">
                <TrendingUp className="h-4 w-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">
                {formatCurrency(totalValue)}
              </div>
              <p className="text-sm text-muted-foreground">
                Current inventory value
              </p>
            </CardContent>
          </Card>

          <Card className="modern-card border-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Stock Units
              </CardTitle>
              <div className="p-2 rounded-lg gradient-purple text-white">
                <Package className="h-4 w-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">
                {totalStock.toLocaleString()}
              </div>
              <p className="text-sm text-muted-foreground">Units in stock</p>
            </CardContent>
          </Card>

          <Card className="modern-card border-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Low Stock Items
              </CardTitle>
              <div className="p-2 rounded-lg gradient-pink text-white">
                <AlertCircle className="h-4 w-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">
                {lowStockCount}
              </div>
              <p className="text-sm text-muted-foreground">
                Items needing attention
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Products Table */}
        <Card className="modern-card border-0">
          <CardHeader>
            <CardTitle className="text-xl font-semibold">
              All Products
            </CardTitle>
            <CardDescription>
              Complete product inventory with real-time data from your backend
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error ? (
              <div className="text-center py-8">
                <p className="text-red-600">
                  Failed to load products. Please check your backend connection.
                </p>
              </div>
            ) : (
              <DataTable
                columns={columns}
                data={products}
                searchKey="name"
                searchPlaceholder="Search products..."
                onRowClick={(product) => console.log("Row clicked:", product)}
                loading={isLoading}
                pagination={{
                  pageIndex: pagination.pageIndex,
                  pageSize: pagination.pageSize,
                  pageCount,
                  total: totalProducts,
                }}
                onPaginationChange={setPagination}
                onSortingChange={undefined}
                onGlobalFilterChange={setGlobalFilter}
                manualPagination={true}
                manualSorting={true}
                enableRowSelection={true}
                rowSelection={rowSelection}
                onRowSelectionChange={setRowSelection}
              />
            )}
          </CardContent>
        </Card>
      </div>
    </MainLayout>
    </ProtectedRoute>
  );
}
