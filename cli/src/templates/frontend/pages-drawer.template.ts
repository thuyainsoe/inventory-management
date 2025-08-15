export const drawerListPageTemplate = `"use client";

import { useState } from "react";
import { MainLayout } from "@/components/layout/main-layout";
import {
  DataTable,
  createSortableHeader,
} from "@/components/tables/data-table";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Plus, Package } from "lucide-react";
import type { {{singular.pascal}} } from "@/types";
import {
  ColumnDef,
  PaginationState,
  RowSelectionState,
} from "@tanstack/react-table";
import { 
  TextCell,
  DateCell,
  ActionCell
} from "@/components/tables/cells";
import { use{{plural.pascal}}, useDelete{{singular.pascal}} } from "@/hooks/use-{{plural.param}}";
import { PageHeader } from "@/components/ui/page-header";
import ProtectedRoute from "@/components/auth/protected-route";
import { useAuth } from "@/contexts/auth-context";
import { Create{{singular.pascal}}Drawer } from "@/components/{{plural.param}}/create-{{singular.param}}-drawer";
import { Edit{{singular.pascal}}Drawer } from "@/components/{{plural.param}}/edit-{{singular.param}}-drawer";

export default function {{plural.pascal}}Page() {
  const { user } = useAuth();
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [globalFilter, setGlobalFilter] = useState("");
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [createDrawerOpen, setCreateDrawerOpen] = useState(false);
  const [editDrawerOpen, setEditDrawerOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<{{singular.pascal}} | null>(null);

  // Use TanStack Query to fetch {{plural.sentence}}
  const {
    data: {{plural.camel}}Data,
    isLoading,
    error,
  } = use{{plural.pascal}}({
    page: pagination.pageIndex + 1,
    limit: pagination.pageSize,
    search: globalFilter,
  });

  const delete{{singular.pascal}}Mutation = useDelete{{singular.pascal}}();

  const handleEdit = ({{singular.camel}}: {{singular.pascal}}) => {
    setSelectedItem({{singular.camel}});
    setEditDrawerOpen(true);
  };

  const handleDelete = async ({{singular.camel}}: {{singular.pascal}}) => {
    if (window.confirm(\`Are you sure you want to delete "\${{{singular.camel}}.name}"?\`)) {
      try {
        await delete{{singular.pascal}}Mutation.mutateAsync({{singular.camel}}.id);
      } catch (error) {
        console.error("Failed to delete {{singular.sentence}}:", error);
      }
    }
  };

  const handleView = ({{singular.camel}}: {{singular.pascal}}) => {
    console.log("View {{singular.sentence}}:", {{singular.camel}});
    // Implement view logic - could open a modal or navigate to detail page
  };

  const handleAdd{{singular.pascal}} = () => {
    setCreateDrawerOpen(true);
  };

  // Extract {{plural.sentence}} and pagination info
  const {{plural.camel}} = {{plural.camel}}Data?.data || [];
  const total{{plural.pascal}} = {{plural.camel}}Data?.total || 0;
  const pageCount = {{plural.camel}}Data?.totalPages || 0;

  const columns: ColumnDef<{{singular.pascal}}>[] = [
{{#each fields}}
    {
      accessorKey: "{{this.name}}",
      header: ({ column }) => createSortableHeader(column, "{{this.label}}"),
      cell: ({ row }) => (
        <{{this.cellComponent}}
          value={row.getValue("{{this.name}}") as {{this.tsType}}}
          {{#if this.cellProps}}{{this.cellProps}}{{/if}}
        />
      ),
    },
{{/each}}
    {
      accessorKey: "createdAt",
      header: "Created",
      cell: ({ row }) => (
        <DateCell 
          value={row.getValue("createdAt") as string}
          className="min-w-[120px] text-sm text-muted-foreground"
        />
      ),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const {{singular.camel}} = row.original;
        return (
          <ActionCell
            actions={[
              {
                label: "View",
                onClick: () => handleView({{singular.camel}}),
              },
              {
                label: "Edit",
                onClick: () => handleEdit({{singular.camel}}),
              },
              {
                label: "Delete",
                onClick: () => handleDelete({{singular.camel}}),
                variant: "destructive",
                separator: true,
              },
            ]}
          />
        );
      },
    },
  ];

  return (
    <ProtectedRoute>
      <MainLayout user={user || undefined}>
        <div className="space-y-6">
          {/* Page Header */}
          <PageHeader
            title="{{plural.sentence}}"
            description="Manage your {{plural.sentence}}"
            action={{
              label: "Add {{singular.sentence}}",
              onClick: handleAdd{{singular.pascal}},
              icon: <Plus className="h-4 w-4" />,
            }}
          />

          {/* {{plural.sentence}} Table */}
          <Card className="modern-card border-0 pt-6">
            <CardContent>
              {error ? (
                <div className="text-center py-8">
                  <p className="text-red-600">
                    Failed to load {{plural.sentence}}. Please check your backend
                    connection.
                  </p>
                </div>
              ) : (
                <DataTable
                  columns={columns}
                  data={{{plural.camel}}}
                  searchKey="name"
                  searchPlaceholder="Search {{plural.sentence}}..."
                  onRowClick={({{singular.camel}}) => console.log("Row clicked:", {{singular.camel}})}
                  loading={isLoading}
                  pagination={{
                    pageIndex: pagination.pageIndex,
                    pageSize: pagination.pageSize,
                    pageCount,
                    total: total{{plural.pascal}},
                  }}
                  onPaginationChange={setPagination}
                  onSortingChange={undefined}
                  onGlobalFilterChange={setGlobalFilter}
                  manualPagination={true}
                  manualSorting={true}
                  enableRowSelection={true}
                  rowSelection={rowSelection}
                  onRowSelectionChange={setRowSelection}
                />
              )}
            </CardContent>
          </Card>
        </div>

        {/* Drawers */}
        <Create{{singular.pascal}}Drawer
          isOpen={createDrawerOpen}
          onClose={() => setCreateDrawerOpen(false)}
        />
        
        <Edit{{singular.pascal}}Drawer
          isOpen={editDrawerOpen}
          onClose={() => {
            setEditDrawerOpen(false);
            setSelectedItem(null);
          }}
          {{singular.camel}}={selectedItem}
        />
      </MainLayout>
    </ProtectedRoute>
  );
}`;

export const createDrawerTemplate = `"use client";

import { useMemo } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { EntityDrawer } from "@/components/ui/entity-drawer";
import { Plus } from "lucide-react";
import { useCreate{{singular.pascal}} } from "@/hooks/use-{{plural.param}}";
import { FormFieldGenerator } from "@/components/form/form-field-generator";
import { {{singular.camel}}FormFieldSchema } from "@/schemas/{{plural.param}}/{{singular.param}}-form-field-schema";
import { {{singular.pascal}}FormSchema, {{singular.pascal}}FormValues } from "@/schemas/{{plural.param}}/{{singular.param}}-form-schema";

interface Create{{singular.pascal}}DrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Create{{singular.pascal}}Drawer({ isOpen, onClose }: Create{{singular.pascal}}DrawerProps) {
  const create{{singular.pascal}}Mutation = useCreate{{singular.pascal}}();

  const methods = useForm<{{singular.pascal}}FormValues>({
    resolver: zodResolver({{singular.pascal}}FormSchema),
    defaultValues: {
{{#each fields}}
      {{this.name}}: {{this.defaultValue}},
{{/each}}
    },
  });

  const { handleSubmit, reset } = methods;

  const onSubmit = async (data: {{singular.pascal}}FormValues) => {
    try {
      await create{{singular.pascal}}Mutation.mutateAsync(data);
      reset();
      onClose();
    } catch (error) {
      console.error("Failed to create {{singular.sentence}}:", error);
    }
  };

  const formFields = useMemo(() => {{singular.camel}}FormFieldSchema, []);

  return (
    <EntityDrawer
      isOpen={isOpen}
      onClose={onClose}
      title="Create {{singular.sentence}}"
      description="Add a new {{singular.sentence}} to your inventory"
      icon={<Plus className="h-5 w-5" />}
      onSubmit={handleSubmit(onSubmit)}
      isLoading={create{{singular.pascal}}Mutation.isPending}
      submitText="Create {{singular.sentence}}"
    >
      <FormProvider {...methods}>
        <div className="space-y-4">
          <FormFieldGenerator fields={formFields} />
        </div>
      </FormProvider>
    </EntityDrawer>
  );
}`;

export const editDrawerTemplate = `"use client";

import { useMemo, useEffect } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { EntityDrawer } from "@/components/ui/entity-drawer";
import { Edit } from "lucide-react";
import { useUpdate{{singular.pascal}} } from "@/hooks/use-{{plural.param}}";
import { FormFieldGenerator } from "@/components/form/form-field-generator";
import { {{singular.camel}}FormFieldSchema } from "@/schemas/{{plural.param}}/{{singular.param}}-form-field-schema";
import { {{singular.pascal}}FormSchema, {{singular.pascal}}FormValues } from "@/schemas/{{plural.param}}/{{singular.param}}-form-schema";
import { {{singular.pascal}} } from "@/types";

interface Edit{{singular.pascal}}DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  {{singular.camel}}: {{singular.pascal}} | null;
}

export function Edit{{singular.pascal}}Drawer({ isOpen, onClose, {{singular.camel}} }: Edit{{singular.pascal}}DrawerProps) {
  const update{{singular.pascal}}Mutation = useUpdate{{singular.pascal}}();

  const methods = useForm<{{singular.pascal}}FormValues>({
    resolver: zodResolver({{singular.pascal}}FormSchema),
    defaultValues: {
{{#each fields}}
      {{this.name}}: {{this.defaultValue}},
{{/each}}
    },
  });

  const { handleSubmit, reset } = methods;

  // Update form when {{singular.sentence}} changes
  useEffect(() => {
    if ({{singular.camel}}) {
      reset({
{{#each fields}}
        {{this.name}}: {{singular.camel}}.{{this.name}},
{{/each}}
      });
    }
  }, [{{singular.camel}}, reset]);

  const onSubmit = async (data: {{singular.pascal}}FormValues) => {
    if (!{{singular.camel}}) return;

    try {
      await update{{singular.pascal}}Mutation.mutateAsync({
        id: {{singular.camel}}.id,
        data,
      });
      onClose();
    } catch (error) {
      console.error("Failed to update {{singular.sentence}}:", error);
    }
  };

  const formFields = useMemo(() => {{singular.camel}}FormFieldSchema, []);

  return (
    <EntityDrawer
      isOpen={isOpen}
      onClose={onClose}
      title="Edit {{singular.sentence}}"
      description="Update {{singular.sentence}} information"
      icon={<Edit className="h-5 w-5" />}
      onSubmit={handleSubmit(onSubmit)}
      isLoading={update{{singular.pascal}}Mutation.isPending}
      submitText="Save Changes"
    >
      <FormProvider {...methods}>
        <div className="space-y-4">
          <FormFieldGenerator fields={formFields} />
        </div>
      </FormProvider>
    </EntityDrawer>
  );
}`;