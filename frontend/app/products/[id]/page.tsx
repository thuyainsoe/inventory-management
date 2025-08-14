"use client";
import { useRouter } from "next/navigation";
import { MainLayout } from "@/components/layout/main-layout";
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
  ArrowLeft,
  Package,
  Edit,
  Trash2,
  DollarSign,
  TrendingUp,
  AlertCircle,
  Calendar,
  Hash,
} from "lucide-react";
import { formatCurrency, getStockStatus } from "@/lib/utils";
import { STOCK_STATUS_COLORS } from "@/lib/constants";
import {
  useProducts,
  useDeleteProduct,
  useProduct,
} from "@/hooks/use-products";

const mockUser = {
  name: "John Doe",
  email: "john@example.com",
  role: "Admin",
  avatar: undefined,
};

interface ProductDetailPageProps {
  params: {
    id: string;
  };
}

export default function ProductDetailPage({ params }: ProductDetailPageProps) {
  const router = useRouter();
  const { data: product } = useProduct(params.id);
  const deleteProductMutation = useDeleteProduct();

  const handleEdit = () => {
    console.log("Edit product:", product);
  };

  const handleDelete = async () => {
    if (!product) return;

    if (window.confirm(`Are you sure you want to delete "${product.name}"?`)) {
      try {
        await deleteProductMutation.mutateAsync(product.id);
        router.push("/products");
      } catch (error) {
        console.error("Failed to delete product:", error);
      }
    }
  };

  const handleGoBack = () => {
    router.back();
  };

  if (!product) {
    return (
      <MainLayout user={mockUser}>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Package className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-4 text-lg font-semibold">Product not found</h3>
            <p className="mt-2 text-muted-foreground">
              The product you're looking for doesn't exist.
            </p>
            <Button onClick={handleGoBack} className="mt-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Go Back
            </Button>
          </div>
        </div>
      </MainLayout>
    );
  }

  const stockStatus = getStockStatus(product.stock, product.minStock);

  const totalValue = product.price * product.stock;

  return (
    <MainLayout user={mockUser}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Button variant="outline" onClick={handleGoBack}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <div className="flex space-x-2">
            <Button variant="outline" onClick={handleEdit}>
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </Button>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main Product Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
            <Card className="modern-card border-0">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Package className="h-5 w-5" />
                  <span>Product Information</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Product Name
                    </label>
                    <p className="text-lg font-semibold">{product.name}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Category
                    </label>
                    <div className="mt-1">
                      <Badge variant="secondary">{product.category}</Badge>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground flex items-center space-x-1">
                      <Hash className="h-3 w-3" />
                      <span>SKU</span>
                    </label>
                    <p className="font-mono text-sm bg-muted px-2 py-1 rounded mt-1">
                      {product.sku}
                    </p>
                  </div>
                  {product.barcode && (
                    <div>
                      <label className="text-sm font-medium text-muted-foreground flex items-center space-x-1">
                        {/* <Barcode className="h-3 w-3" /> */}
                        <span>Barcode</span>
                      </label>
                      <p className="font-mono text-sm bg-muted px-2 py-1 rounded mt-1">
                        {product.barcode}
                      </p>
                    </div>
                  )}
                </div>
                {product.description && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Description
                    </label>
                    <p className="mt-1 text-foreground">
                      {product.description}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Pricing Information */}
            <Card className="modern-card border-0">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <DollarSign className="h-5 w-5" />
                  <span>Pricing & Costs</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-3">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Selling Price
                    </label>
                    <p className="text-xl font-bold text-green-600">
                      {formatCurrency(product.price)}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Cost Price
                    </label>
                    <p className="text-xl font-bold text-orange-600">
                      {formatCurrency(product.cost)}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Profit Margin
                    </label>
                    <p className="text-xl font-bold text-blue-600">
                      {(
                        ((product.price - product.cost) / product.price) *
                          100 || 0
                      ).toFixed(1)}
                      %
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Images Section */}
            {product.images && product.images.length > 0 && (
              <Card className="modern-card border-0">
                <CardHeader>
                  <CardTitle>Product Images</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-3">
                    {product.images.map((image, index) => (
                      <div
                        key={index}
                        className="aspect-square bg-muted rounded-lg flex items-center justify-center"
                      >
                        <Package className="h-8 w-8 text-muted-foreground" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar - Stats & Actions */}
          <div className="space-y-6">
            {/* Stock Information */}
            <Card className="modern-card border-0">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5" />
                  <span>Stock Status</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Current Stock
                  </label>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className="text-2xl font-bold">{product.stock}</span>
                    <Badge
                      variant="secondary"
                      className={
                        STOCK_STATUS_COLORS[
                          stockStatus as keyof typeof STOCK_STATUS_COLORS
                        ]
                      }
                    >
                      {stockStatus.replace("-", " ")}
                    </Badge>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Minimum Stock Level
                  </label>
                  <p className="text-xl font-semibold mt-1">
                    {product.minStock}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Total Stock Value
                  </label>
                  <p className="text-xl font-bold text-green-600 mt-1">
                    {formatCurrency(totalValue)}
                  </p>
                </div>
                {stockStatus === "low-stock" ||
                  (stockStatus === "out-of-stock" && (
                    <div className="flex items-center space-x-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <AlertCircle className="h-4 w-4 text-yellow-600" />
                      <span className="text-sm text-yellow-800">
                        {stockStatus === "out-of-stock"
                          ? "This product is out of stock"
                          : "This product is running low on stock"}
                      </span>
                    </div>
                  ))}
              </CardContent>
            </Card>

            {/* Timestamps */}
            <Card className="modern-card border-0">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Calendar className="h-5 w-5" />
                  <span>Timestamps</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Created
                  </label>
                  <p className="text-sm">
                    {new Date(product.createdAt).toLocaleDateString()} at{" "}
                    {new Date(product.createdAt).toLocaleTimeString()}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Last Updated
                  </label>
                  <p className="text-sm">
                    {new Date(product.updatedAt).toLocaleDateString()} at{" "}
                    {new Date(product.updatedAt).toLocaleTimeString()}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="modern-card border-0">
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button className="w-full" variant="outline">
                  Adjust Stock
                </Button>
                <Button className="w-full" variant="outline">
                  Update Price
                </Button>
                <Button className="w-full" variant="outline">
                  Generate Barcode
                </Button>
                <Button className="w-full" variant="outline">
                  Duplicate Product
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
