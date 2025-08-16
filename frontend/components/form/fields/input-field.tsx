"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { FieldComponentProps, InputField } from "./types";

export function InputFieldComponent({ field, error, containerClass, formMethods }: FieldComponentProps<InputField>) {
  const { register } = formMethods;

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
                min: field.min,
                max: field.max,
              }
            : {
                pattern: field.pattern
                  ? {
                      value: new RegExp(field.pattern),
                      message: `${field.label} format is invalid`,
                    }
                  : undefined,
              }),
        })}
        placeholder={field.placeholder}
        disabled={field.disabled}
        className={`${error ? "border-red-500" : ""} ${field.className || ""}`}
        step={field.step}
      />
      {error && (
        <p className="text-sm text-red-500">{error.message as string}</p>
      )}
    </div>
  );
}