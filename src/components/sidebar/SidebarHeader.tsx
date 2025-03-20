
import React from 'react';
import { Link } from 'react-router-dom';
import { PanelLeft, PanelRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage, T } from '@/contexts/LanguageContext';

interface SidebarHeaderProps {
  collapsed: boolean;
  toggleCollapse: () => void;
}

const SidebarHeader: React.FC<SidebarHeaderProps> = ({ collapsed, toggleCollapse }) => {
  const { t } = useLanguage();
  
  return (
    <div className="p-4 h-16 flex items-center justify-between border-b border-border">
      <Link to="/" className="text-xl font-bold text-amber-500 whitespace-nowrap overflow-hidden">
        {!collapsed ? "Habesha" : "H"}
      </Link>
      
      <Button
        onClick={toggleCollapse}
        variant="ghost"
        size="icon"
        className="h-8 w-8 hover:bg-amber-100 text-amber-700"
        aria-label={t(collapsed ? "Expand sidebar" : "Collapse sidebar")}
      >
        {collapsed ? <PanelRight size={18} /> : <PanelLeft size={18} />}
      </Button>
    </div>
  );
};

export default SidebarHeader;
