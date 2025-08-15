import React from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal } from 'lucide-react';

interface ActionConfig {
  label: string;
  onClick: () => void;
  icon?: React.ReactNode;
  variant?: 'default' | 'destructive';
  separator?: boolean;
}

interface ActionCellProps {
  actions: ActionConfig[];
  className?: string;
}

export function ActionCell({ 
  actions,
  className = "w-[50px]"
}: ActionCellProps) {
  if (!actions || actions.length === 0) {
    return <div className={className}>-</div>;
  }

  return (
    <div className={className}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          {actions.map((action, index) => (
            <React.Fragment key={index}>
              {action.separator && <DropdownMenuSeparator />}
              <DropdownMenuItem
                onClick={action.onClick}
                className={action.variant === 'destructive' ? 'text-red-600' : ''}
              >
                {action.icon && <span className="mr-2">{action.icon}</span>}
                {action.label}
              </DropdownMenuItem>
            </React.Fragment>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}