
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
  
  // Ensure consistent path construction for menu items
  const constructPath = (to: string) => {
    // If to is already a full path starting with /, just return it
    if (to.startsWith('/')) {
      return to;
    }
    
    // If parentPath already ends with a /, don't add another slash
    if (parentPath.endsWith('/')) {
      return `${parentPath}${to}`;
    }
    
    // Otherwise, add a / between parentPath and to
    return `${parentPath}/${to}`;
  };
  
  // For debugging - check paths being generated
  console.log("Parent path:", parentPath);
  console.log("Menu items:", items);
  
  return (
    <div className="ml-8 pl-2 border-l border-border/50">
      {items.map((item) => {
        const fullPath = constructPath(item.to);
        console.log("Constructed path:", fullPath); // Log the constructed path
        
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
