import type {
  SelectOption,
  FormSchema,
} from "@/components/form/form-field-generator";

export const UserFormFieldsSchema = ({
  roleOptions,
}: {
  roleOptions: SelectOption[];
}): FormSchema => {
  const fields = [
    // User Information Section
    {
      sectionId: 1,
      title: "User Information",
      fields: [
        {
          id: 1,
          type: "text" as const,
          name: "name",
          label: "Full Name",
          placeholder: "Enter full name",
          required: true,
          fullWidth: true,
        },
        {
          id: 2,
          type: "email" as const,
          name: "email",
          label: "Email Address",
          placeholder: "Enter email address",
          required: true,
          fullWidth: true,
        },
        {
          id: 3,
          type: "password" as const,
          name: "password",
          label: "Password",
          placeholder: "Create a password",
          required: true,
          fullWidth: true,
        },
        {
          id: 4,
          type: "select" as const,
          name: "role",
          label: "Role",
          placeholder: "Select role",
          required: true,
          options: roleOptions,
          fullWidth: true,
        },
        {
          id: 5,
          type: "url" as const,
          name: "avatar",
          label: "Avatar URL",
          placeholder: "Enter avatar URL (optional)",
          required: false,
          fullWidth: true,
        },
      ],
    },
  ];

  return fields;
};
