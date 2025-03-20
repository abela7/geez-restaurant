
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useLanguage, T } from '@/contexts/LanguageContext';

interface DropdownMenuProps {
  items: { to: string; label: string }[];
  isOpen: boolean;
  isExpanded: boolean;
  parentPath: string;
}

const DropdownMenu: React.FC<DropdownMenuProps> = ({ 
  items, 
  isOpen, 
  isExpanded, 
  parentPath 
}) => {
  const location = useLocation();
  
  if (!isOpen || !isExpanded) return null;
  
  return (
    <div className="ml-8 pl-2 border-l border-border/50">
      {items.map((item) => (
        <Link
          key={item.to}
          to={`${parentPath}/${item.to}`}
          className={cn(
            "block px-3 py-1.5 my-1 rounded-md text-sm transition-colors",
            location.pathname === `${parentPath}/${item.to}` 
              ? "bg-amber-500/80 text-white"
              : "hover:bg-muted"
          )}
        >
          <T text={item.label} />
        </Link>
      ))}
    </div>
  );
};

export default DropdownMenu;
