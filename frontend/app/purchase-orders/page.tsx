"use client";

import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  Plus,
  Filter,
  Eye,
  Edit,
  Trash2,
  ShoppingCart,
  FileText,
  Clock,
  DollarSign,
} from "lucide-react";
import { MainLayout } from "@/components/layout/main-layout";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DataTable } from "@/components/tables/data-table";
import { PageHeader } from "@/components/ui/page-header";
import {
  usePurchaseOrders,
  useDeletePurchaseOrder,
} from "@/hooks/use-purchase-orders";
import { PurchaseOrder } from "@/types";
import { formatCurrency } from "@/lib/utils";
import { 
  LinkCell, 
  DateCell, 
  StatusCell, 
  CurrencyCell, 
  NumberCell, 
  TextCell, 
  ActionCell 
} from "@/components/tables/cells";
import { ColumnDef } from "@tanstack/react-table";
import ProtectedRoute from "@/components/auth/protected-route";
import { useAuth } from "@/contexts/auth-context";


export default function PurchaseOrdersPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("");

  const { data, isLoading, error } = usePurchaseOrders(
    page,
    20,
    "",
    statusFilter
  );
  const deletePurchaseOrder = useDeletePurchaseOrder();

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this purchase order?")) {
      try {
        await deletePurchaseOrder.mutateAsync(id);
      } catch (error) {
        console.error("Failed to delete purchase order:", error);
      }
    }
  };

  const handleAddPurchaseOrder = () => {
    router.push("/purchase-orders/create");
  };

  // Calculate stats
  const totalPurchaseOrders = data?.total || 0;
  const draftOrders =
    data?.data.filter((po) => po.status === "draft").length || 0;
  const pendingOrders =
    data?.data.filter((po) => po.status === "pending").length || 0;
  const totalValue =
    data?.data.reduce((sum, po) => sum + po.totalAmount, 0) || 0;

  const columns = useMemo<ColumnDef<PurchaseOrder>[]>(
    () => [
      {
        accessorKey: "poNumber",
        header: "PO Number",
        cell: ({ row }) => (
          <LinkCell
            value={row.getValue("poNumber") as string}
            href={`/purchase-orders/${row.original.id}`}
          />
        ),
      },
      {
        accessorKey: "poDate",
        header: "PO Date",
        cell: ({ row }) => (
          <DateCell value={row.getValue("poDate") as string} />
        ),
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => (
          <StatusCell
            value={row.getValue("status") as string}
            statusConfig={{
              draft: { color: "bg-gray-100 text-gray-800" },
              pending: { color: "bg-yellow-100 text-yellow-800" },
              approved: { color: "bg-blue-100 text-blue-800" },
              ordered: { color: "bg-purple-100 text-purple-800" },
              received: { color: "bg-green-100 text-green-800" },
              cancelled: { color: "bg-red-100 text-red-800" },
            }}
          />
        ),
      },
      {
        accessorKey: "deliveryDate",
        header: "Delivery Date",
        cell: ({ row }) => (
          <DateCell value={row.getValue("deliveryDate") as string} />
        ),
      },
      {
        accessorKey: "totalAmount",
        header: "Total Amount",
        cell: ({ row }) => (
          <CurrencyCell value={row.getValue("totalAmount") as number} />
        ),
      },
      {
        accessorKey: "items",
        header: "Items",
        cell: ({ row }) => {
          const value = row.getValue("items") as any[];
          return (
            <NumberCell 
              value={value?.length || 0} 
              suffix=" items"
            />
          );
        },
      },
      {
        accessorKey: "creator",
        header: "Created By",
        cell: ({ row }) => {
          const value = row.getValue("creator") as any;
          return (
            <TextCell value={value?.name} />
          );
        },
      },
      {
        accessorKey: "createdAt",
        header: "Created",
        cell: ({ row }) => (
          <DateCell value={row.getValue("createdAt") as string} />
        ),
      },
      {
        id: "actions",
        enableHiding: false,
        cell: ({ row }) => {
          const purchaseOrder = row.original;
          return (
            <ActionCell
              actions={[
                {
                  label: "View",
                  onClick: () => router.push(`/purchase-orders/${purchaseOrder.id}`),
                  icon: <Eye className="h-4 w-4" />,
                },
                {
                  label: "Edit",
                  onClick: () => router.push(`/purchase-orders/${purchaseOrder.id}/edit`),
                  icon: <Edit className="h-4 w-4" />,
                },
                {
                  label: "Delete",
                  onClick: () => handleDelete(purchaseOrder.id),
                  icon: <Trash2 className="h-4 w-4" />,
                  variant: "destructive",
                  separator: true,
                },
              ]}
            />
          );
        },
      },
    ],
    [handleDelete]
  );

  if (error) {
    return (
      <ProtectedRoute>
        <MainLayout user={user || undefined}>
          <div className="container mx-auto py-6">
            <div className="text-center text-red-600">
              Error loading purchase orders. Please try again.
            </div>
          </div>
        </MainLayout>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <MainLayout user={user || undefined}>
        <div className="space-y-6">
          {/* Page Header */}
          <PageHeader
            title="Purchase Orders"
            description="Manage your purchase orders and track supplier orders"
            action={{
              label: "New Purchase Order",
              onClick: handleAddPurchaseOrder,
              icon: <Plus className="h-4 w-4" />,
            }}
          />

          {/* Stats Cards */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card className="modern-card border-0">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total Purchase Orders
                </CardTitle>
                <div className="p-2 rounded-lg gradient-blue text-white">
                  <ShoppingCart className="h-4 w-4" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-foreground">
                  {totalPurchaseOrders}
                </div>
                <p className="text-sm text-muted-foreground">
                  Active purchase orders
                </p>
              </CardContent>
            </Card>

            <Card className="modern-card border-0">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total Order Value
                </CardTitle>
                <div className="p-2 rounded-lg gradient-green text-white">
                  <DollarSign className="h-4 w-4" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-foreground">
                  {formatCurrency(totalValue)}
                </div>
                <p className="text-sm text-muted-foreground">
                  Total outstanding orders
                </p>
              </CardContent>
            </Card>

            <Card className="modern-card border-0">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Draft Orders
                </CardTitle>
                <div className="p-2 rounded-lg gradient-yellow text-white">
                  <FileText className="h-4 w-4" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-foreground">
                  {draftOrders}
                </div>
                <p className="text-sm text-muted-foreground">
                  Orders in draft status
                </p>
              </CardContent>
            </Card>

            <Card className="modern-card border-0">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Pending Orders
                </CardTitle>
                <div className="p-2 rounded-lg gradient-purple text-white">
                  <Clock className="h-4 w-4" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-foreground">
                  {pendingOrders}
                </div>
                <p className="text-sm text-muted-foreground">
                  Orders awaiting approval
                </p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardContent className="pt-6">
              <DataTable
                data={data?.data || []}
                columns={columns}
                loading={isLoading}
                pagination={{
                  pageIndex: page - 1,
                  pageSize: 20,
                  pageCount: data?.totalPages || 0,
                  total: data?.total || 0,
                }}
                manualPagination={true}
                onPaginationChange={(updater) => {
                  if (typeof updater === "function") {
                    const newPagination = updater({
                      pageIndex: page - 1,
                      pageSize: 20,
                    });
                    setPage(newPagination.pageIndex + 1);
                  } else {
                    setPage(updater.pageIndex + 1);
                  }
                }}
                customControls={
                  <Select
                    value={statusFilter || "all"}
                    onValueChange={(value) =>
                      setStatusFilter(value === "all" ? "" : value)
                    }
                  >
                    <SelectTrigger className="w-48">
                      <Filter className="mr-2 h-4 w-4" />
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="approved">Approved</SelectItem>
                      <SelectItem value="ordered">Ordered</SelectItem>
                      <SelectItem value="received">Received</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                }
              />
            </CardContent>
          </Card>
        </div>
      </MainLayout>
    </ProtectedRoute>
  );
}
