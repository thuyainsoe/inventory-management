"use client";

import { useMemo, useEffect } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { EntityDrawer } from "@/components/ui/entity-drawer";
import { Edit } from "lucide-react";
import { useUpdateCategory, type Category } from "@/hooks/use-categories";
import { FormFieldGenerator } from "@/components/form/form-field-generator";
import { CategoryFormFieldsSchema } from "@/schemas/categories/category-form-field-schema";
import {
  CategoryFormSchema,
  CategoryFormValues,
} from "@/schemas/categories/category-form-schema";

interface EditCategoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  category: Category | null;
}

export function EditCategoryDrawer({
  isOpen,
  onClose,
  category,
}: EditCategoryDrawerProps) {
  const updateCategoryMutation = useUpdateCategory();

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
    setValue,
  } = methods;

  // Update form values when category changes
  useEffect(() => {
    if (category && isOpen) {
      setValue("name", category.name);
      setValue("description", category.description || "");
      setValue("color", category.color);
      setValue("isActive", category.isActive);
    }
  }, [category, isOpen, setValue]);

  const onSubmit = async (data: CategoryFormValues) => {
    if (!category) return;

    try {
      await updateCategoryMutation.mutateAsync({
        id: category.id,
        data,
      });
      reset();
      onClose();
    } catch (error) {
      console.error("Failed to update category:", error);
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
      title="Edit Category"
      description="Update category information and settings"
      icon={<Edit className="h-5 w-5 text-white" />}
      onSubmit={handleDrawerSubmit}
      submitLabel="Update Category"
      isSubmitting={isSubmitting || updateCategoryMutation.isPending}
      error={errorMessage}
      size="md"
    >
      {formContent}
    </EntityDrawer>
  );
}
