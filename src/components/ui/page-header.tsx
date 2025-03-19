
import React from 'react';
import { cn } from '@/lib/utils';
import { useLanguage, T } from '@/contexts/LanguageContext';

interface PageHeaderProps {
  heading: React.ReactNode;
  description?: React.ReactNode;
  icon?: React.ReactNode;
  actions?: React.ReactNode;
  className?: string;
}

export function PageHeader({
  heading,
  description,
  icon,
  actions,
  className,
}: PageHeaderProps) {
  return (
    <div className={cn("flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4", className)}>
      <div className="flex items-center gap-3">
        {icon && <div className="flex-shrink-0 text-primary">{icon}</div>}
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            {heading}
          </h1>
          {description && (
            <p className="text-muted-foreground mt-1">
              {description}
            </p>
          )}
        </div>
      </div>
      {actions && <div className="flex-shrink-0 flex gap-2">{actions}</div>}
    </div>
  );
}
