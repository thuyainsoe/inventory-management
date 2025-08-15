"use client";

import { useMemo, useEffect } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { EntityDrawer } from "@/components/ui/entity-drawer";
import { Edit } from "lucide-react";
import { useUpdateUnit, type Unit } from "@/hooks/use-units";
import { FormFieldGenerator } from "@/components/form/form-field-generator";
import { UnitFormFieldsSchema } from "@/schemas/units/unit-form-field-schema";
import {
  UnitFormSchema,
  UnitFormValues,
} from "@/schemas/units/unit-form-schema";

interface EditUnitDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  unit: Unit | null;
}

export function EditUnitDrawer({ isOpen, onClose, unit }: EditUnitDrawerProps) {
  const updateUnitMutation = useUpdateUnit();

  const methods = useForm<UnitFormValues>({
    resolver: zodResolver(UnitFormSchema),
    defaultValues: {
      name: "",
      description: "",
      symbol: "",
      conversionFactor: 1,
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

  // Update form values when unit changes
  useEffect(() => {
    if (unit && isOpen) {
      setValue("name", unit.name);
      setValue("description", unit.description || "");
      setValue("symbol", unit.symbol || "");
      setValue("conversionFactor", unit.conversionFactor ?? 1);
      setValue("isActive", unit.isActive);
    }
  }, [unit, isOpen, setValue]);

  const onSubmit = async (data: UnitFormValues) => {
    if (!unit) return;

    try {
      await updateUnitMutation.mutateAsync({
        id: unit.id,
        data,
      });
      reset();
      onClose();
    } catch (error) {
      console.error("Failed to update unit:", error);
    }
  };

  const formSchema = useMemo(() => UnitFormFieldsSchema(), []);

  const handleDrawerSubmit = () => handleSubmit(onSubmit)();

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
      title="Edit Unit"
      description="Update unit information and settings"
      icon={<Edit className="h-5 w-5 text-white" />}
      onSubmit={handleDrawerSubmit}
      submitLabel="Update Unit"
      isSubmitting={isSubmitting || updateUnitMutation.isPending}
      error={errorMessage}
      size="md"
    >
      {formContent}
    </EntityDrawer>
  );
}
