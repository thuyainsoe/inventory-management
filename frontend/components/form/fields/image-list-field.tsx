"use client";

import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import type { FieldComponentProps, ImageListField } from "./types";

export function ImageListFieldComponent({ field, error, containerClass, formMethods }: FieldComponentProps<ImageListField>) {
  const { setValue, clearErrors } = formMethods;

  const [imageLists, setImageLists] = React.useState<Record<string, string[]>>({});
  const [newImageInputs, setNewImageInputs] = React.useState<Record<string, string>>({});

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
}