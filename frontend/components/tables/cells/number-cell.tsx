import React from 'react';

interface NumberCellProps {
  value: number | null | undefined;
  format?: 'default' | 'thousands' | 'percentage';
  decimals?: number;
  suffix?: string;
  className?: string;
  fallback?: string;
}

export function NumberCell({ 
  value, 
  format = 'default',
  decimals = 0,
  suffix = '',
  className = "min-w-[100px]",
  fallback = '-'
}: NumberCellProps) {
  if (value === null || value === undefined) {
    return <div className={className}>{fallback}</div>;
  }

  let formattedValue: string;

  switch (format) {
    case 'thousands':
      formattedValue = value.toLocaleString('en-US', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals
      });
      break;
    case 'percentage':
      formattedValue = `${(value * 100).toFixed(decimals)}%`;
      break;
    default:
      formattedValue = decimals > 0 
        ? value.toFixed(decimals) 
        : value.toString();
  }

  return (
    <div className={`font-medium ${className}`}>
      {formattedValue}{suffix}
    </div>
  );
}