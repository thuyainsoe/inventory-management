"use client";

import * as React from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  useReactTable,
  SortingState,
  ColumnFiltersState,
  VisibilityState,
  PaginationState,
  OnChangeFn,
  RowSelectionState,
} from "@tanstack/react-table";
import { ArrowUpDown, ChevronDown, MoreHorizontal, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  searchKey?: string;
  searchPlaceholder?: string;
  onRowClick?: (row: TData) => void;
  loading?: boolean;
  pagination?: {
    pageIndex: number;
    pageSize: number;
    pageCount: number;
    total: number;
  };
  onPaginationChange?: OnChangeFn<PaginationState>;
  manualPagination?: boolean;
  manualSorting?: boolean;
  onSortingChange?: OnChangeFn<SortingState>;
  onGlobalFilterChange?: (filter: string) => void;
  enableRowSelection?: boolean;
  onRowSelectionChange?: OnChangeFn<RowSelectionState>;
  rowSelection?: RowSelectionState;
  customControls?: React.ReactNode;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  searchKey,
  searchPlaceholder = "Search...",
  onRowClick,
  loading = false,
  pagination,
  onPaginationChange,
  manualPagination = false,
  manualSorting = false,
  onSortingChange,
  onGlobalFilterChange,
  enableRowSelection = false,
  onRowSelectionChange,
  rowSelection: externalRowSelection,
  customControls,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [globalFilter, setGlobalFilter] = React.useState("");
  const [internalRowSelection, setInternalRowSelection] =
    React.useState<RowSelectionState>({});

  const rowSelection = externalRowSelection ?? internalRowSelection;

  // Create columns with selection column if enabled
  const tableColumns = React.useMemo(() => {
    if (!enableRowSelection) return columns;

    const selectionColumn: ColumnDef<TData, TValue> = {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
          className="rounded-none"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
          className="rounded-none"
        />
      ),
      enableSorting: false,
      enableHiding: false,
      size: 40,
    };

    return [selectionColumn, ...columns];
  }, [columns, enableRowSelection]);

  const table = useReactTable({
    data,
    columns: tableColumns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: manualPagination
      ? undefined
      : getPaginationRowModel(),
    getSortedRowModel: manualSorting ? undefined : getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: manualSorting ? onSortingChange : setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onGlobalFilterChange: onGlobalFilterChange || setGlobalFilter,
    onRowSelectionChange: onRowSelectionChange || setInternalRowSelection,
    onPaginationChange,
    manualPagination,
    manualSorting,
    enableRowSelection: enableRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      globalFilter,
      rowSelection,
      ...(manualPagination && pagination
        ? {
            pagination: {
              pageIndex: pagination.pageIndex,
              pageSize: pagination.pageSize,
            },
          }
        : {}),
    },
    ...(manualPagination && pagination
      ? { pageCount: pagination.pageCount }
      : {}),
  });

  const handleSearch = (value: string) => {
    if (onGlobalFilterChange) {
      onGlobalFilterChange(value);
    } else {
      setGlobalFilter(value);
      if (searchKey) {
        table.getColumn(searchKey)?.setFilterValue(value);
      }
    }
  };

  return (
    <div className="w-full space-y-4">
      {/* Search and Filter Controls */}
      <div className="flex items-center justify-between">
        <div className="flex flex-1 items-center space-x-2">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={searchPlaceholder}
              value={globalFilter}
              onChange={(event) => handleSearch(event.target.value)}
              className="max-w-sm pl-8"
            />
          </div>
          {/* Custom Controls */}
          {customControls && (
            <div className="flex items-center space-x-2">
              {customControls}
            </div>
          )}
        </div>

        {/* Column Visibility Toggle */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Columns <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                );
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Table */}
      <div className="rounded-md border overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header, index) => {
                    const isSelectColumn = header.column.id === "select";
                    const isFirstDataColumn = enableRowSelection
                      ? index === 1
                      : index === 0;

                    let stickyClasses = "";
                    if (isSelectColumn) {
                      stickyClasses =
                        "sticky left-0 z-20 bg-background w-12 px-4 border-r";
                    } else if (isFirstDataColumn) {
                      const leftOffset = enableRowSelection
                        ? "left-12"
                        : "left-0";
                      stickyClasses = `sticky ${leftOffset} z-10 bg-background border-r`;
                    }

                    return (
                      <TableHead
                        key={header.id}
                        className={`h-12 ${stickyClasses}`}
                      >
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {loading ? (
                // Loading state
                Array.from({ length: 5 }).map((_, index) => (
                  <TableRow key={index}>
                    {tableColumns.map((_, cellIndex) => {
                      const isSelectColumn =
                        cellIndex === 0 && enableRowSelection;
                      const isFirstDataColumn = enableRowSelection
                        ? cellIndex === 1
                        : cellIndex === 0;

                      let stickyClasses = "";
                      if (isSelectColumn) {
                        stickyClasses =
                          "sticky left-0 z-20 bg-background w-12 px-4 border-r";
                      } else if (isFirstDataColumn) {
                        const leftOffset = enableRowSelection
                          ? "left-12"
                          : "left-0";
                        stickyClasses = `sticky ${leftOffset} z-10 bg-background border-r`;
                      }

                      return (
                        <TableCell
                          key={cellIndex}
                          className={`h-12 ${stickyClasses}`}
                        >
                          <div className="h-4 w-full animate-pulse rounded bg-muted" />
                        </TableCell>
                      );
                    })}
                  </TableRow>
                ))
              ) : table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                    className={onRowClick ? "cursor-pointer" : ""}
                    onClick={() => onRowClick?.(row.original)}
                  >
                    {row.getVisibleCells().map((cell, index) => {
                      const isSelectColumn = cell.column.id === "select";
                      const isFirstDataColumn = enableRowSelection
                        ? index === 1
                        : index === 0;

                      let stickyClasses = "";
                      if (isSelectColumn) {
                        stickyClasses =
                          "sticky left-0 z-20 bg-background w-12 px-4 border-r";
                      } else if (isFirstDataColumn) {
                        const leftOffset = enableRowSelection
                          ? "left-12"
                          : "left-0";
                        stickyClasses = `sticky ${leftOffset} z-10 bg-background border-r`;
                      }

                      return (
                        <TableCell
                          key={cell.id}
                          className={stickyClasses}
                          onClick={
                            isSelectColumn
                              ? (e) => e.stopPropagation()
                              : undefined
                          }
                        >
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={tableColumns.length}
                    className="h-24 text-center"
                  >
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {pagination ? (
            <div className="flex items-center space-x-4">
              <span>
                Showing {pagination.pageIndex * pagination.pageSize + 1} to{" "}
                {Math.min(
                  (pagination.pageIndex + 1) * pagination.pageSize,
                  pagination.total
                )}{" "}
                of {pagination.total} results
              </span>
              {enableRowSelection && (
                <span>
                  {table.getFilteredSelectedRowModel().rows.length} of{" "}
                  {table.getFilteredRowModel().rows.length} row(s) selected.
                </span>
              )}
            </div>
          ) : (
            <>
              {enableRowSelection ? (
                <>
                  {table.getFilteredSelectedRowModel().rows.length} of{" "}
                  {table.getFilteredRowModel().rows.length} row(s) selected.
                </>
              ) : (
                <>{table.getFilteredRowModel().rows.length} row(s) total.</>
              )}
            </>
          )}
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>

          {pagination && (
            <div className="flex items-center space-x-1">
              <span className="text-sm">
                Page {pagination.pageIndex + 1} of {pagination.pageCount}
              </span>
            </div>
          )}

          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}

// Helper function to create sortable column header
export function createSortableHeader(column: any, title: string) {
  return (
    <Button
      variant="ghost"
      onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      className="h-auto p-0 hover:bg-transparent"
    >
      {title}
      <ArrowUpDown className="ml-2 h-4 w-4" />
    </Button>
  );
}

// Helper function to create action column
export function createActionColumn<TData>(
  onEdit?: (item: TData) => void,
  onDelete?: (item: TData) => void,
  onView?: (item: TData) => void,
  customActions?: Array<{
    label: string;
    onClick: (item: TData) => void;
    icon?: React.ReactNode;
  }>
): ColumnDef<TData> {
  return {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const item = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            {onView && (
              <DropdownMenuItem onClick={() => onView(item)}>
                View details
              </DropdownMenuItem>
            )}
            {onEdit && (
              <DropdownMenuItem onClick={() => onEdit(item)}>
                Edit
              </DropdownMenuItem>
            )}
            {customActions?.map((action, index) => (
              <DropdownMenuItem
                key={index}
                onClick={() => action.onClick(item)}
              >
                {action.icon}
                {action.label}
              </DropdownMenuItem>
            ))}
            {onDelete && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => onDelete(item)}
                  className="text-red-600"
                >
                  Delete
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  };
}
