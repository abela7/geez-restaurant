
import React from 'react';
import { cn } from '@/lib/utils';
import { useLanguage, T } from '@/contexts/LanguageContext';

interface PageHeaderProps {
  title: string;
  description?: string;
  actions?: React.ReactNode;
  className?: string;
}

export function PageHeader({
  title,
  description,
  actions,
  className,
}: PageHeaderProps) {
  return (
    <div className={cn("flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4", className)}>
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          <T text={title} />
        </h1>
        {description && (
          <p className="text-muted-foreground mt-1">
            <T text={description} />
          </p>
        )}
      </div>
      {actions && <div className="flex-shrink-0 flex gap-2">{actions}</div>}
    </div>
  );
}
