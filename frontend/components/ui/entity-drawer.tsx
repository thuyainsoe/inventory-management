"use client";

import { ReactNode } from "react";
import { Button } from "./button";
import { SideDrawer } from "./side-drawer";
import { Alert, AlertDescription } from "./alert";

interface EntityDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  icon?: ReactNode;
  children: ReactNode;
  onSubmit: () => void;
  submitLabel?: string;
  isSubmitting?: boolean;
  error?: string;
  size?: "sm" | "md" | "lg" | "xl";
}

export function EntityDrawer({
  isOpen,
  onClose,
  title,
  description,
  icon,
  children,
  onSubmit,
  submitLabel = "Create",
  isSubmitting = false,
  error,
  size = "md",
}: EntityDrawerProps) {
  const footer = (
    <div className="flex gap-3">
      <Button 
        type="button"
        variant="outline"
        onClick={onClose}
        className="flex-1"
      >
        Cancel
      </Button>
      <Button 
        type="submit" 
        className="flex-1 gradient-primary-bg"
        disabled={isSubmitting}
        onClick={onSubmit}
      >
        {isSubmitting ? `${submitLabel.replace(/e$/, '')}ing...` : submitLabel}
      </Button>
    </div>
  );

  const content = (
    <div className="space-y-6">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      {children}
    </div>
  );

  return (
    <SideDrawer
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      description={description}
      icon={icon}
      footer={footer}
      size={size}
    >
      {content}
    </SideDrawer>
  );
}