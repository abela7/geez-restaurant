
import React from 'react';
import { Card } from "@/components/ui/card";
import { cn } from '@/lib/utils';
import { useLanguage, T } from '@/contexts/LanguageContext';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string;
  change?: string;
  isPositive?: boolean;
  icon?: React.ReactNode;
  className?: string;
}

export function StatCard({ 
  title, 
  value, 
  change, 
  isPositive = true,
  icon,
  className
}: StatCardProps) {
  return (
    <Card className={cn("card-custom", className)}>
      <div className="p-4">
        <div className="flex justify-between items-center mb-2">
          <p className="text-sm text-muted-foreground">
            <T text={title} />
          </p>
          {icon && <div className="text-muted-foreground">{icon}</div>}
        </div>
        <div className="flex items-end justify-between mt-2">
          <h3 className="text-2xl font-bold">{value}</h3>
          {change && (
            <span className={cn(
              "text-sm font-medium flex items-center gap-1",
              isPositive ? "text-green-600 dark:text-green-500" : "text-red-600 dark:text-red-500"
            )}>
              {isPositive ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
              {change}
            </span>
          )}
        </div>
      </div>
    </Card>
  );
}
