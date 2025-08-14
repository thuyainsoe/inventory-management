"use client";

import { useState } from "react";
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
import {
  Plus,
  TrendingUp,
  TrendingDown,
  RefreshCw,
  Truck,
  Package,
  ArrowUpCircle,
  ArrowDownCircle,
} from "lucide-react";
import type { StockMovement } from "@/types";
import { ColumnDef } from "@tanstack/react-table";
import { formatDateTime } from "@/lib/utils";

// Mock user data
const mockUser = {
  name: "John Doe",
  email: "john@example.com",
  role: "Admin",
  avatar: undefined,
};

// Extended stock movement type for display
interface ExtendedStockMovement extends StockMovement {
  productName: string;
  productSku: string;
  userName: string;
  location: string;
}

// Mock stock movements data
const mockStockMovements: ExtendedStockMovement[] = [
  {
    id: "1",
    productId: "1",
    productName: "iPhone 15 Pro",
    productSku: "IPH-15P-001",
    type: "in",
    quantity: 50,
    reference: "PO-2024-001",
    notes: "New shipment from supplier",
    userName: "Alice Johnson",
    location: "Main Warehouse",
    createdAt: "2024-12-13T09:15:00Z",
  },
  {
    id: "2",
    productId: "2",
    productName: "Samsung Galaxy S24",
    productSku: "SAM-S24-001",
    type: "out",
    quantity: 15,
    reference: "SO-2024-123",
    notes: "Customer order fulfillment",
    userName: "Bob Smith",
    location: "Main Warehouse",
    createdAt: "2024-12-13T08:45:00Z",
  },
  {
    id: "3",
    productId: "3",
    productName: "MacBook Air M2",
    productSku: "MBA-M2-001",
    type: "adjustment",
    quantity: -2,
    reference: "ADJ-2024-005",
    notes: "Inventory count discrepancy",
    userName: "Carol Williams",
    location: "Main Warehouse",
    createdAt: "2024-12-13T07:30:00Z",
  },
  {
    id: "4",
    productId: "4",
    productName: "AirPods Pro",
    productSku: "APP-PRO-001",
    type: "transfer",
    quantity: 25,
    reference: "TRF-2024-012",
    notes: "Transfer to Store Location A",
    userName: "David Brown",
    location: "Store A",
    createdAt: "2024-12-12T16:20:00Z",
  },
  {
    id: "5",
    productId: "1",
    productName: "iPhone 15 Pro",
    productSku: "IPH-15P-001",
    type: "out",
    quantity: 8,
    reference: "SO-2024-124",
    notes: "Bulk corporate order",
    userName: "Emma Davis",
    location: "Main Warehouse",
    createdAt: "2024-12-12T14:15:00Z",
  },
  {
    id: "6",
    productId: "5",
    productName: "iPad Air",
    productSku: "IPA-AIR-001",
    type: "in",
    quantity: 30,
    reference: "PO-2024-002",
    notes: "Restock order",
    userName: "Frank Miller",
    location: "Main Warehouse",
    createdAt: "2024-12-12T11:00:00Z",
  },
  {
    id: "7",
    productId: "6",
    productName: "Apple Watch Series 9",
    productSku: "AW-S9-001",
    type: "adjustment",
    quantity: 5,
    reference: "ADJ-2024-006",
    notes: "Found additional units during audit",
    userName: "Grace Lee",
    location: "Store B",
    createdAt: "2024-12-12T09:45:00Z",
  },
  {
    id: "8",
    productId: "2",
    productName: "Samsung Galaxy S24",
    productSku: "SAM-S24-001",
    type: "out",
    quantity: 3,
    reference: "SO-2024-125",
    notes: "Online order shipment",
    userName: "Henry Wilson",
    location: "Distribution Center",
    createdAt: "2024-12-11T18:30:00Z",
  },
  {
    id: "9",
    productId: "7",
    productName: "Google Pixel 8",
    productSku: "GPX-8-001",
    type: "transfer",
    quantity: 12,
    reference: "TRF-2024-013",
    notes: "Transfer from Store B to Main Warehouse",
    userName: "Ivy Taylor",
    location: "Main Warehouse",
    createdAt: "2024-12-11T15:20:00Z",
  },
  {
    id: "10",
    productId: "8",
    productName: "OnePlus 12",
    productSku: "OP-12-001",
    type: "in",
    quantity: 20,
    reference: "PO-2024-003",
    notes: "New product launch stock",
    userName: "Jack Anderson",
    location: "Main Warehouse",
    createdAt: "2024-12-11T12:10:00Z",
  },
  {
    id: "11",
    productId: "3",
    productName: "MacBook Air M2",
    productSku: "MBA-M2-001",
    type: "out",
    quantity: 1,
    reference: "SO-2024-126",
    notes: "Employee purchase",
    userName: "Kate Thompson",
    location: "Main Warehouse",
    createdAt: "2024-12-10T16:45:00Z",
  },
  {
    id: "12",
    productId: "9",
    productName: "Surface Pro 9",
    productSku: "SP-9-001",
    type: "adjustment",
    quantity: -1,
    reference: "ADJ-2024-007",
    notes: "Damaged unit removed from inventory",
    userName: "Liam Garcia",
    location: "Store A",
    createdAt: "2024-12-10T14:30:00Z",
  },
];

// Movement type configurations
const movementTypeConfig = {
  in: {
    icon: ArrowUpCircle,
    color: "bg-green-100 text-green-800",
    label: "Stock In",
  },
  out: {
    icon: ArrowDownCircle,
    color: "bg-red-100 text-red-800",
    label: "Stock Out",
  },
  adjustment: {
    icon: RefreshCw,
    color: "bg-yellow-100 text-yellow-800",
    label: "Adjustment",
  },
  transfer: {
    icon: Truck,
    color: "bg-blue-100 text-blue-800",
    label: "Transfer",
  },
};

export default function StockMovementsPage() {
  const [movements] = useState<ExtendedStockMovement[]>(mockStockMovements);

  const handleView = (movement: ExtendedStockMovement) => {
    console.log("View movement details:", movement);
  };

  const handleRevert = (movement: ExtendedStockMovement) => {
    console.log("Revert movement:", movement);
  };

  const handleAddMovement = () => {
    console.log("Add new stock movement");
  };

  const columns: ColumnDef<ExtendedStockMovement>[] = [
    {
      accessorKey: "createdAt",
      header: ({ column }) => createSortableHeader(column, "Date & Time"),
      cell: ({ row }) => (
        <div className="font-mono text-sm">
          {formatDateTime(row.getValue("createdAt"))}
        </div>
      ),
    },
    {
      accessorKey: "type",
      header: ({ column }) => createSortableHeader(column, "Type"),
      cell: ({ row }) => {
        const type = row.getValue("type") as keyof typeof movementTypeConfig;
        const config = movementTypeConfig[type];
        const Icon = config.icon;

        return (
          <div className="flex items-center space-x-2">
            <Icon className="h-4 w-4" />
            <Badge className={config.color}>{config.label}</Badge>
          </div>
        );
      },
      filterFn: (row, id, value) => {
        return value.includes(row.getValue(id));
      },
    },
    {
      accessorKey: "productName",
      header: ({ column }) => createSortableHeader(column, "Product"),
      cell: ({ row }) => (
        <div>
          <div className="font-medium text-gray-900">
            {row.original.productName}
          </div>
          <div className="text-sm text-gray-500 font-mono">
            {row.original.productSku}
          </div>
        </div>
      ),
    },
    {
      accessorKey: "quantity",
      header: ({ column }) => createSortableHeader(column, "Quantity"),
      cell: ({ row }) => {
        const quantity = row.getValue("quantity") as number;
        const type = row.original.type;

        return (
          <div className="flex items-center space-x-2">
            <span
              className={`font-medium ${
                quantity > 0
                  ? "text-green-600"
                  : quantity < 0
                  ? "text-red-600"
                  : "text-gray-600"
              }`}
            >
              {quantity > 0 && type !== "out" ? "+" : ""}
              {quantity}
            </span>
            <span className="text-sm text-gray-500">units</span>
          </div>
        );
      },
    },
    {
      accessorKey: "reference",
      header: "Reference",
      cell: ({ row }) => (
        <code className="text-sm bg-gray-100 px-2 py-1 rounded font-mono">
          {row.getValue("reference")}
        </code>
      ),
    },
    {
      accessorKey: "location",
      header: ({ column }) => createSortableHeader(column, "Location"),
      cell: ({ row }) => (
        <div className="flex items-center space-x-2">
          <Package className="h-4 w-4 text-gray-400" />
          <span className="text-sm">{row.getValue("location")}</span>
        </div>
      ),
    },
    {
      accessorKey: "userName",
      header: ({ column }) => createSortableHeader(column, "User"),
      cell: ({ row }) => (
        <div className="text-sm text-gray-900">{row.getValue("userName")}</div>
      ),
    },
    {
      accessorKey: "notes",
      header: "Notes",
      cell: ({ row }) => (
        <div className="max-w-xs">
          <div
            className="text-sm text-gray-600 truncate"
            title={row.getValue("notes")}
          >
            {row.getValue("notes")}
          </div>
        </div>
      ),
    },
    createActionColumn<ExtendedStockMovement>(
      undefined, // No edit for movements
      undefined, // No delete for movements (use revert instead)
      handleView,
      [
        {
          label: "Revert Movement",
          onClick: handleRevert,
        },
        {
          label: "Print Receipt",
          onClick: (movement) =>
            console.log("Print receipt for:", movement.reference),
        },
      ]
    ),
  ];

  // Calculate stats
  const totalMovements = movements.length;
  const stockIn = movements
    .filter((m) => m.type === "in")
    .reduce((sum, m) => sum + m.quantity, 0);
  const stockOut = movements
    .filter((m) => m.type === "out")
    .reduce((sum, m) => sum + Math.abs(m.quantity), 0);
  const netChange = stockIn - stockOut;
  const todayMovements = movements.filter((m) => {
    const today = new Date().toDateString();
    const movementDate = new Date(m.createdAt).toDateString();
    return today === movementDate;
  }).length;

  return (
    <MainLayout user={mockUser}>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Stock Movements
            </h1>
            <p className="text-muted-foreground">
              Track all inventory movements and changes in real-time
            </p>
          </div>
          <Button onClick={handleAddMovement}>
            <Plus className="mr-2 h-4 w-4" />
            Record Movement
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Movements
              </CardTitle>
              <RefreshCw className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalMovements}</div>
              <p className="text-xs text-muted-foreground">
                {todayMovements} today
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Stock In</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-xl font-bold text-green-600">+{stockIn}</div>
              <p className="text-xs text-muted-foreground">Units received</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Stock Out</CardTitle>
              <TrendingDown className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">-{stockOut}</div>
              <p className="text-xs text-muted-foreground">
                Units shipped/sold
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Net Change</CardTitle>
              <div
                className={`h-2 w-2 rounded-full ${
                  netChange >= 0 ? "bg-green-500" : "bg-red-500"
                }`}
              />
            </CardHeader>
            <CardContent>
              <div
                className={`text-2xl font-bold ${
                  netChange >= 0 ? "text-green-600" : "text-red-600"
                }`}
              >
                {netChange >= 0 ? "+" : ""}
                {netChange}
              </div>
              <p className="text-xs text-muted-foreground">
                Overall inventory change
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Stock Movements Table */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Stock Movements</CardTitle>
            <CardDescription>
              Complete history of all stock movements including receipts,
              shipments, adjustments, and transfers
            </CardDescription>
          </CardHeader>
          <CardContent>
            <DataTable
              columns={columns}
              data={movements}
              searchKey="productName"
              searchPlaceholder="Search by product name, SKU, reference, or notes..."
              onRowClick={(movement) =>
                console.log("Movement clicked:", movement)
              }
            />
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
