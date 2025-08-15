import React from 'react';

interface ColorCellProps {
  value: string | null | undefined;
  showColorDot?: boolean;
  className?: string;
  fallback?: string;
}

export function ColorCell({ 
  value, 
  showColorDot = true,
  className = "min-w-[120px]",
  fallback = '-'
}: ColorCellProps) {
  if (!value) {
    return <div className={className}>{fallback}</div>;
  }

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      {showColorDot && (
        <div 
          className="w-4 h-4 rounded-full border border-gray-300"
          style={{ backgroundColor: value }}
        />
      )}
      <span className="font-medium">{value}</span>
    </div>
  );
}