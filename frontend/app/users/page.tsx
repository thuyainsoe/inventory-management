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
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { UserPlus, Download, Upload, Filter } from "lucide-react";
import {
  ColumnDef,
  PaginationState,
  RowSelectionState,
} from "@tanstack/react-table";
import { formatDate, formatDateTime } from "@/lib/utils";
import { PageHeader } from "@/components/ui/page-header";
import ProtectedRoute from "@/components/auth/protected-route";
import { useAuth } from "@/contexts/auth-context";
import { useUsers, useDeleteUser, type User } from "@/hooks/use-users";
import { CreateUserDrawer } from "@/components/users/create-user-drawer";

// Role badge colors
const getRoleBadgeColor = (role: string) => {
  switch (role) {
    case "admin":
      return "bg-red-100 text-red-800 hover:bg-red-200";
    case "manager":
      return "bg-blue-100 text-blue-800 hover:bg-blue-200";
    case "staff":
      return "bg-green-100 text-green-800 hover:bg-green-200";
    default:
      return "bg-gray-100 text-gray-800 hover:bg-gray-200";
  }
};

export default function UsersPage() {
  const router = useRouter();
  const { user: currentUser } = useAuth();
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [globalFilter, setGlobalFilter] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("");
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [showCreateDrawer, setShowCreateDrawer] = useState(false);

  // Use TanStack Query to fetch users
  const {
    data: usersData,
    isLoading,
    error,
  } = useUsers({
    page: pagination.pageIndex + 1,
    limit: pagination.pageSize,
    search: globalFilter,
    role: roleFilter || undefined,
  });

  const deleteUserMutation = useDeleteUser();

  const handleEdit = (user: User) => {
    console.log("Edit user:", user);
    // Implement edit logic - could open a modal or navigate to edit page
  };

  const handleDelete = async (user: User) => {
    if (window.confirm(`Are you sure you want to delete "${user.name}"?`)) {
      try {
        await deleteUserMutation.mutateAsync(user.id);
      } catch (error) {
        console.error("Failed to delete user:", error);
      }
    }
  };

  const handleView = (user: User) => {
    router.push(`/users/${user.id}`);
  };

  const handleAddUser = () => {
    setShowCreateDrawer(true);
  };

  const handleBulkDelete = () => {
    const selectedUserIds = Object.keys(rowSelection);
    console.log("Bulk delete users:", selectedUserIds);
    // Implement bulk delete logic
  };

  const handleExport = () => {
    console.log("Export users to CSV");
    // Implement export logic
  };

  const handleImport = () => {
    console.log("Import users from CSV");
    // Implement import logic
  };

  // Extract users and pagination info
  const users = usersData?.data || [];
  const totalUsers = usersData?.total || 0;
  const pageCount = usersData?.totalPages || 0;

  const columns: ColumnDef<User>[] = [
    {
      accessorKey: "name",
      header: ({ column }) => createSortableHeader(column, "Name"),
      cell: ({ row }) => (
        <div className="flex items-center space-x-3">
          <div className="h-10 w-10 flex-shrink-0">
            {row.original.avatar ? (
              <img
                className="h-10 w-10 rounded-full object-cover"
                src={row.original.avatar}
                alt={row.original.name}
              />
            ) : (
              <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                <span className="text-sm font-medium text-gray-700">
                  {row.original.name[0]}
                </span>
              </div>
            )}
          </div>
          <div>
            <div className="font-medium text-gray-900">{row.original.name}</div>
            <div className="text-sm text-gray-500">{row.original.email}</div>
          </div>
        </div>
      ),
    },
    {
      accessorKey: "role",
      header: ({ column }) => createSortableHeader(column, "Role"),
      cell: ({ row }) => (
        <Badge className={getRoleBadgeColor(row.getValue("role"))}>
          {(row.getValue("role") as string).charAt(0).toUpperCase() +
            (row.getValue("role") as string).slice(1)}
        </Badge>
      ),
      filterFn: (row, id, value) => {
        return value.includes(row.getValue(id));
      },
    },
    {
      accessorKey: "email",
      header: ({ column }) => createSortableHeader(column, "Email"),
      cell: ({ row }) => (
        <a
          href={`mailto:${row.getValue("email")}`}
          className="text-blue-600 hover:text-blue-900 hover:underline"
        >
          {row.getValue("email")}
        </a>
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
    {
      accessorKey: "updatedAt",
      header: ({ column }) => createSortableHeader(column, "Last Updated"),
      cell: ({ row }) => (
        <div className="min-w-[150px]">
          <div className="text-sm font-medium">
            {formatDate(row.getValue("updatedAt"))}
          </div>
          <div className="text-xs text-gray-500">
            {formatDateTime(row.getValue("updatedAt"))}
          </div>
        </div>
      ),
    },
    {
      id: "status",
      header: "Status",
      cell: ({ row }) => {
        const lastUpdate = new Date(row.original.updatedAt);
        const now = new Date();
        const daysSinceUpdate = Math.floor(
          (now.getTime() - lastUpdate.getTime()) / (1000 * 60 * 60 * 24)
        );

        if (daysSinceUpdate <= 7) {
          return <Badge className="bg-green-100 text-green-800">Active</Badge>;
        } else if (daysSinceUpdate <= 30) {
          return (
            <Badge className="bg-yellow-100 text-yellow-800">Inactive</Badge>
          );
        } else {
          return <Badge className="bg-red-100 text-red-800">Dormant</Badge>;
        }
      },
    },
    createActionColumn<User>(handleEdit, handleDelete, handleView, [
      {
        label: "Reset Password",
        onClick: (user) => console.log("Reset password for:", user.name),
      },
      {
        label: "Send Welcome Email",
        onClick: (user) => console.log("Send welcome email to:", user.email),
      },
      {
        label: "Change Role",
        onClick: (user) => console.log("Change role for:", user.name),
      },
    ]),
  ];

  // Calculate stats
  const adminCount = users.filter((u) => u.role === "admin").length;
  const managerCount = users.filter((u) => u.role === "manager").length;
  const staffCount = users.filter((u) => u.role === "staff").length;
  const activeUsers = users.filter((u) => {
    const daysSinceUpdate = Math.floor(
      (new Date().getTime() - new Date(u.updatedAt).getTime()) /
        (1000 * 60 * 60 * 24)
    );
    return daysSinceUpdate <= 7;
  }).length;

  return (
    <ProtectedRoute>
      <MainLayout user={currentUser || undefined}>
        <div className="space-y-6">
          {/* Page Header */}
          <PageHeader
            title="User Management"
            description="Manage user accounts, roles, and permissions"
            action={{
              label: "Add User",
              onClick: handleAddUser,
              icon: <UserPlus className="h-4 w-4" />,
            }}
            additionalActions={
              <>
                <Button variant="outline" onClick={handleImport}>
                  <Upload className="mr-2 h-4 w-4" />
                  Import
                </Button>
                <Button variant="outline" onClick={handleExport}>
                  <Download className="mr-2 h-4 w-4" />
                  Export
                </Button>
              </>
            }
          />

          {/* Stats Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Users
                </CardTitle>
                <UserPlus className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalUsers}</div>
                <p className="text-xs text-muted-foreground">
                  +2 new this month
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Active Users
                </CardTitle>
                <div className="h-2 w-2 rounded-full bg-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{activeUsers}</div>
                <p className="text-xs text-muted-foreground">
                  Active in last 7 days
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Admins</CardTitle>
                <Badge className="bg-red-100 text-red-800 text-xs">
                  {adminCount}
                </Badge>
              </CardHeader>
              <CardContent>
                <div className="text-sm">
                  <div className="flex justify-between">
                    <span>Managers:</span>
                    <span>{managerCount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Staff:</span>
                    <span>{staffCount}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Selected</CardTitle>
                <Filter className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {Object.keys(rowSelection).length}
                </div>
                {Object.keys(rowSelection).length > 0 && (
                  <Button
                    variant="destructive"
                    size="sm"
                    className="mt-2"
                    onClick={handleBulkDelete}
                  >
                    Delete Selected
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Users Table */}
          <Card className="pt-6">
            <CardContent>
              {error ? (
                <div className="text-center py-8">
                  <p className="text-red-600">
                    Failed to load users. Please check your backend connection.
                  </p>
                </div>
              ) : (
                <DataTable
                  columns={columns}
                  data={users}
                  searchKey="name"
                  searchPlaceholder="Search users by name, email, or role..."
                  onRowClick={(user) => router.push(`/users/${user.id}`)}
                  loading={isLoading}
                  pagination={{
                    pageIndex: pagination.pageIndex,
                    pageSize: pagination.pageSize,
                    pageCount,
                    total: totalUsers,
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

        {/* Create User Drawer */}
        <CreateUserDrawer
          isOpen={showCreateDrawer}
          onClose={() => setShowCreateDrawer(false)}
        />
      </MainLayout>
    </ProtectedRoute>
  );
}
