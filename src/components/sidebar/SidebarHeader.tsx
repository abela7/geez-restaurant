
import React from 'react';
import { Link } from 'react-router-dom';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage, T } from '@/contexts/LanguageContext';

interface SidebarHeaderProps {
  collapsed: boolean;
  toggleCollapse: () => void;
}

const SidebarHeader: React.FC<SidebarHeaderProps> = ({ collapsed, toggleCollapse }) => {
  const { t } = useLanguage();
  
  return (
    <div className="p-4 h-16 flex items-center justify-between border-b border-gray-200">
      <Link to="/" className="text-xl font-bold text-amber-500">
        Habesha
      </Link>
      
      <div className="flex items-center gap-2">
        <Button
          onClick={toggleCollapse}
          variant="ghost"
          size="icon"
          className="w-8 h-8 hover:bg-gray-100"
          aria-label={t("Close sidebar")}
        >
          <X size={18} />
        </Button>
      </div>
    </div>
  );
};

export default SidebarHeader;
