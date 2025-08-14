"use client";

import { useAuth } from "@/contexts/auth-context";
import { Brand, PaginationState } from "@/types";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ColumnDef, RowSelectionState } from "@tanstack/react-table";
import { useBrands, useBrandStats } from "@/hooks/use-brands";
import ProtectedRoute from "@/components/auth/protected-route";
import { Badge } from "@/components/ui/badge";
import { MainLayout } from "@/components/layout/main-layout";
import { PageHeader } from "@/components/ui/page-header";
import { Eye, EyeOff, Folder, FolderPlus, Package } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  createActionColumn,
  createSortableHeader,
  DataTable,
} from "@/components/tables/data-table";
import { formatDate, formatDateTime } from "@/lib/utils";

const BrandsPage = () => {
  const router = useRouter();
  const { user: currentUser } = useAuth();
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [globalFilter, setGlobalFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [showCreateDrawer, setShowCreateDrawer] = useState(false);
  const [showEditDrawer, setShowEditDrawer] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState<Brand | null>(null);

  // Use TanStack Query to fetch brands
  const {
    data: brandsData,
    isLoading,
    error,
  } = useBrands({
    page: pagination.pageIndex + 1,
    limit: pagination.pageSize,
    search: globalFilter,
    status: statusFilter || undefined,
  });

  const { data: stats } = useBrandStats();

  const handleAddCategory = () => {
    setShowCreateDrawer(true);
  };

  const handleBulkDelete = () => {
    const selectedCategoryIds = Object.keys(rowSelection);
  };

  const handleEdit = (brand: Brand) => {
    setSelectedBrand(brand);
    setShowEditDrawer(true);
  };

  const handleDelete = async (brand: Brand) => {
    // if (window.confirm(`Are you sure you want to delete "${category.name}"?`)) {
    //   try {
    //     await deleteCategoryMutation.mutateAsync(category.id);
    //   } catch (error) {
    //     console.error("Failed to delete category:", error);
    //   }
    // }
  };

  const handleView = (brand: Brand) => {
    router.push(`/brands/${brand.id}`);
  };

  const brands = brandsData?.data || [];
  const totalBrands = brandsData?.total || 0;
  const pageCount = brandsData?.totalPages || 0;

  const columns: ColumnDef<Brand>[] = [
    {
      accessorKey: "name",
      header: ({ column }) => createSortableHeader(column, "Name"),
      cell: ({ row }) => {
        return (
          <div className="flex items-center">
            <div>
              <div className="font-medium text-gray-900">
                {row.original.name}
              </div>
              <div className="text-sm text-gray-500 max-w-[200px] truncate">
                {row.original.description || "No description"}
              </div>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "productCount",
      header: ({ column }) => createSortableHeader(column, "Products"),
      cell: ({ row }) => (
        <div className="flex items-center space-x-2">
          <Package className="h-4 w-4 text-muted-foreground" />
          <span className="font-medium">{row.original.productCount || 0}</span>
        </div>
      ),
    },
    {
      accessorKey: "isActive",
      header: ({ column }) => createSortableHeader(column, "Status"),
      cell: ({ row }) => (
        <Badge
          className={
            row.original.isActive
              ? "bg-green-100 text-green-800 hover:bg-green-200"
              : "bg-gray-100 text-gray-800 hover:bg-gray-200"
          }
        >
          {row.original.isActive ? (
            <>
              <Eye className="mr-1 h-3 w-3" />
              Active
            </>
          ) : (
            <>
              <EyeOff className="mr-1 h-3 w-3" />
              Inactive
            </>
          )}
        </Badge>
      ),
      filterFn: (row, id, value) => {
        const isActive = row.getValue(id) as boolean;
        return value.includes(isActive ? "active" : "inactive");
      },
    },
    {
      accessorKey: "createdAt",
      header: ({ column }) => createSortableHeader(column, "Created"),
      cell: ({ row }) => (
        <div className="min-w-[150px]">
          <div className="text-sm font-medium">
            {formatDate(row.getValue("createdAt"))}
          </div>
          <div className="text-xs text-gray-500">
            {formatDateTime(row.getValue("createdAt"))}
          </div>
        </div>
      ),
    },
    createActionColumn<Brand>(handleEdit, handleDelete, handleView, [
      {
        label: "Toggle Status",
        onClick: (category) => console.log("Toggle status for:", category.name),
      },
      {
        label: "View Products",
        onClick: (category) => console.log("View products for:", category.name),
      },
    ]),
  ];

  return (
    <ProtectedRoute>
      <MainLayout user={currentUser || undefined}>
        <div className="space-y-6">
          {/* Page Header */}
          <PageHeader
            title="Brands"
            description="Manage product brands and organize your inventory"
            action={{
              label: "Add Brands",
              onClick: handleAddCategory,
              icon: <FolderPlus className="h-4 w-4" />,
            }}
          />

          {/* Stats Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Brands
                </CardTitle>
                <Folder className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.total || 0}</div>
                <p className="text-xs text-muted-foreground">
                  {stats?.withProducts || 0} with products
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Active Brands
                </CardTitle>
                <div className="h-2 w-2 rounded-full bg-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.active || 0}</div>
                <p className="text-xs text-muted-foreground">
                  Available for products
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Inactive Brands
                </CardTitle>
                <div className="h-2 w-2 rounded-full bg-gray-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.inactive || 0}</div>
                <p className="text-xs text-muted-foreground">
                  Not currently used
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Selected</CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {Object.keys(rowSelection).length}
                </div>
                {Object.keys(rowSelection).length > 0 && (
                  <button
                    className="text-xs text-red-600 hover:text-red-800 mt-1"
                    onClick={handleBulkDelete}
                  >
                    Delete Selected
                  </button>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Brands Table */}
          <Card className="pt-6">
            <CardContent>
              {error ? (
                <div className="text-center py-8">
                  <p className="text-red-600">
                    Failed to load brands. Please check your backend connection.
                  </p>
                </div>
              ) : (
                <DataTable
                  columns={columns}
                  data={brands}
                  searchKey="name"
                  searchPlaceholder="Search brands by name or description..."
                  // onRowClick={(category) =>
                  //   router.push(`/brands/${category.id}`)
                  // }
                  loading={isLoading}
                  pagination={{
                    pageIndex: pagination.pageIndex,
                    pageSize: pagination.pageSize,
                    pageCount,
                    total: totalBrands,
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

        {/* Create Category Drawer */}
        {/* <CreateCategoryDrawer
          isOpen={showCreateDrawer}
          onClose={() => setShowCreateDrawer(false)}
        /> */}

        {/* Edit Category Drawer */}
        {/* <EditCategoryDrawer
          isOpen={showEditDrawer}
          onClose={() => {
            setShowEditDrawer(false);
            setSelectedCategory(null);
          }}
          category={selectedBrand}
        /> */}
      </MainLayout>
    </ProtectedRoute>
  );
};

export default BrandsPage;
