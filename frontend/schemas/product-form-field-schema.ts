import type {
  SelectOption,
  FormSchema,
} from "@/components/form/form-field-generator";

export const ProductFormFieldsSchema = ({
  categoryOptions,
}: {
  categoryOptions: SelectOption[];
}): FormSchema => {
  const fields = [
    // Basic Information Section
    {
      sectionId: 1,
      title: "Basic Information",
      fields: [
        {
          id: 1,
          type: "text" as const,
          name: "name",
          label: "Product Name",
          placeholder: "Enter product name",
          required: true,
          fullWidth: true,
        },
        {
          id: 2,
          type: "text" as const,
          name: "sku",
          label: "SKU",
          placeholder: "Enter SKU",
          required: true,
          pattern: "^[A-Z0-9-_]+$",
        },
        {
          id: 3,
          type: "generator" as const,
          name: "sku-generator",
          label: "Generate SKU",
          generatorType: "sku" as const,
          targetField: "sku",
          prefix: "PRD",
        },
        {
          id: 4,
          type: "text" as const,
          name: "barcode",
          label: "Barcode",
          placeholder: "Enter barcode (optional)",
          required: false,
        },
        {
          id: 5,
          type: "select" as const,
          name: "categoryId",
          label: "Category",
          placeholder: "Select category",
          required: true,
          options: categoryOptions,
        },
        {
          id: 6,
          type: "textarea" as const,
          name: "description",
          label: "Description",
          placeholder: "Enter product description (optional)",
          required: false,
          fullWidth: true,
          rows: 4,
          maxLength: 500,
        },
      ],
    },
    // Pricing Section
    {
      sectionId: 2,
      title: "Pricing & Costs",
      fields: [
        {
          id: 7,
          type: "number" as const,
          name: "price",
          label: "Selling Price",
          placeholder: "0.00",
          required: true,
          min: 0.01,
          max: 999999.99,
          step: 0.01,
        },
        {
          id: 8,
          type: "number" as const,
          name: "cost",
          label: "Cost Price",
          placeholder: "0.00",
          required: true,
          min: 0,
          max: 999999.99,
          step: 0.01,
        },
      ],
    },
    // Inventory Section
    {
      sectionId: 3,
      title: "Inventory",
      fields: [
        {
          id: 9,
          type: "number" as const,
          name: "stock",
          label: "Current Stock",
          placeholder: "0",
          required: true,
          min: 0,
        },
        {
          id: 10,
          type: "number" as const,
          name: "minStock",
          label: "Minimum Stock",
          placeholder: "0",
          required: true,
          min: 0,
        },
      ],
    },
    // Images Section
    {
      sectionId: 4,
      title: "Product Images",
      fields: [
        {
          id: 11,
          type: "image-list" as const,
          name: "images",
          label: "Product Images",
          placeholder: "Enter image URL",
          required: false,
          fullWidth: true,
          maxImages: 5,
        },
      ],
    },
  ];

  return fields;
};
