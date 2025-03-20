
import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage, T } from '@/contexts/LanguageContext';

interface SidebarHeaderProps {
  collapsed: boolean;
  toggleCollapse: () => void;
}

const SidebarHeader: React.FC<SidebarHeaderProps> = ({ collapsed }) => {
  return (
    <div className="p-4 h-16 flex items-center justify-between border-b border-sidebar-border">
      <Link to="/" className="text-xl font-bold text-primary">
        Habesha
      </Link>
    </div>
  );
};

export default SidebarHeader;
