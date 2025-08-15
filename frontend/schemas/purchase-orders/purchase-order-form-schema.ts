import { z } from "zod";

export const PurchaseOrderItemSchema = z.object({
  productId: z
    .string({
      required_error: "Product is required",
    })
    .min(1, "Product is required"),

  quantity: z
    .number({
      required_error: "Quantity is required",
      invalid_type_error: "Quantity must be a number",
    })
    .int("Quantity must be a whole number")
    .min(1, "Quantity must be at least 1"),

  unitPrice: z
    .number({
      required_error: "Unit price is required",
      invalid_type_error: "Unit price must be a number",
    })
    .min(0.01, "Unit price must be greater than 0")
    .max(999999.99, "Unit price must not exceed 999,999.99"),

  discount: z
    .number({
      invalid_type_error: "Discount must be a number",
    })
    .min(0, "Discount cannot be negative")
    .max(999999.99, "Discount must not exceed 999,999.99")
    .default(0),

  tax: z
    .number({
      invalid_type_error: "Tax must be a number",
    })
    .min(0, "Tax cannot be negative")
    .max(999999.99, "Tax must not exceed 999,999.99")
    .default(0),
});

export const PurchaseOrderFormSchema = z.object({
  poNumber: z
    .string({
      required_error: "PO Number is required",
      invalid_type_error: "PO Number must be a string",
    })
    .min(1, "PO Number is required")
    .min(3, "PO Number must be at least 3 characters")
    .max(50, "PO Number must not exceed 50 characters"),

  poDate: z
    .string({
      required_error: "PO Date is required",
    })
    .min(1, "PO Date is required"),

  supplierId: z
    .string()
    .optional()
    .transform((val) => val ? parseInt(val, 10) : undefined)
    .refine((val) => val === undefined || !isNaN(val), {
      message: "Supplier must be a valid number",
    }),

  deliveryDate: z
    .string()
    .optional()
    .or(z.literal("")),

  status: z
    .enum(["draft", "pending", "approved", "ordered", "received", "cancelled"])
    .default("draft"),

  paymentTerms: z
    .string()
    .max(100, "Payment terms must not exceed 100 characters")
    .optional()
    .or(z.literal("")),

  paymentMethod: z
    .string()
    .max(50, "Payment method must not exceed 50 characters")
    .optional()
    .or(z.literal("")),

  totalAmount: z
    .number({
      required_error: "Total amount is required",
      invalid_type_error: "Total amount must be a number",
    })
    .min(0, "Total amount cannot be negative")
    .max(9999999.99, "Total amount must not exceed 9,999,999.99"),

  paidAmount: z
    .number({
      invalid_type_error: "Paid amount must be a number",
    })
    .min(0, "Paid amount cannot be negative")
    .max(9999999.99, "Paid amount must not exceed 9,999,999.99")
    .default(0),

  notes: z
    .string()
    .max(1000, "Notes must not exceed 1000 characters")
    .optional()
    .or(z.literal("")),

  items: z
    .array(PurchaseOrderItemSchema)
    .min(1, "At least one item is required")
    .max(50, "Cannot exceed 50 items per purchase order"),
});

export type PurchaseOrderFormValues = z.infer<typeof PurchaseOrderFormSchema>;
export type PurchaseOrderItemFormValues = z.infer<typeof PurchaseOrderItemSchema>;