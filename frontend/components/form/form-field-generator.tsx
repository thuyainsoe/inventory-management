"use client";

import React from "react";
import { useFormContext } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { X, Hash } from "lucide-react";

export type SelectOption = {
  label: string;
  value: string | number;
};

export type FormSchema = {
  sectionId: number;
  title?: string;
  fields: Field[];
}[];

type BaseField = {
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

export type TextareaField = BaseField & {
  type: "textarea";
  rows?: number;
  maxLength?: number;
};

export type SelectField = BaseField & {
  type: "select";
  options: SelectOption[];
  multiple?: boolean;
};

export type CheckboxField = BaseField & {
  type: "checkbox";
  description?: string;
};

export type ImageListField = BaseField & {
  type: "image-list";
  maxImages?: number;
};

export type GeneratorField = BaseField & {
  type: "generator";
  generatorType: "sku";
  targetField: string;
  prefix?: string;
};

export type Field =
  | InputField
  | TextareaField
  | SelectField
  | CheckboxField
  | ImageListField
  | GeneratorField;

type Props = {
  formSchema: FormSchema;
};

export const FormFieldGenerator = React.memo(({ formSchema }: Props) => {
  const {
    register,
    watch,
    setValue,
    formState: { errors },
    clearErrors,
  } = useFormContext();

  // Function to check if field should be shown based on conditional logic
  const shouldShowField = (field: Field): boolean => {
    if (!field.conditional) return true;

    const { field: watchField, value, operator } = field.conditional;
    const watchedValue = watch(watchField);

    switch (operator) {
      case "equals":
        return watchedValue === value;
      case "not_equals":
        return watchedValue !== value;
      case "contains":
        return Array.isArray(watchedValue)
          ? watchedValue.includes(value)
          : watchedValue?.includes?.(value);
      case "greater_than":
        return Number(watchedValue) > Number(value);
      case "less_than":
        return Number(watchedValue) < Number(value);
      default:
        return true;
    }
  };

  // Generator functions
  const generateSKU = (targetField: string, prefix: string = "PRD") => {
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.random().toString(36).substring(2, 5).toUpperCase();
    const generatedSKU = `${prefix}-${timestamp}-${random}`;
    setValue(targetField, generatedSKU);
    clearErrors(targetField);
  };

  // Image list management
  const [imageLists, setImageLists] = React.useState<Record<string, string[]>>(
    {}
  );
  const [newImageInputs, setNewImageInputs] = React.useState<
    Record<string, string>
  >({});

  const addImage = (fieldName: string) => {
    const newUrl = newImageInputs[fieldName]?.trim();
    if (!newUrl) return;

    const currentImages = imageLists[fieldName] || [];
    if (currentImages.includes(newUrl)) return;

    const updatedImages = [...currentImages, newUrl];
    setImageLists((prev) => ({ ...prev, [fieldName]: updatedImages }));
    setValue(fieldName, updatedImages);
    setNewImageInputs((prev) => ({ ...prev, [fieldName]: "" }));
    clearErrors(fieldName);
  };

  const removeImage = (fieldName: string, index: number) => {
    const currentImages = imageLists[fieldName] || [];
    const updatedImages = currentImages.filter((_, i) => i !== index);
    setImageLists((prev) => ({ ...prev, [fieldName]: updatedImages }));
    setValue(fieldName, updatedImages);
  };

  const handleSelectChange = (fieldName: string, value: string) => {
    setValue(fieldName, value);
    clearErrors(fieldName);
  };

  const renderField = (field: Field) => {
    if (!shouldShowField(field)) return null;

    const error = errors[field.name];
    const containerClass = field.fullWidth ? "col-span-2" : "col-span-1";

    switch (field.type) {
      case "text":
      case "password":
      case "email":
      case "number":
      case "url":
      case "date":
        return (
          <div key={field.id} className={`space-y-2 ${containerClass}`}>
            <Label htmlFor={field.name} className="text-sm font-medium">
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <Input
              id={field.name}
              type={field.type}
              {...register(field.name, {
                required: field.required ? `${field.label} is required` : false,
                ...(field.type === "number"
                  ? {
                      valueAsNumber: true,
                      min: "min" in field ? field.min : undefined,
                      max: "max" in field ? field.max : undefined,
                    }
                  : {
                      pattern:
                        "pattern" in field && field.pattern
                          ? {
                              value: new RegExp(field.pattern),
                              message: `${field.label} format is invalid`,
                            }
                          : undefined,
                    }),
              })}
              placeholder={field.placeholder}
              disabled={field.disabled}
              className={`${error ? "border-red-500" : ""} ${
                field.className || ""
              }`}
              step={"step" in field ? field.step : undefined}
            />
            {error && (
              <p className="text-sm text-red-500">{error.message as string}</p>
            )}
          </div>
        );

      case "textarea":
        return (
          <div key={field.id} className={`space-y-2 ${containerClass}`}>
            <Label htmlFor={field.name} className="text-sm font-medium">
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <Textarea
              id={field.name}
              {...register(field.name, {
                required: field.required ? `${field.label} is required` : false,
                maxLength: field.maxLength
                  ? {
                      value: field.maxLength,
                      message: `${field.label} must not exceed ${field.maxLength} characters`,
                    }
                  : undefined,
              })}
              placeholder={field.placeholder}
              disabled={field.disabled}
              rows={field.rows || 4}
              className={`${error ? "border-red-500" : ""} ${
                field.className || ""
              }`}
            />
            {field.maxLength && (
              <p className="text-xs text-muted-foreground">
                {watch(field.name)?.length || 0}/{field.maxLength} characters
              </p>
            )}
            {error && (
              <p className="text-sm text-red-500">{error.message as string}</p>
            )}
          </div>
        );

      case "select":
        return (
          <div key={field.id} className={`space-y-2 ${containerClass}`}>
            <Label htmlFor={field.name} className="text-sm font-medium">
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <Select
              onValueChange={(value) => handleSelectChange(field.name, value)}
              value={watch(field.name) || ""}
              disabled={field.disabled}
            >
              <SelectTrigger className={error ? "border-red-500" : ""}>
                <SelectValue placeholder={field.placeholder} />
              </SelectTrigger>
              <SelectContent className="max-h-60 overflow-y-auto">
                {field.options.map((option) => (
                  <SelectItem key={option.value} value={String(option.value)}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {error && (
              <p className="text-sm text-red-500">{error.message as string}</p>
            )}
          </div>
        );

      case "checkbox":
        return (
          <div key={field.id} className={`space-y-2 ${containerClass}`}>
            <div className="flex items-center space-x-2">
              <Checkbox
                id={field.name}
                checked={watch(field.name)}
                onCheckedChange={(checked) => {
                  setValue(field.name, checked);
                }}
                disabled={field.disabled}
              />
              <Label htmlFor={field.name} className="text-sm font-medium">
                {field.label}
                {field.required && <span className="text-red-500 ml-1">*</span>}
              </Label>
            </div>
            {field.description && (
              <p className="text-sm text-muted-foreground">
                {field.description}
              </p>
            )}
            {error && (
              <p className="text-sm text-red-500">{error.message as string}</p>
            )}
          </div>
        );

      case "image-list":
        const currentImages = imageLists[field.name] || [];
        return (
          <div key={field.id} className={`space-y-2 ${containerClass}`}>
            <Label className="text-sm font-medium">
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <div className="space-y-2">
              <div className="flex space-x-2">
                <Input
                  placeholder={field.placeholder || "Enter image URL"}
                  value={newImageInputs[field.name] || ""}
                  onChange={(e) =>
                    setNewImageInputs((prev) => ({
                      ...prev,
                      [field.name]: e.target.value,
                    }))
                  }
                  onKeyDown={(e) =>
                    e.key === "Enter" &&
                    (e.preventDefault(), addImage(field.name))
                  }
                  disabled={field.disabled}
                />
                <Button
                  type="button"
                  onClick={() => addImage(field.name)}
                  disabled={field.disabled}
                >
                  Add
                </Button>
              </div>

              {currentImages.length > 0 && (
                <div className="space-y-2">
                  <Label className="text-sm">Added Images:</Label>
                  <div className="space-y-2">
                    {currentImages.map((url, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-2 bg-muted rounded"
                      >
                        <span className="text-sm truncate">{url}</span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeImage(field.name, index)}
                          disabled={field.disabled}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            {error && (
              <p className="text-sm text-red-500">{error.message as string}</p>
            )}
          </div>
        );

      case "generator":
        return (
          <div key={field.id} className={`space-y-2 ${containerClass}`}>
            <Label className="text-sm font-medium">{field.label}</Label>
            <div className="flex space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  if (field.generatorType === "sku") {
                    generateSKU(field.targetField, field.prefix);
                  }
                }}
                disabled={field.disabled}
                className="w-full"
              >
                <Hash className="mr-2 h-4 w-4" />
                Generate {field.generatorType.toUpperCase()}
              </Button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {formSchema.map((section) => (
        <div key={section.sectionId} className="space-y-4">
          {section.title && (
            <h3 className="text-lg font-semibold">{section.title}</h3>
          )}
          <div className="grid grid-cols-2 gap-4">
            {section.fields.map(renderField)}
          </div>
        </div>
      ))}
    </div>
  );
});
