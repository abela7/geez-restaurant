
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { PanelLeft } from 'lucide-react';
import { useLanguage, T } from '@/contexts/LanguageContext';

interface SidebarHeaderProps {
  collapsed: boolean;
  toggleCollapse: () => void;
}

const SidebarHeader: React.FC<SidebarHeaderProps> = ({ collapsed, toggleCollapse }) => {
  return (
    <div className="p-4 h-16 flex items-center justify-between border-b border-sidebar-border">
      {!collapsed && (
        <Link to="/" className="text-xl font-bold text-primary">
          Ge'ez Restaurant
        </Link>
      )}
      <Button
        variant="ghost"
        size="icon"
        onClick={toggleCollapse}
        className="ml-auto sidebar-toggle"
        aria-label="Toggle sidebar"
      >
        <PanelLeft size={18} className={collapsed ? "rotate-180 transform transition-transform duration-200" : "transition-transform duration-200"} />
      </Button>
    </div>
  );
};

export default SidebarHeader;
