import { ReactNode } from "react";
import { Button } from "@/components/ui/button";

interface PageHeaderProps {
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
    icon?: ReactNode;
    className?: string;
  };
  additionalActions?: ReactNode;
}

export function PageHeader({
  title,
  description,
  action,
  additionalActions,
}: PageHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-bold tracking-tight gradient-text">
          {title}
        </h1>
        <p className="text-muted-foreground text-base">{description}</p>
      </div>
      <div className="flex items-center space-x-2">
        {additionalActions}
        {action && (
          <Button
            onClick={action.onClick}
            className={action.className || "gradient-primary-bg"}
          >
            {action.icon && <span className="mr-2">{action.icon}</span>}
            {action.label}
          </Button>
        )}
      </div>
    </div>
  );
}
