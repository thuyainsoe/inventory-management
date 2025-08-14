'use client'

import { MainLayout } from '@/components/layout/main-layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { BarChart3, Package, ShoppingCart, TrendingUp, Users, AlertCircle } from 'lucide-react'

// Mock user data - replace with actual user from authentication
const mockUser = {
  name: 'John Doe',
  email: 'john@example.com',
  role: 'Admin',
  avatar: undefined,
}

// Mock dashboard stats - replace with actual data from API
const dashboardStats = [
  {
    title: 'Total Products',
    value: '1,234',
    description: '+20.1% from last month',
    icon: Package,
    gradient: 'gradient-blue',
  },
  {
    title: 'Total Stock Value',
    value: '$45,231.89',
    description: '+180.1% from last month',
    icon: TrendingUp,
    gradient: 'gradient-green',
  },
  {
    title: 'Purchase Orders',
    value: '12',
    description: '+19% from last month',
    icon: ShoppingCart,
    gradient: 'gradient-orange',
  },
  {
    title: 'Low Stock Items',
    value: '23',
    description: 'Requires attention',
    icon: AlertCircle,
    gradient: 'gradient-pink',
  },
  {
    title: 'Active Suppliers',
    value: '45',
    description: '+2 new this month',
    icon: Users,
    gradient: 'gradient-purple',
  },
  {
    title: 'Sales This Month',
    value: '$12,234',
    description: '+25% from last month',
    icon: BarChart3,
    gradient: 'gradient-teal',
  },
]

export default function DashboardPage() {
  return (
    <MainLayout user={mockUser}>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold tracking-tight gradient-text">Dashboard</h1>
            <p className="text-muted-foreground text-lg">
              Welcome to your modern inventory management system
            </p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {dashboardStats.map((stat, index) => (
            <Card key={index} className="modern-card hover:shadow-xl transition-all duration-300 hover:scale-[1.02] border-0">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <div className={`p-3 rounded-xl ${stat.gradient} text-white shadow-lg`}>
                  <stat.icon className="h-5 w-5" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-foreground mb-2">{stat.value}</div>
                <p className="text-sm text-muted-foreground">
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions and Recent Activity */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Quick Actions */}
          <Card className="modern-card border-0">
            <CardHeader>
              <CardTitle className="text-xl font-semibold">Quick Actions</CardTitle>
              <CardDescription>
                Common tasks and shortcuts
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid gap-3">
                <button className="flex items-center justify-start rounded-xl p-4 text-left hover:bg-accent/50 transition-all duration-200 border border-border/50 hover:border-primary/20 group">
                  <div className="p-2 rounded-lg gradient-blue text-white mr-4 group-hover:scale-110 transition-transform">
                    <Package className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="font-semibold">Add New Product</p>
                    <p className="text-sm text-muted-foreground">Create a new product entry</p>
                  </div>
                </button>
                <button className="flex items-center justify-start rounded-xl p-4 text-left hover:bg-accent/50 transition-all duration-200 border border-border/50 hover:border-primary/20 group">
                  <div className="p-2 rounded-lg gradient-orange text-white mr-4 group-hover:scale-110 transition-transform">
                    <ShoppingCart className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="font-semibold">Create Purchase Order</p>
                    <p className="text-sm text-muted-foreground">Order from suppliers</p>
                  </div>
                </button>
                <button className="flex items-center justify-start rounded-xl p-4 text-left hover:bg-accent/50 transition-all duration-200 border border-border/50 hover:border-primary/20 group">
                  <div className="p-2 rounded-lg gradient-pink text-white mr-4 group-hover:scale-110 transition-transform">
                    <AlertCircle className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="font-semibold">View Low Stock</p>
                    <p className="text-sm text-muted-foreground">Items needing restock</p>
                  </div>
                </button>
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card className="modern-card border-0">
            <CardHeader>
              <CardTitle className="text-xl font-semibold">Recent Activity</CardTitle>
              <CardDescription>
                Latest inventory movements
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  {
                    action: 'Product added',
                    item: 'iPhone 15 Pro',
                    time: '2 minutes ago',
                    gradient: 'gradient-green',
                  },
                  {
                    action: 'Stock updated',
                    item: 'Samsung Galaxy S24',
                    time: '1 hour ago',
                    gradient: 'gradient-blue',
                  },
                  {
                    action: 'Purchase order created',
                    item: 'PO-2024-001',
                    time: '3 hours ago',
                    gradient: 'gradient-purple',
                  },
                  {
                    action: 'Low stock alert',
                    item: 'MacBook Air M2',
                    time: '5 hours ago',
                    gradient: 'gradient-pink',
                  },
                ].map((activity, index) => (
                  <div key={index} className="flex items-center space-x-4 p-3 rounded-lg hover:bg-accent/30 transition-colors">
                    <div className={`w-2 h-8 rounded-full ${activity.gradient}`}></div>
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-semibold leading-none">
                        {activity.action}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {activity.item}
                      </p>
                    </div>
                    <div className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-md">
                      {activity.time}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  )
}