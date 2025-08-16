"use client";

import React from "react";
import { useFormContext } from "react-hook-form";
import { InputFieldComponent } from "./fields/input-field";
import { TextGenerateFieldComponent } from "./fields/text-generate-field";
import { TextareaFieldComponent } from "./fields/textarea-field";
import { SelectFieldComponent } from "./fields/select-field";
import { CheckboxFieldComponent } from "./fields/checkbox-field";
import { ImageListFieldComponent } from "./fields/image-list-field";
import type { FormSchema, Field } from "./fields/types";


type Props = {
  formSchema: FormSchema;
};

export const FormFieldGenerator = React.memo(({ formSchema }: Props) => {
  const formMethods = useFormContext();
  const {
    watch,
    formState: { errors },
  } = formMethods;

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
          <InputFieldComponent
            key={field.id}
            field={field}
            error={error}
            containerClass={containerClass}
            formMethods={formMethods}
          />
        );

      case "text-generate":
        return (
          <TextGenerateFieldComponent
            key={field.id}
            field={field}
            error={error}
            containerClass={containerClass}
            formMethods={formMethods}
          />
        );

      case "textarea":
        return (
          <TextareaFieldComponent
            key={field.id}
            field={field}
            error={error}
            containerClass={containerClass}
            formMethods={formMethods}
          />
        );

      case "select":
        return (
          <SelectFieldComponent
            key={field.id}
            field={field}
            error={error}
            containerClass={containerClass}
            formMethods={formMethods}
          />
        );

      case "checkbox":
        return (
          <CheckboxFieldComponent
            key={field.id}
            field={field}
            error={error}
            containerClass={containerClass}
            formMethods={formMethods}
          />
        );

      case "image-list":
        return (
          <ImageListFieldComponent
            key={field.id}
            field={field}
            error={error}
            containerClass={containerClass}
            formMethods={formMethods}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-8">
      {formSchema.map((section, index) => (
        <div key={section.sectionId} className="space-y-4">
          {index > 0 && <hr className="border-gray-200" />}
          {section.title && (
            <h3 className="text-lg font-semibold text-gray-900">{section.title}</h3>
          )}
          <div className="grid grid-cols-2 gap-4">
            {section.fields.map(renderField)}
          </div>
        </div>
      ))}
    </div>
  );
});
