
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
  collapsed: boolean;
  toggleCollapse: () => void;
  interface: "admin" | "waiter" | "kitchen" | "customer" | "system";
}> = ({ collapsed, toggleCollapse, interface: interfaceType }) => {
  const location = useLocation();
  const [expandedSections, setExpandedSections] = useState<string[]>([]);
  const { t } = useLanguage();

  const toggleSection = (e: React.MouseEvent, section: string) => {
    e.preventDefault();
    setExpandedSections(prev => 
      prev.includes(section) 
        ? prev.filter(item => item !== section) 
        : [...prev, section]
    );
  };

  const navSections = getNavSections(interfaceType);
  const interfaceTitle = getInterfaceTitle(interfaceType);

  return (
    <div className={cn(
      "h-full flex flex-col bg-sidebar text-sidebar-foreground border-r border-sidebar-border transition-all duration-300 ease-in-out",
      collapsed ? "w-0 overflow-hidden" : "w-64"
    )}>
      <div className="flex flex-col h-full">
        <SidebarHeader collapsed={collapsed} toggleCollapse={toggleCollapse} />
        
        <div className={cn(
          "px-4 py-3 uppercase text-xs font-semibold text-sidebar-foreground/70",
          collapsed ? "hidden" : "block"
        )}>
          <span><T text={interfaceTitle} /></span>
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
                  {section.submenu && !collapsed && (
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
        
        {!collapsed && <SidebarUserProfile collapsed={collapsed} />}
      </div>
    </div>
  );
};
