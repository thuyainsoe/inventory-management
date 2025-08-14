"use client";

import { useRouter } from "next/navigation";
import { MainLayout } from "@/components/layout/main-layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ArrowLeft,
  Folder,
  Edit,
  Trash2,
  Package,
  Calendar,
  Palette,
  Eye,
  EyeOff,
} from "lucide-react";
import { formatDate, formatDateTime } from "@/lib/utils";
import ProtectedRoute from "@/components/auth/protected-route";
import { useAuth } from "@/contexts/auth-context";
import { useCategory, useDeleteCategory } from "@/hooks/use-categories";

interface CategoryDetailPageProps {
  params: {
    id: string;
  };
}

export default function CategoryDetailPage({ params }: CategoryDetailPageProps) {
  const router = useRouter();
  const { user: currentUser } = useAuth();
  const { data: category, isLoading, error } = useCategory(parseInt(params.id));
  const deleteCategoryMutation = useDeleteCategory();

  const handleEdit = () => {
    // This would open edit drawer - for now just log
    console.log("Edit category:", category);
  };

  const handleDelete = async () => {
    if (!category) return;

    if (window.confirm(`Are you sure you want to delete "${category.name}"?`)) {
      try {
        await deleteCategoryMutation.mutateAsync(category.id);
        router.push("/categories");
      } catch (error) {
        console.error("Failed to delete category:", error);
      }
    }
  };

  const handleGoBack = () => {
    router.back();
  };

  if (isLoading) {
    return (
      <ProtectedRoute>
        <MainLayout user={currentUser || undefined}>
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
              <p className="mt-4 text-muted-foreground">Loading category details...</p>
            </div>
          </div>
        </MainLayout>
      </ProtectedRoute>
    );
  }

  if (error || !category) {
    return (
      <ProtectedRoute>
        <MainLayout user={currentUser || undefined}>
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <Folder className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-semibold">Category not found</h3>
              <p className="mt-2 text-muted-foreground">
                The category you're looking for doesn't exist.
              </p>
              <Button onClick={handleGoBack} className="mt-4">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Go Back
              </Button>
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
            <div className="flex space-x-2">
              <Button variant="outline" onClick={handleEdit}>
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </Button>
              {currentUser?.role === "admin" && (
                <Button variant="destructive" onClick={handleDelete}>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </Button>
              )}
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {/* Main Category Info */}
            <div className="lg:col-span-2 space-y-6">
              {/* Basic Information */}
              <Card className="modern-card border-0">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Folder className="h-5 w-5" />
                    <span>Category Information</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <div 
                      className="h-16 w-16 rounded-lg flex items-center justify-center text-white"
                      style={{ backgroundColor: category.color }}
                    >
                      <Folder className="h-8 w-8" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold">{category.name}</h2>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge 
                          className={category.isActive 
                            ? "bg-green-100 text-green-800" 
                            : "bg-gray-100 text-gray-800"
                          }
                        >
                          {category.isActive ? (
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
                      </div>
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">
                        Color
                      </label>
                      <div className="flex items-center space-x-2 mt-1">
                        <div 
                          className="h-6 w-6 rounded border"
                          style={{ backgroundColor: category.color }}
                        />
                        <span className="text-sm font-mono">{category.color}</span>
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">
                        Icon
                      </label>
                      <div className="flex items-center space-x-2 mt-1">
                        <Folder className="h-4 w-4" />
                        <span className="text-sm">{category.icon}</span>
                      </div>
                    </div>
                  </div>

                  {category.description && (
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">
                        Description
                      </label>
                      <p className="mt-1 text-foreground">
                        {category.description}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Products in Category */}
              <Card className="modern-card border-0">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Package className="h-5 w-5" />
                    <span>Products in Category</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8 text-muted-foreground">
                    <Package className="mx-auto h-8 w-8 mb-2" />
                    <p>Product listing coming soon</p>
                    <p className="text-sm">View all products in this category</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar - Stats & Actions */}
            <div className="space-y-6">
              {/* Category Stats */}
              <Card className="modern-card border-0">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Package className="h-5 w-5" />
                    <span>Category Stats</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Products
                    </label>
                    <p className="text-2xl font-bold mt-1">
                      {category.productCount || 0}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Status
                    </label>
                    <div className="mt-1">
                      <Badge 
                        className={category.isActive 
                          ? "bg-green-100 text-green-800" 
                          : "bg-gray-100 text-gray-800"
                        }
                      >
                        {category.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                  </div>
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
                    <div className="mt-1">
                      <div className="text-sm font-medium">
                        {formatDate(category.createdAt)}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {formatDateTime(category.createdAt)}
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Last Updated
                    </label>
                    <div className="mt-1">
                      <div className="text-sm font-medium">
                        {formatDate(category.updatedAt)}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {formatDateTime(category.updatedAt)}
                      </div>
                    </div>
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
                    <Package className="mr-2 h-4 w-4" />
                    View Products
                  </Button>
                  <Button className="w-full" variant="outline">
                    <Palette className="mr-2 h-4 w-4" />
                    Change Color
                  </Button>
                  <Button className="w-full" variant="outline">
                    <Edit className="mr-2 h-4 w-4" />
                    Edit Details
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </MainLayout>
    </ProtectedRoute>
  );
}