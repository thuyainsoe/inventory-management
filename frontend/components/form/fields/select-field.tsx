"use client";

import React from "react";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SearchableSelect } from "@/components/ui/searchable-select";
import type { FieldComponentProps, SelectField } from "./types";

export function SelectFieldComponent({ field, error, containerClass, formMethods }: FieldComponentProps<SelectField>) {
  const { watch, setValue, clearErrors } = formMethods;

  const handleSelectChange = (fieldName: string, value: string) => {
    setValue(fieldName, value);
    clearErrors(fieldName);
  };

  return (
    <div key={field.id} className={`space-y-2 ${containerClass}`}>
      <Label htmlFor={field.name} className="text-sm font-medium">
        {field.label}
        {field.required && <span className="text-red-500 ml-1">*</span>}
      </Label>
      {field.searchable ? (
        <SearchableSelect
          options={field.options.map(option => ({
            label: option.label,
            value: option.value
          }))}
          value={watch(field.name) || ""}
          onValueChange={(value) => handleSelectChange(field.name, value)}
          placeholder={field.placeholder}
          searchPlaceholder={field.searchPlaceholder || "Search options..."}
          emptyMessage={field.emptyMessage || "No options found."}
          disabled={field.disabled}
          className={error ? "border-red-500" : ""}
        />
      ) : (
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
      )}
      {error && (
        <p className="text-sm text-red-500">{error.message as string}</p>
      )}
    </div>
  );
}