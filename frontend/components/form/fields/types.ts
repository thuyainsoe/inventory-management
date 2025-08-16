import { UseFormReturn } from "react-hook-form";

export type SelectOption = {
  label: string;
  value: string | number;
};

export type BaseField = {
  id: number;
  name: string;
  label: string;
  placeholder?: string;
  fullWidth?: boolean;
  disabled?: boolean;
  required?: boolean;
  className?: string;
  conditional?: {
    field: string;
    value: any;
    operator:
      | "equals"
      | "not_equals"
      | "contains"
      | "greater_than"
      | "less_than";
  };
};

export type InputField = BaseField & {
  type: "text" | "password" | "email" | "number" | "url" | "date";
  min?: number;
  max?: number;
  step?: number;
  pattern?: string;
};

export type TextGenerateField = BaseField & {
  type: "text-generate";
  min?: number;
  max?: number;
  step?: number;
  pattern?: string;
  generatorType: "sku" | "uuid" | "timestamp";
  prefix?: string;
  suffix?: string;
  generateButtonText?: string;
};

export type TextareaField = BaseField & {
  type: "textarea";
  rows?: number;
  maxLength?: number;
};

export type SelectField = BaseField & {
  type: "select";
  options: SelectOption[];
  multiple?: boolean;
  searchable?: boolean;
  searchPlaceholder?: string;
  emptyMessage?: string;
};

export type CheckboxField = BaseField & {
  type: "checkbox";
  description?: string;
};

export type ImageListField = BaseField & {
  type: "image-list";
  maxImages?: number;
};

export type ProductVariantField = BaseField & {
  type: "product-variant";
  maxVariants?: number;
  variantAttributes?: string[];
};

export type Field =
  | InputField
  | TextGenerateField
  | TextareaField
  | SelectField
  | CheckboxField
  | ImageListField
  | ProductVariantField;

export type FormSchema = {
  sectionId: number;
  title?: string;
  fields: Field[];
}[];

export interface BaseFieldProps {
  field: Field;
  error?: any;
  containerClass: string;
}

export interface FieldComponentProps<T extends Field = Field> extends BaseFieldProps {
  field: T;
  formMethods: UseFormReturn<any>;
}