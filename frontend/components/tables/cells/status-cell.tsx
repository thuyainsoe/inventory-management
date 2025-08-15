import React from 'react';
import { Badge } from '@/components/ui/badge';

interface StatusCellProps {
  value: string | null | undefined;
  statusConfig: Record<string, {
    label?: string;
    color: string;
    variant?: 'default' | 'secondary' | 'destructive' | 'outline';
  }>;
  className?: string;
  fallback?: string;
}

export function StatusCell({ 
  value, 
  statusConfig,
  className = "min-w-[120px]",
  fallback = '-'
}: StatusCellProps) {
  if (!value || !statusConfig[value]) {
    return <div className={className}>{fallback}</div>;
  }

  const config = statusConfig[value];
  const label = config.label || value.charAt(0).toUpperCase() + value.slice(1);

  return (
    <div className={className}>
      <Badge 
        variant={config.variant || 'secondary'} 
        className={config.color}
      >
        {label}
      </Badge>
    </div>
  );
}