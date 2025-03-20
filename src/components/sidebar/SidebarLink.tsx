
import React from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useLanguage, T } from '@/contexts/LanguageContext';
import { ChevronDown, ChevronRight } from 'lucide-react';

interface SidebarLinkProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  isOpen: boolean;
  hasDropdown?: boolean;
  isExpanded?: boolean;
  onClick?: (e: React.MouseEvent) => void;
}

const SidebarLink: React.FC<SidebarLinkProps> = ({ 
  to, 
  icon, 
  label, 
  isActive, 
  isOpen, 
  hasDropdown = false, 
  isExpanded = false, 
  onClick 
}) => {
  return (
    <div className="relative">
      <Link
        to={to}
        className={cn(
          "flex items-center px-3 py-2.5 my-1 rounded-md transition-colors group",
          isActive 
            ? "bg-amber-500 text-white font-medium" 
            : "hover:bg-muted",
          !isOpen && "justify-center"
        )}
        onClick={hasDropdown ? onClick : undefined}
        title={!isOpen ? label : undefined} // Show tooltip only when collapsed
      >
        <div className={cn(
          "flex items-center justify-center",
          isOpen ? "w-8 h-8" : "w-6 h-6"
        )}>
          {icon}
        </div>
        
        {isOpen && (
          <>
            <span className="ml-2 text-sm truncate"><T text={label} /></span>
            {hasDropdown && (
              <div className="ml-auto">
                {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
              </div>
            )}
          </>
        )}
      </Link>
    </div>
  );
};

export default SidebarLink;
