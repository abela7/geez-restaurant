
import React from 'react';
import { cn } from '@/lib/utils';
import { useLanguage, T } from '@/contexts/LanguageContext';
import { ScrollArea } from '@/components/ui/scroll-area';
import { LucideIcon } from 'lucide-react';

interface TabNavItem {
  icon: React.ReactNode;
  label: string;
  value: string;
}

interface TabNavProps {
  items: TabNavItem[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

const TabNav: React.FC<TabNavProps> = ({ items, value, onChange, className }) => {
  return (
    <ScrollArea className={cn("w-full", className)}>
      <div className="flex space-x-1 p-1 bg-muted/40 rounded-md whitespace-nowrap">
        {items.map((item) => (
          <button
            key={item.value}
            onClick={() => onChange(item.value)}
            className={cn(
              "flex items-center px-3 py-1.5 text-sm rounded-md transition-colors",
              value === item.value 
                ? "bg-card text-foreground shadow-sm font-medium" 
                : "text-muted-foreground hover:text-foreground hover:bg-muted/70"
            )}
          >
            {item.icon}
            <span className="ml-2"><T text={item.label} /></span>
          </button>
        ))}
      </div>
    </ScrollArea>
  );
};

export default TabNav;
