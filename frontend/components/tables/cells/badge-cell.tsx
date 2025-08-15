import React from 'react';
import { Badge } from '@/components/ui/badge';

interface BadgeCellProps {
  value: string | null | undefined;
  variant?: 'default' | 'secondary' | 'destructive' | 'outline';
  colorMap?: Record<string, string>;
  className?: string;
  fallback?: string;
}

export function BadgeCell({ 
  value, 
  variant = 'secondary',
  colorMap,
  className = "min-w-[120px]",
  fallback = '-'
}: BadgeCellProps) {
  if (!value) {
    return <div className={className}>{fallback}</div>;
  }

  const badgeClasses = colorMap && colorMap[value] ? colorMap[value] : '';

  return (
    <div className={className}>
      <Badge variant={variant} className={badgeClasses}>
        {value.charAt(0).toUpperCase() + value.slice(1)}
      </Badge>
    </div>
  );
}