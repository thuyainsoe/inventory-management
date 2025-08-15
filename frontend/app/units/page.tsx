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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FolderPlus, Folder, Package, Eye, EyeOff } from "lucide-react";
import {
  ColumnDef,
  PaginationState,
  RowSelectionState,
} from "@tanstack/react-table";
import { formatDate, formatDateTime } from "@/lib/utils";
import { PageHeader } from "@/components/ui/page-header";
import ProtectedRoute from "@/components/auth/protected-route";
import { useAuth } from "@/contexts/auth-context";
import {
  useUnits,
  useDeleteUnit,
  useUnitStats,
  type Unit,
} from "@/hooks/use-units";
import { CreateUnitDrawer } from "@/components/units/create-unit-drawer";
import { EditUnitDrawer } from "@/components/units/edit-unit-drawer";

export default function UnitsPage() {
  const router = useRouter();
  const { user: currentUser } = useAuth();
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [globalFilter, setGlobalFilter] = useState("");
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [showCreateDrawer, setShowCreateDrawer] = useState(false);
  const [showEditDrawer, setShowEditDrawer] = useState(false);
  const [selectedUnit, setSelectedUnit] = useState<Unit | null>(null);

  // Fetch units
  const {
    data: unitsData,
    isLoading,
    error,
  } = useUnits({
    page: pagination.pageIndex + 1,
    limit: pagination.pageSize,
    search: globalFilter,
  });

  const { data: stats } = useUnitStats();
  const deleteUnitMutation = useDeleteUnit();

  const handleEdit = (unit: Unit) => {
    setSelectedUnit(unit);
    setShowEditDrawer(true);
  };

  const handleDelete = async (unit: Unit) => {
    if (window.confirm(`Are you sure you want to delete "${unit.name}"?`)) {
      try {
        await deleteUnitMutation.mutateAsync(unit.id);
      } catch (error) {
        console.error("Failed to delete unit:", error);
      }
    }
  };

  const handleView = (unit: Unit) => {
    router.push(`/units/${unit.id}`);
  };

  const handleAddUnit = () => setShowCreateDrawer(true);

  const handleBulkDelete = () => {
    const selectedUnitIds = Object.keys(rowSelection);
    // Implement bulk delete logic here
  };

  const units = unitsData?.data || [];
  const totalUnits = unitsData?.total || 0;
  const pageCount = unitsData?.totalPages || 0;

  const columns: ColumnDef<Unit>[] = [
    {
      accessorKey: "name",
      header: ({ column }) => createSortableHeader(column, "Name"),
      cell: ({ row }) => <div className="font-medium">{row.original.name}</div>,
    },
    {
      accessorKey: "symbol",
      header: "Symbol",
      cell: ({ row }) => <div>{row.original.symbol || "-"}</div>,
    },
    {
      accessorKey: "conversionFactor",
      header: "Conversion",
      cell: ({ row }) => <div>{row.original.conversionFactor}</div>,
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
              <Eye className="mr-1 h-3 w-3" /> Active
            </>
          ) : (
            <>
              <EyeOff className="mr-1 h-3 w-3" /> Inactive
            </>
          )}
        </Badge>
      ),
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
    createActionColumn<Unit>(handleEdit, handleDelete, handleView, [
      {
        label: "Toggle Status",
        onClick: (unit) => console.log("Toggle status for:", unit.name),
      },
    ]),
  ];

  return (
    <ProtectedRoute>
      <MainLayout user={currentUser || undefined}>
        <div className="space-y-6">
          {/* Page Header */}
          <PageHeader
            title="Units"
            description="Manage measurement units for your products"
            action={{
              label: "Add Unit",
              onClick: handleAddUnit,
              icon: <FolderPlus className="h-4 w-4" />,
            }}
          />

          {/* Stats Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Units
                </CardTitle>
                <Folder className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.total || 0}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Active Units
                </CardTitle>
                <div className="h-2 w-2 rounded-full bg-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.active || 0}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Inactive Units
                </CardTitle>
                <div className="h-2 w-2 rounded-full bg-gray-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.inactive || 0}</div>
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

          {/* Units Table */}
          <Card className="pt-6">
            <CardContent>
              {error ? (
                <div className="text-center py-8">
                  <p className="text-red-600">
                    Failed to load units. Please check your backend connection.
                  </p>
                </div>
              ) : (
                <DataTable
                  columns={columns}
                  data={units}
                  searchKey="name"
                  searchPlaceholder="Search units by code or name..."
                  loading={isLoading}
                  pagination={{
                    pageIndex: pagination.pageIndex,
                    pageSize: pagination.pageSize,
                    pageCount,
                    total: totalUnits,
                  }}
                  onPaginationChange={setPagination}
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

        {/* Create Unit Drawer */}
        <CreateUnitDrawer
          isOpen={showCreateDrawer}
          onClose={() => setShowCreateDrawer(false)}
        />

        {/* Edit Unit Drawer */}
        <EditUnitDrawer
          isOpen={showEditDrawer}
          onClose={() => {
            setShowEditDrawer(false);
            setSelectedUnit(null);
          }}
          unit={selectedUnit}
        />
      </MainLayout>
    </ProtectedRoute>
  );
}
