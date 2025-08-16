"use client";

import React from "react";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import type { FieldComponentProps, CheckboxField } from "./types";

export function CheckboxFieldComponent({ field, error, containerClass, formMethods }: FieldComponentProps<CheckboxField>) {
  const { watch, setValue } = formMethods;

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
}