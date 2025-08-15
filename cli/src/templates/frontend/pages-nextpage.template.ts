export const nextPageListTemplate = `"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MainLayout } from "@/components/layout/main-layout";
import {
  DataTable,
  createSortableHeader,
} from "@/components/tables/data-table";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Plus } from "lucide-react";
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

export default function {{plural.pascal}}Page() {
  const router = useRouter();
  const { user } = useAuth();
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [globalFilter, setGlobalFilter] = useState("");
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

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
    router.push(\`/{{plural.param}}/\${{{singular.camel}}.id}/edit\`);
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
    router.push(\`/{{plural.param}}/\${{{singular.camel}}.id}\`);
  };

  const handleAdd{{singular.pascal}} = () => {
    router.push("/{{plural.param}}/create");
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
      </MainLayout>
    </ProtectedRoute>
  );
}`;

export const createPageTemplate = `"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { MainLayout } from "@/components/layout/main-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Save } from "lucide-react";
import ProtectedRoute from "@/components/auth/protected-route";
import { useAuth } from "@/contexts/auth-context";
import { useCreate{{singular.pascal}} } from "@/hooks/use-{{plural.param}}";
import { FormFieldGenerator } from "@/components/form/form-field-generator";
import { {{singular.camel}}FormFieldSchema } from "@/schemas/{{plural.param}}/{{singular.param}}-form-field-schema";
import {
  {{singular.pascal}}FormSchema,
  {{singular.pascal}}FormValues,
} from "@/schemas/{{plural.param}}/{{singular.param}}-form-schema";

export default function Create{{singular.pascal}}Page() {
  const router = useRouter();
  const { user: currentUser } = useAuth();
  const create{{singular.pascal}}Mutation = useCreate{{singular.pascal}}();

  const methods = useForm<{{singular.pascal}}FormValues>({
    resolver: zodResolver({{singular.pascal}}FormSchema),
    defaultValues: {
{{#each fields}}
      {{this.name}}: {{this.defaultValue}},
{{/each}}
    },
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
    reset,
  } = methods;

  const onSubmit = async (data: {{singular.pascal}}FormValues) => {
    try {
      await create{{singular.pascal}}Mutation.mutateAsync(data);
      router.push("/{{plural.param}}");
    } catch (error) {
      console.error("Failed to create {{singular.sentence}}:", error);
    }
  };

  const formFields = useMemo(() => {{singular.camel}}FormFieldSchema, []);

  const handleCancel = () => {
    router.push("/{{plural.param}}");
  };

  return (
    <ProtectedRoute>
      <MainLayout user={currentUser || undefined}>
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.back()}
              className="h-8 w-8 p-0"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Create {{singular.sentence}}</h1>
              <p className="text-muted-foreground">
                Add a new {{singular.sentence}} to your inventory
              </p>
            </div>
          </div>

          {/* Form */}
          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>{{singular.sentence}} Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <FormFieldGenerator fields={formFields} />
                </CardContent>
              </Card>

              {/* Actions */}
              <div className="flex justify-end gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCancel}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  <Save className="mr-2 h-4 w-4" />
                  {isSubmitting ? "Creating..." : "Create {{singular.sentence}}"}
                </Button>
              </div>
            </form>
          </FormProvider>
        </div>
      </MainLayout>
    </ProtectedRoute>
  );
}`;

export const editPageTemplate = `"use client";

import { useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { MainLayout } from "@/components/layout/main-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Save } from "lucide-react";
import ProtectedRoute from "@/components/auth/protected-route";
import { useAuth } from "@/contexts/auth-context";
import { use{{singular.pascal}}, useUpdate{{singular.pascal}} } from "@/hooks/use-{{plural.param}}";
import { FormFieldGenerator } from "@/components/form/form-field-generator";
import { {{singular.camel}}FormFieldSchema } from "@/schemas/{{plural.param}}/{{singular.param}}-form-field-schema";
import {
  {{singular.pascal}}FormSchema,
  {{singular.pascal}}FormValues,
} from "@/schemas/{{plural.param}}/{{singular.param}}-form-schema";

export default function Edit{{singular.pascal}}Page({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { user: currentUser } = useAuth();
  const { data: {{singular.camel}}, isLoading: {{singular.camel}}Loading } = use{{singular.pascal}}(params.id);
  const update{{singular.pascal}}Mutation = useUpdate{{singular.pascal}}();

  const methods = useForm<{{singular.pascal}}FormValues>({
    resolver: zodResolver({{singular.pascal}}FormSchema),
    defaultValues: {
{{#each fields}}
      {{this.name}}: {{this.defaultValue}},
{{/each}}
    },
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
    reset,
  } = methods;

  // Update form when {{singular.sentence}} data is loaded
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
    try {
      await update{{singular.pascal}}Mutation.mutateAsync({
        id: params.id,
        data,
      });
      router.push("/{{plural.param}}");
    } catch (error) {
      console.error("Failed to update {{singular.sentence}}:", error);
    }
  };

  const formFields = useMemo(() => {{singular.camel}}FormFieldSchema, []);

  const handleCancel = () => {
    router.push("/{{plural.param}}");
  };

  if ({{singular.camel}}Loading) {
    return (
      <ProtectedRoute>
        <MainLayout user={currentUser || undefined}>
          <div className="flex items-center justify-center min-h-[50vh]">
            <div>Loading...</div>
          </div>
        </MainLayout>
      </ProtectedRoute>
    );
  }

  if (!{{singular.camel}}) {
    return (
      <ProtectedRoute>
        <MainLayout user={currentUser || undefined}>
          <div className="flex items-center justify-center min-h-[50vh]">
            <div>{{singular.sentence}} not found</div>
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
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.back()}
              className="h-8 w-8 p-0"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Edit {{singular.sentence}}</h1>
              <p className="text-muted-foreground">
                Update {{singular.sentence}} information
              </p>
            </div>
          </div>

          {/* Form */}
          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>{{singular.sentence}} Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <FormFieldGenerator fields={formFields} />
                </CardContent>
              </Card>

              {/* Actions */}
              <div className="flex justify-end gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCancel}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  <Save className="mr-2 h-4 w-4" />
                  {isSubmitting ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </form>
          </FormProvider>
        </div>
      </MainLayout>
    </ProtectedRoute>
  );
}`;

export const detailPageTemplate = `"use client";

import { useRouter } from "next/navigation";
import { MainLayout } from "@/components/layout/main-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Edit, Trash2 } from "lucide-react";
import ProtectedRoute from "@/components/auth/protected-route";
import { useAuth } from "@/contexts/auth-context";
import { use{{singular.pascal}}, useDelete{{singular.pascal}} } from "@/hooks/use-{{plural.param}}";
import { formatDate } from "@/lib/utils";

export default function {{singular.pascal}}DetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { user: currentUser } = useAuth();
  const { data: {{singular.camel}}, isLoading: {{singular.camel}}Loading } = use{{singular.pascal}}(params.id);
  const delete{{singular.pascal}}Mutation = useDelete{{singular.pascal}}();

  const handleEdit = () => {
    router.push(\`/{{plural.param}}/\${params.id}/edit\`);
  };

  const handleDelete = async () => {
    if (window.confirm(\`Are you sure you want to delete this {{singular.sentence}}?\`)) {
      try {
        await delete{{singular.pascal}}Mutation.mutateAsync(params.id);
        router.push("/{{plural.param}}");
      } catch (error) {
        console.error("Failed to delete {{singular.sentence}}:", error);
      }
    }
  };

  if ({{singular.camel}}Loading) {
    return (
      <ProtectedRoute>
        <MainLayout user={currentUser || undefined}>
          <div className="flex items-center justify-center min-h-[50vh]">
            <div>Loading...</div>
          </div>
        </MainLayout>
      </ProtectedRoute>
    );
  }

  if (!{{singular.camel}}) {
    return (
      <ProtectedRoute>
        <MainLayout user={currentUser || undefined}>
          <div className="flex items-center justify-center min-h-[50vh]">
            <div>{{singular.sentence}} not found</div>
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
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.back()}
                className="h-8 w-8 p-0"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div>
                <h1 className="text-2xl font-bold tracking-tight">{{singular.sentence}} Details</h1>
                <p className="text-muted-foreground">
                  View {{singular.sentence}} information
                </p>
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleEdit}>
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </Button>
              <Button
                variant="destructive"
                onClick={handleDelete}
                disabled={delete{{singular.pascal}}Mutation.isPending}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </Button>
            </div>
          </div>

          {/* Details */}
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
{{#each fields}}
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    {{this.label}}
                  </label>
                  <p className="text-sm">
                    {{{singular.camel}}.{{this.name}}{{#if this.formatValue}} ? {{this.formatValue}} : '-'{{else}} || '-'{{/if}}}
                  </p>
                </div>
{{/each}}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>System Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Created At
                  </label>
                  <p className="text-sm">
                    {formatDate({{singular.camel}}.createdAt)}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Updated At
                  </label>
                  <p className="text-sm">
                    {formatDate({{singular.camel}}.updatedAt)}
                  </p>
                </div>
                {{{singular.camel}}.creator && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Created By
                    </label>
                    <p className="text-sm">
                      {{{singular.camel}}.creator.name} ({{{singular.camel}}.creator.email})
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </MainLayout>
    </ProtectedRoute>
  );
}`;