
import React from 'react';
import { cn } from '@/lib/utils';
import { useLanguage, T } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

interface PageHeaderProps {
  heading?: React.ReactNode;
  title?: React.ReactNode; // For backward compatibility
  description?: React.ReactNode;
  icon?: React.ReactNode;
  actions?: React.ReactNode;
  className?: string;
  backHref?: string;
  compact?: boolean; // Added compact prop
}

export function PageHeader({
  heading,
  title, // For backward compatibility
  description,
  icon,
  actions,
  className,
  backHref,
  compact = true, // Default to true for more compact design
}: PageHeaderProps) {
  // Use heading if provided, otherwise fall back to title
  const displayHeading = heading || title;

  return (
    <div className={cn(
      "flex flex-col sm:flex-row items-start sm:items-center justify-between gap-1", 
      compact ? "mb-2" : "mb-4",
      className
    )}>
      <div className="flex items-center gap-1.5">
        {backHref && (
          <Button variant="ghost" size="icon" asChild className="mr-1 h-8 w-8">
            <Link to={backHref}>
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
        )}
        {icon && <div className="flex-shrink-0 text-primary">{icon}</div>}
        <div>
          <h1 className={cn("font-bold tracking-tight", compact ? "text-lg" : "text-xl")}>
            {displayHeading}
          </h1>
          {description && (
            <p className="text-muted-foreground text-xs">
              {description}
            </p>
          )}
        </div>
      </div>
      {actions && <div className="flex-shrink-0 flex gap-1.5 items-center">{actions}</div>}
    </div>
  );
}
