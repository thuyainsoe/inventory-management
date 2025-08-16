"use client";

import React from "react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { FieldComponentProps, TextareaField } from "./types";

export function TextareaFieldComponent({ field, error, containerClass, formMethods }: FieldComponentProps<TextareaField>) {
  const { register, watch } = formMethods;

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
}