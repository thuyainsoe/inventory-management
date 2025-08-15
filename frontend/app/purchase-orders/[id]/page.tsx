"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Edit, Trash2, FileText, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { MainLayout } from "@/components/layout/main-layout";
import ProtectedRoute from "@/components/auth/protected-route";
import { useAuth } from "@/contexts/auth-context";
import { usePurchaseOrder, useDeletePurchaseOrder, useUpdatePurchaseOrderStatus } from "@/hooks/use-purchase-orders";
import { formatCurrency, formatDate } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Link from "next/link";

const statusColors = {
  draft: "bg-gray-100 text-gray-800",
  pending: "bg-yellow-100 text-yellow-800",
  approved: "bg-blue-100 text-blue-800",
  ordered: "bg-purple-100 text-purple-800",
  received: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
};

const statusOptions = [
  { label: "Draft", value: "draft" },
  { label: "Pending", value: "pending" },
  { label: "Approved", value: "approved" },
  { label: "Ordered", value: "ordered" },
  { label: "Received", value: "received" },
  { label: "Cancelled", value: "cancelled" },
];

export default function PurchaseOrderDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { user: currentUser } = useAuth();
  const { data: purchaseOrder, isLoading, error } = usePurchaseOrder(params.id);
  const deletePurchaseOrder = useDeletePurchaseOrder();
  const updateStatus = useUpdatePurchaseOrderStatus();

  const handleGoBack = () => {
    router.back();
  };

  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this purchase order?")) {
      try {
        await deletePurchaseOrder.mutateAsync(params.id);
        router.push("/purchase-orders");
      } catch (error) {
        console.error("Failed to delete purchase order:", error);
      }
    }
  };

  const handleStatusChange = async (newStatus: string) => {
    try {
      await updateStatus.mutateAsync({ id: params.id, status: newStatus });
    } catch (error) {
      console.error("Failed to update status:", error);
    }
  };

  if (error) {
    return (
      <ProtectedRoute>
        <MainLayout user={currentUser || undefined}>
          <div className="container mx-auto py-6">
            <div className="text-center text-red-600">
              Error loading purchase order. Please try again.
            </div>
          </div>
        </MainLayout>
      </ProtectedRoute>
    );
  }

  if (isLoading) {
    return (
      <ProtectedRoute>
        <MainLayout user={currentUser || undefined}>
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="mt-2 text-sm text-muted-foreground">
                Loading purchase order...
              </p>
            </div>
          </div>
        </MainLayout>
      </ProtectedRoute>
    );
  }

  if (!purchaseOrder) {
    return (
      <ProtectedRoute>
        <MainLayout user={currentUser || undefined}>
          <div className="container mx-auto py-6">
            <div className="text-center">
              Purchase order not found.
            </div>
          </div>
        </MainLayout>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <MainLayout user={currentUser || undefined}>
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <Button variant="outline" onClick={handleGoBack}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
            <div className="flex items-center gap-2">
              <Link href={`/purchase-orders/${params.id}/edit`}>
                <Button variant="outline">
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
                </Button>
              </Link>
              <Button variant="outline" onClick={handleDelete}>
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </Button>
            </div>
          </div>

          {/* Purchase Order Details */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center space-x-2">
                  <FileText className="h-5 w-5" />
                  <span>Purchase Order {purchaseOrder.poNumber}</span>
                </CardTitle>
                <div className="flex items-center gap-4">
                  <Badge className={statusColors[purchaseOrder.status as keyof typeof statusColors]}>
                    {purchaseOrder.status.charAt(0).toUpperCase() + purchaseOrder.status.slice(1)}
                  </Badge>
                  <Select
                    value={purchaseOrder.status}
                    onValueChange={handleStatusChange}
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {statusOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Basic Information */}
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">PO Date</label>
                    <p className="text-sm">{formatDate(purchaseOrder.poDate)}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Delivery Date</label>
                    <p className="text-sm">{purchaseOrder.deliveryDate ? formatDate(purchaseOrder.deliveryDate) : "Not specified"}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Payment Terms</label>
                    <p className="text-sm">{purchaseOrder.paymentTerms || "Not specified"}</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Payment Method</label>
                    <p className="text-sm">{purchaseOrder.paymentMethod || "Not specified"}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Created By</label>
                    <p className="text-sm">{purchaseOrder.creator?.name || "Unknown"}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Created At</label>
                    <p className="text-sm">{formatDate(purchaseOrder.createdAt)}</p>
                  </div>
                </div>
              </div>

              {/* Notes */}
              {purchaseOrder.notes && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Notes</label>
                  <p className="text-sm mt-1 p-3 bg-muted rounded-md">{purchaseOrder.notes}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Purchase Order Items */}
          <Card>
            <CardHeader>
              <CardTitle>Purchase Order Items</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>SKU</TableHead>
                    <TableHead className="text-right">Quantity</TableHead>
                    <TableHead className="text-right">Unit Price</TableHead>
                    <TableHead className="text-right">Discount</TableHead>
                    <TableHead className="text-right">Tax</TableHead>
                    <TableHead className="text-right">Line Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {purchaseOrder.items.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">
                        {item.product?.name || "Unknown Product"}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {item.product?.sku || "-"}
                      </TableCell>
                      <TableCell className="text-right">{item.quantity}</TableCell>
                      <TableCell className="text-right">{formatCurrency(item.unitPrice)}</TableCell>
                      <TableCell className="text-right">{formatCurrency(item.discount)}</TableCell>
                      <TableCell className="text-right">{formatCurrency(item.tax)}</TableCell>
                      <TableCell className="text-right font-medium">
                        {formatCurrency(item.lineTotal)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Total Amount:</span>
                  <span className="font-bold text-lg">{formatCurrency(purchaseOrder.totalAmount)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Paid Amount:</span>
                  <span className="font-medium">{formatCurrency(purchaseOrder.paidAmount)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Balance:</span>
                  <span className="font-medium text-red-600">
                    {formatCurrency(purchaseOrder.totalAmount - purchaseOrder.paidAmount)}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </MainLayout>
    </ProtectedRoute>
  );
}