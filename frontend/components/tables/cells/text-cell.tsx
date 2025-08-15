import React from 'react';

interface TextCellProps {
  value: string | number | null | undefined;
  subtitle?: string | null;
  className?: string;
  truncate?: boolean;
  maxWidth?: string;
  fallback?: string;
}

export function TextCell({ 
  value, 
  subtitle, 
  className = "", 
  truncate = false,
  maxWidth,
  fallback = "-"
}: TextCellProps) {
  const containerClasses = `
    ${maxWidth ? maxWidth : 'min-w-[120px]'}
    ${truncate ? 'truncate' : ''}
    ${className}
  `.trim();

  return (
    <div className={containerClasses}>
      <div className={`font-medium ${truncate ? 'truncate' : ''}`}>
        {value || fallback}
      </div>
      {subtitle && (
        <div className={`text-sm text-muted-foreground ${truncate ? 'truncate' : ''}`}>
          {subtitle}
        </div>
      )}
    </div>
  );
}