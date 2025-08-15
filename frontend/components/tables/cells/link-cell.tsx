import React from 'react';
import Link from 'next/link';

interface LinkCellProps {
  value: string | null | undefined;
  href: string;
  subtitle?: string;
  className?: string;
  external?: boolean;
}

export function LinkCell({ 
  value, 
  href,
  subtitle,
  className = "min-w-[200px]",
  external = false 
}: LinkCellProps) {
  if (!value) {
    return <div className={className}>-</div>;
  }

  const linkContent = (
    <div className={className}>
      <div className="font-medium hover:underline">
        {value}
      </div>
      {subtitle && (
        <div className="text-sm text-muted-foreground">
          {subtitle}
        </div>
      )}
    </div>
  );

  if (external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="hover:text-primary"
      >
        {linkContent}
      </a>
    );
  }

  return (
    <Link href={href} className="hover:text-primary">
      {linkContent}
    </Link>
  );
}