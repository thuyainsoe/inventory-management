import { z } from "zod";

export const UnitFormSchema = z.object({
  name: z
    .string({
      required_error: "Unit name is required",
      invalid_type_error: "Unit name must be a string",
    })
    .min(1, "Unit name is required")
    .min(2, "Unit name must be at least 2 characters")
    .max(100, "Unit name must not exceed 100 characters"),

  description: z
    .string()
    .max(500, "Description must not exceed 500 characters")
    .optional()
    .or(z.literal("")),

  symbol: z
    .string()
    .max(10, "Symbol must not exceed 10 characters")
    .optional()
    .or(z.literal("")),

  conversionFactor: z
    .number({
      invalid_type_error: "Conversion factor must be a number",
    })
    .positive("Conversion factor must be greater than 0")
    .optional()
    .default(1),

  isActive: z.boolean().optional().default(true),
});

export type UnitFormValues = z.infer<typeof UnitFormSchema>;
