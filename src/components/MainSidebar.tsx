
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useLanguage, T } from '@/contexts/LanguageContext';
import SidebarLink from './sidebar/SidebarLink';
import DropdownMenu from './sidebar/DropdownMenu';
import SidebarUserProfile from './sidebar/SidebarUserProfile';
import SidebarHeader from './sidebar/SidebarHeader';
import { getNavSections, getInterfaceTitle, NavSection } from './sidebar/SidebarNavData';

export const MainSidebar: React.FC<{
  open: boolean;
  onToggle: () => void;
  interface: "admin" | "waiter" | "kitchen" | "customer" | "system";
}> = ({ open, onToggle, interface: interfaceType }) => {
  const location = useLocation();
  const [expandedSections, setExpandedSections] = useState<string[]>([]);
  const { t } = useLanguage();
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    // Check if there's a stored value for sidebar collapsed state
    const storedCollapsed = localStorage.getItem('sidebarCollapsed');
    if (storedCollapsed !== null) {
      setCollapsed(storedCollapsed === 'true');
    }
  }, []);

  useEffect(() => {
    // Save collapsed state to localStorage when it changes
    localStorage.setItem('sidebarCollapsed', collapsed.toString());
  }, [collapsed]);

  const toggleSection = (e: React.MouseEvent, section: string) => {
    e.preventDefault();
    setExpandedSections(prev => 
      prev.includes(section) 
        ? prev.filter(item => item !== section) 
        : [...prev, section]
    );
  };

  const toggleCollapse = () => {
    setCollapsed(prev => !prev);
  };

  const navSections = getNavSections(interfaceType);
  const interfaceTitle = getInterfaceTitle(interfaceType);
  const sidebarWidth = collapsed ? "w-16" : "w-64";

  return (
    <div className={cn(
      "h-full flex flex-col bg-white text-gray-800 border-r border-gray-200",
      sidebarWidth,
      "transition-all duration-300 ease-in-out"
    )}>
      <div className="flex flex-col h-full">
        <SidebarHeader collapsed={collapsed} toggleCollapse={toggleCollapse} />
        
        <div className="px-4 py-3 uppercase text-xs font-semibold text-gray-500">
          {!collapsed && <span><T text={interfaceTitle} /></span>}
        </div>
        
        <div className="flex-1 py-2 overflow-y-auto">
          <nav className="px-2">
            {interfaceType === 'admin' ? (
              navSections.map((section: NavSection) => (
                <React.Fragment key={section.path}>
                  <SidebarLink
                    to={section.submenu ? '#' : section.path}
                    icon={section.icon}
                    label={section.label}
                    isActive={
                      section.submenu 
                        ? location.pathname.startsWith(section.path) 
                        : location.pathname === section.path
                    }
                    isOpen={!collapsed}
                    hasDropdown={!!section.submenu}
                    isExpanded={expandedSections.includes(section.path)}
                    onClick={(e) => section.submenu ? toggleSection(e, section.path) : undefined}
                  />
                  {section.submenu && (
                    <DropdownMenu 
                      items={section.submenu} 
                      isOpen={!collapsed} 
                      isExpanded={expandedSections.includes(section.path)}
                      parentPath={section.path}
                    />
                  )}
                </React.Fragment>
              ))
            ) : (
              navSections.map((link: NavSection) => (
                <SidebarLink
                  key={link.path}
                  to={link.path}
                  icon={link.icon}
                  label={link.label}
                  isActive={location.pathname === link.path}
                  isOpen={!collapsed}
                />
              ))
            )}
          </nav>
        </div>
        
        <SidebarUserProfile collapsed={collapsed} />
      </div>
    </div>
  );
};
