import type {
  SelectOption,
  FormSchema,
} from "@/components/form/form-field-generator";

export const UnitFormFieldsSchema = (): FormSchema => {
  const fields = [
    // Basic Information Section
    {
      sectionId: 1,
      fields: [
        {
          id: 2,
          type: "text" as const,
          name: "name",
          label: "Unit Name",
          placeholder: "Enter unit name (e.g., Pieces, Kilogram)",
          required: true,
          fullWidth: true,
          maxLength: 100,
        },
        {
          id: 3,
          type: "textarea" as const,
          name: "description",
          label: "Description",
          placeholder: "Enter unit description (optional)",
          required: false,
          fullWidth: true,
          rows: 3,
          maxLength: 500,
        },
        {
          id: 4,
          type: "text" as const,
          name: "symbol",
          label: "Symbol",
          placeholder: "Enter display symbol (e.g., pc, kg, m)",
          required: false,
          fullWidth: true,
          maxLength: 10,
        },
        {
          id: 5,
          type: "number" as const,
          name: "conversionFactor",
          label: "Conversion Factor",
          placeholder: "Enter conversion factor (default 1)",
          required: false,
          fullWidth: true,
        },
        {
          id: 6,
          type: "checkbox" as const,
          name: "isActive",
          label: "Active",
          description: "Unit is available for use",
          required: false,
          fullWidth: true,
        },
      ],
    },
  ];

  return fields;
};
