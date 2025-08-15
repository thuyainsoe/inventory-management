import React from 'react';
import { formatDate } from '@/lib/utils';

interface DateCellProps {
  value: string | Date | null | undefined;
  format?: 'short' | 'long' | 'time' | 'datetime';
  fallback?: string;
  className?: string;
}

export function DateCell({ 
  value, 
  format = 'short',
  fallback = '-',
  className = "min-w-[120px]" 
}: DateCellProps) {
  if (!value) {
    return <div className={className}>{fallback}</div>;
  }

  let formattedDate: string;
  
  try {
    const date = typeof value === 'string' ? new Date(value) : value;
    
    switch (format) {
      case 'long':
        formattedDate = date.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        });
        break;
      case 'time':
        formattedDate = date.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit'
        });
        break;
      case 'datetime':
        formattedDate = date.toLocaleString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        });
        break;
      default:
        formattedDate = formatDate(value);
    }
  } catch (error) {
    formattedDate = fallback;
  }

  return (
    <div className={`text-sm ${className}`}>
      {formattedDate}
    </div>
  );
}