import React from 'react';

interface CodeCellProps {
  value: string | null | undefined;
  className?: string;
  copyable?: boolean;
  fallback?: string;
}

export function CodeCell({ 
  value, 
  className = "min-w-[150px]",
  copyable = false,
  fallback = '-'
}: CodeCellProps) {
  if (!value) {
    return <div className={className}>{fallback}</div>;
  }

  const handleCopy = async () => {
    if (copyable && value) {
      try {
        await navigator.clipboard.writeText(value);
      } catch (err) {
        console.error('Failed to copy text: ', err);
      }
    }
  };

  return (
    <div className={className}>
      <code 
        className={`text-sm bg-muted px-2 py-1 rounded ${copyable ? 'cursor-pointer hover:bg-muted/80' : ''}`}
        onClick={copyable ? handleCopy : undefined}
        title={copyable ? 'Click to copy' : undefined}
      >
        {value}
      </code>
    </div>
  );
}