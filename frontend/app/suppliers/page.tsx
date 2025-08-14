"use client";

import { useState } from "react";
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
import { Plus, Building2, Star, Phone, Mail } from "lucide-react";
import type { Supplier } from "@/types";
import { ColumnDef } from "@tanstack/react-table";
import { formatDate, formatCurrency } from "@/lib/utils";
import { PageHeader } from "@/components/ui/page-header";
import ProtectedRoute from "@/components/auth/protected-route";
import { useAuth } from "@/contexts/auth-context";

// Mock suppliers data
const mockSuppliers: Supplier[] = [
  {
    id: "1",
    name: "TechSupplier Inc.",
    email: "contact@techsupplier.com",
    phone: "+1-555-0123",
    address: "123 Technology St, Tech City, TC 12345",
    contactPerson: "Sarah Chen",
    paymentTerms: "Net 30",
    rating: 4.8,
    createdAt: "2024-01-15T09:00:00Z",
    updatedAt: "2024-12-01T14:30:00Z",
  },
  {
    id: "2",
    name: "Global Electronics Ltd.",
    email: "sales@globalelectronics.com",
    phone: "+1-555-0124",
    address: "456 Electronics Ave, Gadget City, GC 23456",
    contactPerson: "Mike Rodriguez",
    paymentTerms: "Net 45",
    rating: 4.2,
    createdAt: "2024-02-20T10:15:00Z",
    updatedAt: "2024-11-28T16:45:00Z",
  },
  {
    id: "3",
    name: "Mobile Parts Direct",
    email: "orders@mobileparts.com",
    phone: "+1-555-0125",
    address: "789 Mobile Blvd, Phone City, PC 34567",
    contactPerson: "Emily Johnson",
    paymentTerms: "Net 15",
    rating: 3.9,
    createdAt: "2024-03-10T08:30:00Z",
    updatedAt: "2024-12-10T11:20:00Z",
  },
  {
    id: "4",
    name: "Computer Components Co.",
    email: "info@compcomponents.com",
    phone: "+1-555-0126",
    address: "321 Component Dr, Hardware City, HC 45678",
    contactPerson: "David Kim",
    paymentTerms: "Net 30",
    rating: 4.6,
    createdAt: "2024-04-05T13:45:00Z",
    updatedAt: "2024-12-08T09:15:00Z",
  },
  {
    id: "5",
    name: "Accessory Warehouse",
    email: "support@accessorywarehouse.com",
    phone: "+1-555-0127",
    address: "654 Accessory Lane, Parts Town, PT 56789",
    contactPerson: "Lisa Thompson",
    paymentTerms: "Net 20",
    rating: 4.1,
    createdAt: "2024-05-12T11:20:00Z",
    updatedAt: "2024-12-09T15:30:00Z",
  },
  {
    id: "6",
    name: "Premium Tech Solutions",
    email: "contact@premiumtech.com",
    phone: "+1-555-0128",
    address: "987 Premium Rd, Luxury City, LC 67890",
    contactPerson: "Robert Wilson",
    paymentTerms: "Net 60",
    rating: 4.9,
    createdAt: "2024-06-18T14:10:00Z",
    updatedAt: "2024-12-07T12:40:00Z",
  },
  {
    id: "7",
    name: "Budget Electronics",
    email: "sales@budgetelectronics.com",
    phone: "+1-555-0129",
    address: "147 Budget St, Economy City, EC 78901",
    contactPerson: "Amanda Garcia",
    paymentTerms: "Net 10",
    rating: 3.5,
    createdAt: "2024-07-22T16:30:00Z",
    updatedAt: "2024-12-11T10:55:00Z",
  },
  {
    id: "8",
    name: "International Parts Ltd.",
    email: "orders@intlparts.com",
    phone: "+1-555-0130",
    address: "258 International Blvd, Global City, GC 89012",
    contactPerson: "Carlos Martinez",
    paymentTerms: "Net 45",
    rating: 4.3,
    createdAt: "2024-08-14T09:45:00Z",
    updatedAt: "2024-12-06T14:20:00Z",
  },
];

// Rating badge colors
const getRatingBadgeColor = (rating: number) => {
  if (rating >= 4.5) return "bg-green-100 text-green-800";
  if (rating >= 4.0) return "bg-blue-100 text-blue-800";
  if (rating >= 3.5) return "bg-yellow-100 text-yellow-800";
  return "bg-red-100 text-red-800";
};

// Payment terms badge colors
const getPaymentTermsBadgeColor = (terms: string) => {
  if (terms.includes("10")) return "bg-green-100 text-green-800";
  if (terms.includes("15") || terms.includes("20"))
    return "bg-blue-100 text-blue-800";
  if (terms.includes("30")) return "bg-yellow-100 text-yellow-800";
  return "bg-red-100 text-red-800";
};

export default function SuppliersPage() {
  const { user } = useAuth();
  const [suppliers] = useState<Supplier[]>(mockSuppliers);

  const handleEdit = (supplier: Supplier) => {
    console.log("Edit supplier:", supplier);
  };

  const handleDelete = (supplier: Supplier) => {
    console.log("Delete supplier:", supplier);
  };

  const handleView = (supplier: Supplier) => {
    console.log("View supplier details:", supplier);
  };

  const handleAddSupplier = () => {
    console.log("Add new supplier");
  };

  const columns: ColumnDef<Supplier>[] = [
    {
      accessorKey: "name",
      header: ({ column }) => createSortableHeader(column, "Supplier"),
      cell: ({ row }) => (
        <div className="flex items-center space-x-3 min-w-[200px]">
          <div className="flex-shrink-0">
            <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
              <Building2 className="h-5 w-5 text-blue-600" />
            </div>
          </div>
          <div className="w-full">
            <div className="font-medium text-gray-900 min-w-fit">
              {row.original.name}
            </div>
            <div className="text-sm text-gray-500">
              {row.original.contactPerson}
            </div>
          </div>
        </div>
      ),
    },
    {
      accessorKey: "email",
      header: ({ column }) => createSortableHeader(column, "Contact"),
      cell: ({ row }) => (
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <Mail className="h-4 w-4 text-gray-400" />
            <a
              href={`mailto:${row.original.email}`}
              className="text-sm text-blue-600 hover:text-blue-900 hover:underline"
            >
              {row.original.email}
            </a>
          </div>
          <div className="flex items-center space-x-2">
            <Phone className="h-4 w-4 text-gray-400" />
            <span className="text-sm text-gray-600">{row.original.phone}</span>
          </div>
        </div>
      ),
    },
    {
      accessorKey: "address",
      header: "Address",
      cell: ({ row }) => (
        <div className="max-w-xs">
          <div className="text-sm text-gray-900 truncate">
            {row.getValue("address")}
          </div>
        </div>
      ),
    },
    {
      accessorKey: "paymentTerms",
      header: ({ column }) => createSortableHeader(column, "Payment Terms"),
      cell: ({ row }) => (
        <Badge
          className={getPaymentTermsBadgeColor(row.getValue("paymentTerms"))}
        >
          {row.getValue("paymentTerms")}
        </Badge>
      ),
    },
    {
      accessorKey: "rating",
      header: ({ column }) => createSortableHeader(column, "Rating"),
      cell: ({ row }) => {
        const rating = row.getValue("rating") as number;
        return (
          <div className="flex items-center space-x-2">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${
                    i < Math.floor(rating)
                      ? "text-yellow-400 fill-current"
                      : "text-gray-300"
                  }`}
                />
              ))}
            </div>
            <Badge className={getRatingBadgeColor(rating)}>
              {rating.toFixed(1)}
            </Badge>
          </div>
        );
      },
    },
    {
      accessorKey: "createdAt",
      header: ({ column }) => createSortableHeader(column, "Since"),
      cell: ({ row }) => (
        <div className="text-sm text-gray-900">
          {formatDate(row.getValue("createdAt"))}
        </div>
      ),
    },
    createActionColumn<Supplier>(handleEdit, handleDelete, handleView, [
      {
        label: "Create Order",
        onClick: (supplier) => console.log("Create order for:", supplier.name),
      },
      {
        label: "View Orders",
        onClick: (supplier) => console.log("View orders from:", supplier.name),
      },
      {
        label: "Rate Supplier",
        onClick: (supplier) => console.log("Rate supplier:", supplier.name),
      },
    ]),
  ];

  // Calculate stats
  const totalSuppliers = suppliers.length;
  const avgRating =
    suppliers.reduce((sum, s) => sum + s.rating, 0) / suppliers.length;
  const topRatedSuppliers = suppliers.filter((s) => s.rating >= 4.5).length;
  const activeSuppliers = suppliers.filter((s) => {
    const daysSinceUpdate = Math.floor(
      (new Date().getTime() - new Date(s.updatedAt).getTime()) /
        (1000 * 60 * 60 * 24)
    );
    return daysSinceUpdate <= 30;
  }).length;

  return (
    <ProtectedRoute>
      <MainLayout user={user || undefined}>
      <div className="space-y-6">
        {/* Page Header */}
        <PageHeader
          title="Supplier Management"
          description="Manage your suppliers, track performance, and maintain relationships"
          action={{
            label: "Add Supplier",
            onClick: handleAddSupplier,
            icon: <Plus className="h-4 w-4" />,
          }}
        />

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Suppliers
              </CardTitle>
              <Building2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalSuppliers}</div>
              <p className="text-xs text-muted-foreground">
                +2 new this quarter
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Active Suppliers
              </CardTitle>
              <div className="h-2 w-2 rounded-full bg-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activeSuppliers}</div>
              <p className="text-xs text-muted-foreground">
                Active in last 30 days
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Average Rating
              </CardTitle>
              <Star className="h-4 w-4 text-yellow-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{avgRating.toFixed(1)}</div>
              <p className="text-xs text-muted-foreground">Out of 5.0 stars</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Top Rated</CardTitle>
              <Badge className="bg-green-100 text-green-800">
                {topRatedSuppliers}
              </Badge>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-muted-foreground">
                Suppliers with 4.5+ rating
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Suppliers Table */}
        <Card>
          <CardHeader>
            <CardTitle>All Suppliers</CardTitle>
            <CardDescription>
              Comprehensive list of all suppliers with ratings, contact
              information, and payment terms
            </CardDescription>
          </CardHeader>
          <CardContent>
            <DataTable
              columns={columns}
              data={suppliers}
              searchKey="name"
              searchPlaceholder="Search suppliers by name, contact person, or email..."
              onRowClick={(supplier) =>
                console.log("Supplier clicked:", supplier)
              }
            />
          </CardContent>
        </Card>
      </div>
    </MainLayout>
    </ProtectedRoute>
  );
}
