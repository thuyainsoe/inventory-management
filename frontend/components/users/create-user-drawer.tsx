"use client";

import { useMemo } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { EntityDrawer } from "@/components/ui/entity-drawer";
import { UserPlus } from "lucide-react";
import { useCreateUser } from "@/hooks/use-users";
import { FormFieldGenerator } from "@/components/form/form-field-generator";
import { UserFormFieldsSchema } from "@/schemas/users/user-form-field-schema";
import { UserFormSchema, UserFormValues } from "@/schemas/users/user-form-schema";

interface CreateUserDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

// Role options
const roleOptions = [
  { label: "Staff", value: "staff" },
  { label: "Manager", value: "manager" },
  { label: "Admin", value: "admin" },
];

export function CreateUserDrawer({ isOpen, onClose }: CreateUserDrawerProps) {
  const createUserMutation = useCreateUser();

  const methods = useForm<UserFormValues>({
    resolver: zodResolver(UserFormSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      role: "staff",
      avatar: "",
    },
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
    reset,
    formState: { errors },
  } = methods;

  const onSubmit = async (data: UserFormValues) => {
    try {
      await createUserMutation.mutateAsync(data);
      reset();
      onClose();
    } catch (error) {
      console.error("Failed to create user:", error);
    }
  };

  const formSchema = useMemo(() => {
    return UserFormFieldsSchema({
      roleOptions,
    });
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
      title="Create New User"
      // description="Add a new user to the system with their details and role"
      icon={<UserPlus className="h-5 w-5 text-white" />}
      onSubmit={handleDrawerSubmit}
      submitLabel="Create User"
      isSubmitting={isSubmitting || createUserMutation.isPending}
      error={errorMessage}
      size="md"
    >
      {formContent}
    </EntityDrawer>
  );
}
