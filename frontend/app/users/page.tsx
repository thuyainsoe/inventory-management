'use client'

import { useState } from 'react'
import { MainLayout } from '@/components/layout/main-layout'
import { DataTable, createSortableHeader, createActionColumn } from '@/components/tables/data-table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { UserPlus, Download, Upload, Filter } from 'lucide-react'
import type { User } from '@/types'
import { ColumnDef } from '@tanstack/react-table'
import { formatDate, formatDateTime } from '@/lib/utils'
import { PageHeader } from '@/components/ui/page-header'

// Mock user data
const mockUser = {
  name: 'John Doe',
  email: 'john@example.com',
  role: 'Admin',
  avatar: undefined,
}

// Mock users data with realistic information
const mockUsers: User[] = [
  {
    id: '1',
    name: 'Alice Johnson',
    email: 'alice.johnson@company.com',
    role: 'admin',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=150',
    createdAt: '2024-01-15T09:00:00Z',
    updatedAt: '2024-12-01T14:30:00Z',
  },
  {
    id: '2',
    name: 'Bob Smith',
    email: 'bob.smith@company.com',
    role: 'manager',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
    createdAt: '2024-02-20T10:15:00Z',
    updatedAt: '2024-11-28T16:45:00Z',
  },
  {
    id: '3',
    name: 'Carol Williams',
    email: 'carol.williams@company.com',
    role: 'staff',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150',
    createdAt: '2024-03-10T08:30:00Z',
    updatedAt: '2024-12-10T11:20:00Z',
  },
  {
    id: '4',
    name: 'David Brown',
    email: 'david.brown@company.com',
    role: 'staff',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    createdAt: '2024-04-05T13:45:00Z',
    updatedAt: '2024-12-08T09:15:00Z',
  },
  {
    id: '5',
    name: 'Emma Davis',
    email: 'emma.davis@company.com',
    role: 'manager',
    avatar: 'https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?w=150',
    createdAt: '2024-05-12T11:20:00Z',
    updatedAt: '2024-12-09T15:30:00Z',
  },
  {
    id: '6',
    name: 'Frank Miller',
    email: 'frank.miller@company.com',
    role: 'staff',
    avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150',
    createdAt: '2024-06-18T14:10:00Z',
    updatedAt: '2024-12-07T12:40:00Z',
  },
  {
    id: '7',
    name: 'Grace Lee',
    email: 'grace.lee@company.com',
    role: 'admin',
    avatar: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150',
    createdAt: '2024-07-22T16:30:00Z',
    updatedAt: '2024-12-11T10:55:00Z',
  },
  {
    id: '8',
    name: 'Henry Wilson',
    email: 'henry.wilson@company.com',
    role: 'staff',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
    createdAt: '2024-08-14T09:45:00Z',
    updatedAt: '2024-12-06T14:20:00Z',
  },
  {
    id: '9',
    name: 'Ivy Taylor',
    email: 'ivy.taylor@company.com',
    role: 'manager',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    createdAt: '2024-09-03T12:00:00Z',
    updatedAt: '2024-12-12T08:30:00Z',
  },
  {
    id: '10',
    name: 'Jack Anderson',
    email: 'jack.anderson@company.com',
    role: 'staff',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150',
    createdAt: '2024-10-08T15:20:00Z',
    updatedAt: '2024-12-05T13:10:00Z',
  },
  {
    id: '11',
    name: 'Kate Thompson',
    email: 'kate.thompson@company.com',
    role: 'staff',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=150',
    createdAt: '2024-11-01T10:30:00Z',
    updatedAt: '2024-12-04T16:45:00Z',
  },
  {
    id: '12',
    name: 'Liam Garcia',
    email: 'liam.garcia@company.com',
    role: 'manager',
    avatar: 'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=150',
    createdAt: '2024-11-15T08:15:00Z',
    updatedAt: '2024-12-13T11:25:00Z',
  },
]

// Role badge colors
const getRoleBadgeColor = (role: string) => {
  switch (role) {
    case 'admin':
      return 'bg-red-100 text-red-800 hover:bg-red-200'
    case 'manager':
      return 'bg-blue-100 text-blue-800 hover:bg-blue-200'
    case 'staff':
      return 'bg-green-100 text-green-800 hover:bg-green-200'
    default:
      return 'bg-gray-100 text-gray-800 hover:bg-gray-200'
  }
}

export default function UsersPage() {
  const [users] = useState<User[]>(mockUsers)
  const [selectedUsers, setSelectedUsers] = useState<string[]>([])

  const handleEdit = (user: User) => {
    console.log('Edit user:', user)
    // Implement edit logic
  }

  const handleDelete = (user: User) => {
    console.log('Delete user:', user)
    // Implement delete logic
  }

  const handleView = (user: User) => {
    console.log('View user profile:', user)
    // Implement view logic
  }

  const handleAddUser = () => {
    console.log('Add new user')
    // Implement add user logic
  }

  const handleBulkDelete = () => {
    console.log('Bulk delete users:', selectedUsers)
    // Implement bulk delete logic
  }

  const handleExport = () => {
    console.log('Export users to CSV')
    // Implement export logic
  }

  const handleImport = () => {
    console.log('Import users from CSV')
    // Implement import logic
  }

  const columns: ColumnDef<User>[] = [
    {
      id: 'select',
      header: ({ table }) => (
        <input
          type="checkbox"
          checked={table.getIsAllPageRowsSelected()}
          onChange={(value) => {
            table.toggleAllPageRowsSelected(!!value.target.checked)
            if (value.target.checked) {
              setSelectedUsers(users.map(user => user.id))
            } else {
              setSelectedUsers([])
            }
          }}
          className="rounded border-gray-300"
        />
      ),
      cell: ({ row }) => (
        <input
          type="checkbox"
          checked={row.getIsSelected()}
          onChange={(value) => {
            row.toggleSelected(!!value.target.checked)
            if (value.target.checked) {
              setSelectedUsers(prev => [...prev, row.original.id])
            } else {
              setSelectedUsers(prev => prev.filter(id => id !== row.original.id))
            }
          }}
          className="rounded border-gray-300"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: 'name',
      header: ({ column }) => createSortableHeader(column, 'Name'),
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
                  {row.original.name
                    .split(' ')
                    .map((n) => n[0])
                    .join('')
                    .toUpperCase()}
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
      accessorKey: 'role',
      header: ({ column }) => createSortableHeader(column, 'Role'),
      cell: ({ row }) => (
        <Badge className={getRoleBadgeColor(row.getValue('role'))}>
          {(row.getValue('role') as string).charAt(0).toUpperCase() + 
           (row.getValue('role') as string).slice(1)}
        </Badge>
      ),
      filterFn: (row, id, value) => {
        return value.includes(row.getValue(id))
      },
    },
    {
      accessorKey: 'email',
      header: ({ column }) => createSortableHeader(column, 'Email'),
      cell: ({ row }) => (
        <a
          href={`mailto:${row.getValue('email')}`}
          className="text-blue-600 hover:text-blue-900 hover:underline"
        >
          {row.getValue('email')}
        </a>
      ),
    },
    {
      accessorKey: 'createdAt',
      header: ({ column }) => createSortableHeader(column, 'Created'),
      cell: ({ row }) => (
        <div>
          <div className="text-sm font-medium">
            {formatDate(row.getValue('createdAt'))}
          </div>
          <div className="text-xs text-gray-500">
            {formatDateTime(row.getValue('createdAt'))}
          </div>
        </div>
      ),
    },
    {
      accessorKey: 'updatedAt',
      header: ({ column }) => createSortableHeader(column, 'Last Updated'),
      cell: ({ row }) => (
        <div>
          <div className="text-sm font-medium">
            {formatDate(row.getValue('updatedAt'))}
          </div>
          <div className="text-xs text-gray-500">
            {formatDateTime(row.getValue('updatedAt'))}
          </div>
        </div>
      ),
    },
    {
      id: 'status',
      header: 'Status',
      cell: ({ row }) => {
        const lastUpdate = new Date(row.original.updatedAt)
        const now = new Date()
        const daysSinceUpdate = Math.floor((now.getTime() - lastUpdate.getTime()) / (1000 * 60 * 60 * 24))
        
        if (daysSinceUpdate <= 7) {
          return <Badge className="bg-green-100 text-green-800">Active</Badge>
        } else if (daysSinceUpdate <= 30) {
          return <Badge className="bg-yellow-100 text-yellow-800">Inactive</Badge>
        } else {
          return <Badge className="bg-red-100 text-red-800">Dormant</Badge>
        }
      },
    },
    createActionColumn<User>(handleEdit, handleDelete, handleView, [
      {
        label: 'Reset Password',
        onClick: (user) => console.log('Reset password for:', user.name),
      },
      {
        label: 'Send Welcome Email',
        onClick: (user) => console.log('Send welcome email to:', user.email),
      },
      {
        label: 'Change Role',
        onClick: (user) => console.log('Change role for:', user.name),
      },
    ]),
  ]

  // Calculate stats
  const totalUsers = users.length
  const adminCount = users.filter(u => u.role === 'admin').length
  const managerCount = users.filter(u => u.role === 'manager').length
  const staffCount = users.filter(u => u.role === 'staff').length
  const activeUsers = users.filter(u => {
    const daysSinceUpdate = Math.floor((new Date().getTime() - new Date(u.updatedAt).getTime()) / (1000 * 60 * 60 * 24))
    return daysSinceUpdate <= 7
  }).length

  return (
    <MainLayout user={mockUser}>
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
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
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
              <CardTitle className="text-sm font-medium">Active Users</CardTitle>
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
              <div className="text-2xl font-bold">{selectedUsers.length}</div>
              {selectedUsers.length > 0 && (
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
        <Card>
          <CardHeader>
            <CardTitle>All Users</CardTitle>
            <CardDescription>
              A comprehensive list of all users in the system with their roles and status
            </CardDescription>
          </CardHeader>
          <CardContent>
            <DataTable
              columns={columns}
              data={users}
              searchKey="name"
              searchPlaceholder="Search users by name, email, or role..."
              onRowClick={(user) => console.log('User clicked:', user)}
            />
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  )
}