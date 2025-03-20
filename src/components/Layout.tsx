
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { MainSidebar } from './MainSidebar';
import { cn } from '@/lib/utils';
import { useLanguage, T } from '@/contexts/LanguageContext';
import { useIsMobile } from '@/hooks/use-mobile';
import Header from './Header';

import { 
  Breadcrumb, 
  BreadcrumbItem, 
  BreadcrumbLink, 
  BreadcrumbList, 
  BreadcrumbPage, 
  BreadcrumbSeparator 
} from '@/components/ui/breadcrumb';

interface LayoutProps {
  children: React.ReactNode;
  interface?: 'admin' | 'waiter' | 'kitchen' | 'customer' | 'system';
}

const Layout: React.FC<LayoutProps> = ({ children, interface: userInterface = 'admin' }) => {
  // Sidebar is closed by default
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isMobile = useIsMobile();
  const location = useLocation();
  
  useEffect(() => {
    // Close sidebar when location changes
    setSidebarOpen(false);
  }, [location]);
  
  const toggleSidebar = () => {
    setSidebarOpen(prev => !prev);
  };

  const getBreadcrumbs = () => {
    const paths = location.pathname.split('/').filter(path => path);
    
    if (paths.length === 0) {
      return [{ label: 'Dashboard', path: '/' }];
    }
    
    const breadcrumbs = [{ label: 'Dashboard', path: '/' }];
    
    let currentPath = '';
    paths.forEach((path) => {
      currentPath += `/${path}`;
      const label = path
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
      
      breadcrumbs.push({ label, path: currentPath });
    });
    
    return breadcrumbs;
  };
  
  const breadcrumbs = getBreadcrumbs();

  return (
    <div className="flex min-h-screen bg-background">
      {/* Overlay for sidebar */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/60"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      
      {/* Sidebar - fixed position with transform to hide/show */}
      <div 
        className={cn(
          "fixed left-0 top-0 h-screen z-30 transition-transform duration-300 ease-in-out",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <MainSidebar open={sidebarOpen} onToggle={toggleSidebar} interface={userInterface} />
      </div>
      
      {/* Main content */}
      <div className="flex-1 flex flex-col w-full transition-all duration-300">
        <Header toggleSidebar={toggleSidebar} interface={userInterface} />
        
        <main className="flex-1 overflow-auto p-4 md:p-6">
          {children}
        </main>
        
        <footer className="p-3 border-t border-border text-center text-xs text-muted-foreground bg-card/50">
          <p><T text="© 2023 Habesha Restaurant. All rights reserved." /></p>
        </footer>
      </div>
    </div>
  );
};

export default Layout;
