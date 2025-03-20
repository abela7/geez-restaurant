
import React from 'react';
import { cn } from '@/lib/utils';
import { useLanguage, T } from '@/contexts/LanguageContext';

interface PageHeaderProps {
  heading?: React.ReactNode;
  title?: React.ReactNode; // Add title prop for backward compatibility
  description?: React.ReactNode;
  subtitle?: React.ReactNode; // Add subtitle prop as an alias for description
  icon?: React.ReactNode;
  actions?: React.ReactNode;
  className?: string;
}

export function PageHeader({
  heading,
  title, // Add title prop in the function parameters
  description,
  subtitle, // Add subtitle prop in the function parameters
  icon,
  actions,
  className,
}: PageHeaderProps) {
  // Use heading if provided, otherwise fall back to title
  const displayHeading = heading || title;
  
  // Use description if provided, otherwise fall back to subtitle
  const displayDescription = description || subtitle;

  return (
    <div className={cn("flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4", className)}>
      <div className="flex items-center gap-3">
        {icon && <div className="flex-shrink-0 text-primary">{icon}</div>}
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            {displayHeading}
          </h1>
          {displayDescription && (
            <p className="text-muted-foreground mt-1">
              {displayDescription}
            </p>
          )}
        </div>
      </div>
      {actions && <div className="flex-shrink-0 flex gap-2">{actions}</div>}
    </div>
  );
}
