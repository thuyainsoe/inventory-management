import type {
  SelectOption,
  FormSchema,
} from "@/components/form/form-field-generator";

// Common colors for categories
const colorOptions: SelectOption[] = [
  { label: "Blue", value: "#3B82F6" },
  { label: "Green", value: "#10B981" },
  { label: "Purple", value: "#8B5CF6" },
  { label: "Red", value: "#EF4444" },
  { label: "Orange", value: "#F97316" },
  { label: "Yellow", value: "#F59E0B" },
  { label: "Pink", value: "#EC4899" },
  { label: "Indigo", value: "#6366F1" },
  { label: "Teal", value: "#14B8A6" },
  { label: "Gray", value: "#6B7280" },
];

export const CategoryFormFieldsSchema = (): FormSchema => {
  const fields = [
    // Basic Information Section
    {
      sectionId: 1,
      fields: [
        {
          id: 1,
          type: "text" as const,
          name: "name",
          label: "Category Name",
          placeholder: "Enter category name",
          required: true,
          fullWidth: true,
        },
        {
          id: 2,
          type: "textarea" as const,
          name: "description",
          label: "Description",
          placeholder: "Enter category description (optional)",
          required: false,
          fullWidth: true,
          rows: 3,
          maxLength: 500,
        },
        {
          id: 3,
          type: "select" as const,
          name: "color",
          label: "Color",
          placeholder: "Select category color",
          required: false,
          fullWidth: true,
          options: colorOptions,
        },
        {
          id: 5,
          type: "checkbox" as const,
          name: "isActive",
          label: "Active",
          description: "Category is available for use",
          required: false,
          fullWidth: true,
        },
      ],
    },
  ];

  return fields;
};
