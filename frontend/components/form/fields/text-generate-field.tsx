"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Hash } from "lucide-react";
import type { FieldComponentProps, TextGenerateField } from "./types";

export function TextGenerateFieldComponent({ field, error, containerClass, formMethods }: FieldComponentProps<TextGenerateField>) {
  const { register, setValue, clearErrors } = formMethods;

  const generateValue = (
    fieldName: string, 
    generatorType: string, 
    prefix: string = "", 
    suffix: string = ""
  ) => {
    let generatedValue = "";
    
    switch (generatorType) {
      case "sku":
        const timestamp = Date.now().toString().slice(-6);
        const random = Math.random().toString(36).substring(2, 5).toUpperCase();
        const skuPrefix = prefix || "PRD";
        generatedValue = `${skuPrefix}-${timestamp}-${random}`;
        break;
      case "uuid":
        generatedValue = crypto.randomUUID ? crypto.randomUUID() : 
          'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            const r = Math.random() * 16 | 0;
            const v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
          });
        if (prefix || suffix) {
          generatedValue = `${prefix}${generatedValue}${suffix}`;
        }
        break;
      case "timestamp":
        generatedValue = `${prefix}${Date.now()}${suffix}`;
        break;
      default:
        generatedValue = `${prefix}${Date.now()}${suffix}`;
    }
    
    setValue(fieldName, generatedValue);
    clearErrors(fieldName);
  };

  return (
    <div key={field.id} className={`space-y-2 ${containerClass}`}>
      <Label htmlFor={field.name} className="text-sm font-medium">
        {field.label}
        {field.required && <span className="text-red-500 ml-1">*</span>}
      </Label>
      <div className="flex space-x-2">
        <Input
          id={field.name}
          type="text"
          {...register(field.name, {
            required: field.required ? `${field.label} is required` : false,
            pattern: field.pattern
              ? {
                  value: new RegExp(field.pattern),
                  message: `${field.label} format is invalid`,
                }
              : undefined,
          })}
          placeholder={field.placeholder}
          disabled={field.disabled}
          className={`${error ? "border-red-500" : ""} ${
            field.className || ""
          }`}
        />
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            generateValue(
              field.name, 
              field.generatorType, 
              field.prefix || "", 
              field.suffix || ""
            );
          }}
          disabled={field.disabled}
          className="whitespace-nowrap"
        >
          <Hash className="mr-2 h-4 w-4" />
          {field.generateButtonText || `Generate ${field.generatorType.toUpperCase()}`}
        </Button>
      </div>
      {error && (
        <p className="text-sm text-red-500">{error.message as string}</p>
      )}
    </div>
  );
}