'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  ChevronLeft,
  ChevronRight,
  LayoutDashboard,
  Users,
  Package,
  ShoppingCart,
  Truck,
  ClipboardList,
  TrendingUp,
  AlertCircle,
  BarChart3,
  Settings,
  Shield,
  UserCheck,
  Boxes,
  Archive,
  Building2,
  FileText,
  DollarSign,
  Bell,
  Upload,
  Database,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

interface NavItem {
  title: string
  href: string
  icon: React.ElementType
  badge?: string
  children?: NavItem[]
}

const navigationItems: NavItem[] = [
  {
    title: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    title: 'User Management',
    href: '/users',
    icon: Users,
    children: [
      { title: 'All Users', href: '/users' },
      { title: 'Roles & Permissions', href: '/users/roles' },
      { title: 'Activity Logs', href: '/users/logs' },
    ],
  },
  {
    title: 'Product Management',
    href: '/products',
    icon: Package,
    children: [
      { title: 'All Products', href: '/products' },
      { title: 'Categories', href: '/products/categories' },
      { title: 'Product Variants', href: '/products/variants' },
      { title: 'Barcode Management', href: '/products/barcodes' },
    ],
  },
  {
    title: 'Stock Management',
    href: '/stock',
    icon: Boxes,
    children: [
      { title: 'Current Stock', href: '/stock' },
      { title: 'Stock Movements', href: '/stock/movements' },
      { title: 'Stock Adjustments', href: '/stock/adjustments' },
      { title: 'Stock Transfers', href: '/stock/transfers' },
      { title: 'Low Stock Alerts', href: '/stock/alerts' },
    ],
  },
  {
    title: 'Suppliers',
    href: '/suppliers',
    icon: Building2,
    children: [
      { title: 'All Suppliers', href: '/suppliers' },
      { title: 'Performance Reports', href: '/suppliers/performance' },
      { title: 'Payment Terms', href: '/suppliers/payments' },
    ],
  },
  {
    title: 'Purchase Orders',
    href: '/orders/purchase',
    icon: ShoppingCart,
    children: [
      { title: 'All Orders', href: '/orders/purchase' },
      { title: 'Pending Approval', href: '/orders/purchase/pending' },
      { title: 'Receiving', href: '/orders/purchase/receiving' },
      { title: 'Order History', href: '/orders/purchase/history' },
    ],
  },
  {
    title: 'Sales Orders',
    href: '/sales',
    icon: TrendingUp,
    children: [
      { title: 'All Sales', href: '/sales' },
      { title: 'Customer Management', href: '/sales/customers' },
      { title: 'Invoices', href: '/sales/invoices' },
      { title: 'Returns & Refunds', href: '/sales/returns' },
    ],
  },
  {
    title: 'Reports',
    href: '/reports',
    icon: BarChart3,
    children: [
      { title: 'Inventory Reports', href: '/reports/inventory' },
      { title: 'Sales Reports', href: '/reports/sales' },
      { title: 'Purchase Reports', href: '/reports/purchases' },
      { title: 'Financial Reports', href: '/reports/financial' },
    ],
  },
  {
    title: 'Settings',
    href: '/settings',
    icon: Settings,
    children: [
      { title: 'General Settings', href: '/settings/general' },
      { title: 'Company Profile', href: '/settings/company' },
      { title: 'System Configuration', href: '/settings/system' },
      { title: 'Backup & Restore', href: '/settings/backup' },
    ],
  },
]

interface SidebarProps {
  className?: string
}

export function Sidebar({ className }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null)
  const pathname = usePathname()

  const toggleSubmenu = (href: string) => {
    setOpenSubmenu(openSubmenu === href ? null : href)
  }

  const isActive = (href: string) => {
    return pathname === href || pathname.startsWith(href + '/')
  }

  return (
    <TooltipProvider>
      <div
        className={cn(
          'flex h-full flex-col border-r bg-background transition-all duration-300',
          isCollapsed ? 'w-16' : 'w-64',
          className
        )}
      >
        {/* Header */}
        <div className="flex h-14 items-center justify-between border-b px-4">
          {!isCollapsed && (
            <h2 className="text-lg font-semibold">Inventory System</h2>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="h-8 w-8 p-0"
          >
            {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 p-2">
          {navigationItems.map((item) => (
            <div key={item.href}>
              {isCollapsed ? (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link href={item.children ? '#' : item.href}>
                      <Button
                        variant={isActive(item.href) ? 'secondary' : 'ghost'}
                        size="sm"
                        className="h-9 w-full justify-center px-2"
                        onClick={() => item.children && toggleSubmenu(item.href)}
                      >
                        <item.icon className="h-4 w-4" />
                        {item.badge && (
                          <span className="ml-1 rounded-full bg-red-500 px-1 text-xs text-white">
                            {item.badge}
                          </span>
                        )}
                      </Button>
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent side="right">
                    <p>{item.title}</p>
                  </TooltipContent>
                </Tooltip>
              ) : (
                <>
                  <Link href={item.children ? '#' : item.href}>
                    <Button
                      variant={isActive(item.href) ? 'secondary' : 'ghost'}
                      size="sm"
                      className="h-9 w-full justify-start px-2"
                      onClick={() => item.children && toggleSubmenu(item.href)}
                    >
                      <item.icon className="mr-2 h-4 w-4" />
                      <span className="flex-1 text-left">{item.title}</span>
                      {item.badge && (
                        <span className="ml-2 rounded-full bg-red-500 px-2 py-0.5 text-xs text-white">
                          {item.badge}
                        </span>
                      )}
                      {item.children && (
                        <ChevronRight
                          className={cn(
                            'ml-2 h-4 w-4 transition-transform',
                            openSubmenu === item.href && 'rotate-90'
                          )}
                        />
                      )}
                    </Button>
                  </Link>
                  
                  {/* Submenu */}
                  {item.children && openSubmenu === item.href && (
                    <div className="ml-4 mt-1 space-y-1">
                      {item.children.map((child) => (
                        <Link key={child.href} href={child.href}>
                          <Button
                            variant={isActive(child.href) ? 'secondary' : 'ghost'}
                            size="sm"
                            className="h-8 w-full justify-start px-2 text-sm"
                          >
                            {child.title}
                          </Button>
                        </Link>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          ))}
        </nav>
      </div>
    </TooltipProvider>
  )
}