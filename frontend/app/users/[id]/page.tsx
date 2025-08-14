"use client";

import { useRouter } from "next/navigation";
import { MainLayout } from "@/components/layout/main-layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ArrowLeft,
  User as UserIcon,
  Edit,
  Trash2,
  Mail,
  Shield,
  Calendar,
  Clock,
  UserCheck,
  Settings,
} from "lucide-react";
import { formatDate, formatDateTime } from "@/lib/utils";
import ProtectedRoute from "@/components/auth/protected-route";
import { useAuth } from "@/contexts/auth-context";
import { useUser, useDeleteUser } from "@/hooks/use-users";

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

// Role permissions
const getRolePermissions = (role: string) => {
  switch (role) {
    case "admin":
      return [
        "Full system access",
        "User management",
        "Settings configuration",
        "Data export/import",
        "System reports",
      ];
    case "manager":
      return [
        "Inventory management",
        "Order processing",
        "Staff supervision",
        "Basic reports",
      ];
    case "staff":
      return ["Product viewing", "Order viewing", "Basic inventory tasks"];
    default:
      return [];
  }
};

interface UserDetailPageProps {
  params: {
    id: string;
  };
}

export default function UserDetailPage({ params }: UserDetailPageProps) {
  const router = useRouter();
  const { user: currentUser } = useAuth();
  const { data: user, isLoading, error } = useUser(parseInt(params.id));
  const deleteUserMutation = useDeleteUser();

  const handleEdit = () => {
    console.log("Edit user:", user);
    // Implement edit logic - could open a drawer or navigate to edit page
  };

  const handleDelete = async () => {
    if (!user) return;

    if (window.confirm(`Are you sure you want to delete "${user.name}"?`)) {
      try {
        await deleteUserMutation.mutateAsync(user.id);
        router.push("/users");
      } catch (error) {
        console.error("Failed to delete user:", error);
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
              <p className="mt-4 text-muted-foreground">
                Loading user details...
              </p>
            </div>
          </div>
        </MainLayout>
      </ProtectedRoute>
    );
  }

  if (error || !user) {
    return (
      <ProtectedRoute>
        <MainLayout user={currentUser || undefined}>
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <UserIcon className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-semibold">User not found</h3>
              <p className="mt-2 text-muted-foreground">
                The user you're looking for doesn't exist.
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

  const permissions = getRolePermissions(user.role);
  const isActiveUser = () => {
    const lastUpdate = new Date(user.updatedAt);
    const now = new Date();
    const daysSinceUpdate = Math.floor(
      (now.getTime() - lastUpdate.getTime()) / (1000 * 60 * 60 * 24)
    );
    return daysSinceUpdate <= 7;
  };

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
              {currentUser?.role === "admin" && user.id !== currentUser.id && (
                <Button variant="destructive" onClick={handleDelete}>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </Button>
              )}
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {/* Main User Info */}
            <div className="lg:col-span-2 space-y-6">
              {/* Basic Information */}
              <Card className="modern-card border-0">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <UserIcon className="h-5 w-5" />
                    <span>User Information</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <div className="h-16 w-16 flex-shrink-0">
                      {user.avatar ? (
                        <img
                          className="h-16 w-16 rounded-full object-cover"
                          src={user.avatar}
                          alt={user.name}
                        />
                      ) : (
                        <div className="h-16 w-16 rounded-full bg-gray-300 flex items-center justify-center">
                          <span className="text-xl font-medium text-gray-700">
                            {user.name[0]}
                          </span>
                        </div>
                      )}
                    </div>
                    <div>
                      <h2 className="text-xl font-bold">{user.name}</h2>
                      <div className="flex items-center space-x-2 mt-1">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <a
                          href={`mailto:${user.email}`}
                          className="text-blue-600 hover:text-blue-900 hover:underline text-sm"
                        >
                          {user.email}
                        </a>
                      </div>
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">
                        Role
                      </label>
                      <div className="mt-1">
                        <Badge className={getRoleBadgeColor(user.role)}>
                          <Shield className="mr-1 h-3 w-3" />
                          {user.role.charAt(0).toUpperCase() +
                            user.role.slice(1)}
                        </Badge>
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">
                        Status
                      </label>
                      <div className="mt-1">
                        {isActiveUser() ? (
                          <Badge className="bg-green-100 text-green-800">
                            <UserCheck className="mr-1 h-3 w-3" />
                            Active
                          </Badge>
                        ) : (
                          <Badge className="bg-gray-100 text-gray-800">
                            <Clock className="mr-1 h-3 w-3" />
                            Inactive
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Role Permissions */}
              <Card className="modern-card border-0">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Shield className="h-5 w-5" />
                    <span>Role Permissions</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {permissions.map((permission, index) => (
                      <div
                        key={index}
                        className="flex items-center space-x-2 p-2 bg-muted/50 rounded"
                      >
                        <UserCheck className="h-4 w-4 text-green-600" />
                        <span className="text-sm">{permission}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Activity Overview */}
              <Card className="modern-card border-0">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Clock className="h-5 w-5" />
                    <span>Activity Overview</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8 text-muted-foreground">
                    <Clock className="mx-auto h-8 w-8 mb-2" />
                    <p>Activity tracking coming soon</p>
                    <p className="text-sm">
                      Track user login history, actions, and more
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar - Stats & Actions */}
            <div className="space-y-6">
              {/* User Stats */}
              <Card className="modern-card border-0">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <UserCheck className="h-5 w-5" />
                    <span>User Stats</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Account Age
                    </label>
                    <p className="text-xl font-semibold mt-1">
                      {Math.floor(
                        (new Date().getTime() -
                          new Date(user.createdAt).getTime()) /
                          (1000 * 60 * 60 * 24)
                      )}{" "}
                      days
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Last Activity
                    </label>
                    <p className="text-sm mt-1">
                      {Math.floor(
                        (new Date().getTime() -
                          new Date(user.updatedAt).getTime()) /
                          (1000 * 60 * 60 * 24)
                      )}{" "}
                      days ago
                    </p>
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
                        {formatDate(user.createdAt)}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {formatDateTime(user.createdAt)}
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Last Updated
                    </label>
                    <div className="mt-1">
                      <div className="text-sm font-medium">
                        {formatDate(user.updatedAt)}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {formatDateTime(user.updatedAt)}
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
                    <Mail className="mr-2 h-4 w-4" />
                    Send Email
                  </Button>
                  <Button className="w-full" variant="outline">
                    <Shield className="mr-2 h-4 w-4" />
                    Change Role
                  </Button>
                  <Button className="w-full" variant="outline">
                    <Settings className="mr-2 h-4 w-4" />
                    Reset Password
                  </Button>
                  {currentUser?.role === "admin" && (
                    <Button className="w-full" variant="outline">
                      <UserCheck className="mr-2 h-4 w-4" />
                      Account Settings
                    </Button>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </MainLayout>
    </ProtectedRoute>
  );
}
