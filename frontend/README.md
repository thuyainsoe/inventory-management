# Inventory Management System - Frontend

A comprehensive inventory management system built with Next.js, TypeScript, Tailwind CSS, and shadcn/ui components.

## 🚀 Features

- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Sidebar Navigation**: Expandable/collapsible sidebar with all inventory management features
- **Top Menu Bar**: Search functionality, notifications, and user profile management
- **Data Tables**: Reusable table component with TanStack Table, pagination, and sorting
- **API Integration**: TanStack Query for efficient data fetching and caching
- **Type Safety**: Full TypeScript support with comprehensive type definitions
- **Modern UI**: Built with shadcn/ui and Tailwind CSS for a polished interface

## 📁 Project Structure

```
frontend/
├── app/                          # Next.js App Router pages
│   ├── auth/                     # Authentication pages
│   ├── dashboard/                # Dashboard page
│   ├── products/                 # Product management pages
│   ├── stock/                    # Stock tracking pages
│   ├── suppliers/                # Supplier management pages
│   ├── orders/                   # Order management pages
│   ├── sales/                    # Sales tracking pages
│   ├── reports/                  # Reports and analytics pages
│   ├── settings/                 # Settings pages
│   ├── users/                    # User management pages
│   ├── layout.tsx                # Root layout
│   └── page.tsx                  # Home page (redirects to dashboard)
├── components/
│   ├── layout/                   # Layout components
│   │   ├── sidebar.tsx           # Expandable sidebar navigation
│   │   ├── header.tsx            # Top menu bar with search and user menu
│   │   └── main-layout.tsx       # Main layout wrapper
│   ├── tables/                   # Table components
│   │   └── data-table.tsx        # Reusable data table with TanStack Table
│   └── ui/                       # shadcn/ui components
├── hooks/                        # Custom React hooks
│   └── use-products.ts           # TanStack Query hooks for products
├── lib/
│   ├── api/                      # API services
│   │   ├── client.ts             # Axios client configuration
│   │   └── services.ts           # API service functions
│   ├── utils.ts                  # Utility functions
│   └── constants.ts              # Application constants
├── providers/
│   └── query-provider.tsx        # TanStack Query provider
├── types/
│   └── index.ts                  # TypeScript type definitions
└── public/                       # Static assets
```

## 🛠 Technologies Used

- **Next.js 14**: React framework with App Router
- **TypeScript**: Type-safe JavaScript
- **Tailwind CSS**: Utility-first CSS framework
- **shadcn/ui**: Modern UI component library
- **TanStack Table**: Powerful table component
- **TanStack Query**: Data fetching and caching
- **Axios**: HTTP client for API calls
- **Lucide React**: Icon library
- **Radix UI**: Accessible UI primitives

## 🔧 Installation

1. Install dependencies:
```bash
npm install
```

2. Copy environment variables:
```bash
cp .env.example .env.local
```

3. Update the API URL in `.env.local`:
```
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

4. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:3000`.

## 📊 Key Components

### Sidebar Navigation

The sidebar includes all major inventory management features:
- Dashboard
- Authentication & Authorization
- User Management
- Product Management
- Stock Tracking
- Supplier Management
- Purchase Orders
- Sales Tracking
- Low Stock Alerts
- Reports & Analytics
- File Management
- Settings & Configuration

### Reusable Data Table

The `DataTable` component supports:
- Sorting on all columns
- Global search and column-specific filtering
- Pagination with customizable page sizes
- Column visibility toggle
- Row actions (edit, delete, view, custom actions)
- Loading states
- Responsive design

### API Integration

All API calls are handled through:
- Centralized API client with authentication
- Service layer for each entity (products, users, orders, etc.)
- TanStack Query hooks for data fetching, caching, and mutations
- Automatic error handling and retry logic

## 🔗 Connecting to NestJS Backend

The frontend is designed to work with a NestJS backend. Update the API base URL in your environment variables:

```bash
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

All API endpoints are configured in `lib/constants.ts` and can be easily modified to match your backend routes.

## 🎨 Customization

### Adding New Pages

1. Create a new page in the `app/` directory
2. Add the route to the sidebar navigation in `components/layout/sidebar.tsx`
3. Create any necessary API services in `lib/api/services.ts`
4. Add TypeScript types in `types/index.ts`

### Creating New Table Views

Use the `DataTable` component with custom column definitions:

```tsx
import { DataTable, createSortableHeader, createActionColumn } from '@/components/tables/data-table'

const columns: ColumnDef<YourDataType>[] = [
  {
    accessorKey: 'name',
    header: ({ column }) => createSortableHeader(column, 'Name'),
  },
  // ... more columns
  createActionColumn<YourDataType>(handleEdit, handleDelete, handleView),
]
```

## 🚀 Deployment

1. Build the application:
```bash
npm run build
```

2. Start the production server:
```bash
npm start
```

## 📝 License

This project is licensed under the MIT License.