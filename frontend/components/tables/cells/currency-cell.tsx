import React from 'react';
import { formatCurrency } from '@/lib/utils';

interface CurrencyCellProps {
  value: number | null | undefined;
  currency?: string;
  className?: string;
  showSign?: boolean;
}

export function CurrencyCell({ 
  value, 
  currency = 'USD',
  className = "min-w-[100px]",
  showSign = false 
}: CurrencyCellProps) {
  if (value === null || value === undefined) {
    return <div className={className}>-</div>;
  }

  const isNegative = value < 0;
  const textColor = showSign && isNegative ? 'text-red-600' : '';

  return (
    <div className={`font-medium ${textColor} ${className}`}>
      {formatCurrency(value)}
    </div>
  );
}