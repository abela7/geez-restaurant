
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
  const { t } = useLanguage();
  
  if (!isOpen || !isExpanded) return null;
  
  // Fix the path construction to always start with /admin
  const constructPath = (to: string) => {
    if (parentPath.startsWith('/admin')) {
      return `${parentPath}/${to}`;
    }
    return `/admin${parentPath}/${to}`;
  };
  
  return (
    <div className="ml-8 pl-2 border-l border-border/50">
      {items.map((item) => {
        const fullPath = constructPath(item.to);
        console.log(`Menu item path: ${fullPath}, current location: ${location.pathname}`);
        
        return (
          <Link
            key={item.to}
            to={fullPath}
            className={cn(
              "block px-3 py-1.5 my-1 rounded-md text-sm transition-colors",
              location.pathname === fullPath 
                ? "bg-amber-500/80 text-white"
                : "hover:bg-muted"
            )}
          >
            <T text={item.label} />
          </Link>
        );
      })}
    </div>
  );
};

export default DropdownMenu;
