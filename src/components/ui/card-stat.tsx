
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
  trend?: number;
  trendText?: string;
  positive?: boolean;
}

export function StatCard({ 
  title, 
  value, 
  change, 
  isPositive = true,
  icon,
  className,
  trend,
  trendText,
  positive
}: StatCardProps) {
  // Use trend and positive if provided, otherwise use change and isPositive
  const displayTrend = trend !== undefined ? trend : change;
  const displayPositive = positive !== undefined ? positive : isPositive;
  const displayTrendText = trendText !== undefined ? trendText : displayTrend;

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
          {displayTrend && (
            <span className={cn(
              "text-sm font-medium flex items-center gap-1",
              displayPositive ? "text-green-600 dark:text-green-500" : "text-red-600 dark:text-red-500"
            )}>
              {displayPositive ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
              {displayTrendText}
            </span>
          )}
        </div>
      </div>
    </Card>
  );
}

// Export as CardStat as well for backward compatibility
export { StatCard as CardStat };
