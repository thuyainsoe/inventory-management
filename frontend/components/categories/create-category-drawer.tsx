"use client";

import { useMemo } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { EntityDrawer } from "@/components/ui/entity-drawer";
import { FolderPlus } from "lucide-react";
import { useCreateCategory } from "@/hooks/use-categories";
import { FormFieldGenerator } from "@/components/form/form-field-generator";
import { CategoryFormFieldsSchema } from "@/schemas/categories/category-form-field-schema";
import {
  CategoryFormSchema,
  CategoryFormValues,
} from "@/schemas/categories/category-form-schema";

interface CreateCategoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreateCategoryDrawer({
  isOpen,
  onClose,
}: CreateCategoryDrawerProps) {
  const createCategoryMutation = useCreateCategory();

  const methods = useForm<CategoryFormValues>({
    resolver: zodResolver(CategoryFormSchema),
    defaultValues: {
      name: "",
      description: "",
      color: "#3B82F6",
      isActive: true,
    },
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
    reset,
    formState: { errors },
    watch,
  } = methods;

  console.log(watch("isActive"));

  const onSubmit = async (data: CategoryFormValues) => {
    try {
      await createCategoryMutation.mutateAsync(data);
      reset();
      onClose();
    } catch (error) {
      console.error("Failed to create category:", error);
    }
  };

  const formSchema = useMemo(() => {
    return CategoryFormFieldsSchema();
  }, []);

  const handleDrawerSubmit = () => {
    handleSubmit(onSubmit)();
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  // Create error message from form errors
  const errorMessage = useMemo(() => {
    const errorKeys = Object.keys(errors);
    if (errorKeys.length === 0) return "";

    const firstError = errors[errorKeys[0] as keyof typeof errors];
    return firstError?.message || "Please fix the form errors";
  }, [errors]);

  const formContent = (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <FormFieldGenerator formSchema={formSchema} />
      </form>
    </FormProvider>
  );

  return (
    <EntityDrawer
      isOpen={isOpen}
      onClose={handleClose}
      title="Create New Category"
      icon={<FolderPlus className="h-5 w-5 text-white" />}
      onSubmit={handleDrawerSubmit}
      submitLabel="Create Category"
      isSubmitting={isSubmitting || createCategoryMutation.isPending}
      error={errorMessage}
      size="md"
    >
      {formContent}
    </EntityDrawer>
  );
}
