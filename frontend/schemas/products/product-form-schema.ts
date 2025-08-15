import { z } from "zod";

export const ProductFormSchema = z.object({
  name: z
    .string({
      required_error: "Product name is required",
      invalid_type_error: "Product name must be a string",
    })
    .min(1, "Product name is required")
    .min(2, "Product name must be at least 2 characters")
    .max(100, "Product name must not exceed 100 characters"),

  sku: z
    .string({
      required_error: "SKU is required",
      invalid_type_error: "SKU must be a string",
    })
    .min(1, "SKU is required")
    .min(3, "SKU must be at least 3 characters")
    .max(50, "SKU must not exceed 50 characters")
    .regex(
      /^[A-Z0-9-_]+$/i,
      "SKU can only contain letters, numbers, hyphens, and underscores"
    ),

  barcode: z
    .string()
    .max(50, "Barcode must not exceed 50 characters")
    .optional()
    .or(z.literal("")),

  categoryId: z
    .string({
      required_error: "Category is required",
    })
    .min(1, "Category is required")
    .transform((val) => parseInt(val, 10))
    .refine((val) => !isNaN(val), {
      message: "Category must be a valid number",
    })
    .optional(),

  brandId: z
    .string({
      required_error: "Brand is required",
    })
    .min(1, "Brand is required")
    .transform((val) => parseInt(val, 10))
    .refine((val) => !isNaN(val), {
      message: "Brand must be a valid number",
    })
    .optional(),

  description: z
    .string()
    .max(500, "Description must not exceed 500 characters")
    .optional()
    .or(z.literal("")),

  price: z
    .number({
      required_error: "Price is required",
      invalid_type_error: "Price must be a number",
    })
    .min(0.01, "Price must be greater than 0")
    .max(999999.99, "Price must not exceed 999,999.99"),

  cost: z
    .number({
      required_error: "Cost is required",
      invalid_type_error: "Cost must be a number",
    })
    .min(0, "Cost must be 0 or greater")
    .max(999999.99, "Cost must not exceed 999,999.99"),

  stock: z
    .number({
      required_error: "Stock is required",
      invalid_type_error: "Stock must be a number",
    })
    .int("Stock must be a whole number")
    .min(0, "Stock cannot be negative"),

  minStock: z
    .number({
      required_error: "Minimum stock is required",
      invalid_type_error: "Minimum stock must be a number",
    })
    .int("Minimum stock must be a whole number")
    .min(0, "Minimum stock cannot be negative"),

  images: z.array(z.string().url("Invalid image URL")).optional().default([]),
});

export type ProductFormValues = z.infer<typeof ProductFormSchema>;
