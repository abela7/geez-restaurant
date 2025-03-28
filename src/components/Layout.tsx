
import React, { useState, useEffect } from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import { MainSidebar } from './MainSidebar';
import { cn } from '@/lib/utils';
import { useLanguage, T } from '@/contexts/LanguageContext';
import { useIsMobile } from '@/hooks/use-mobile';
import Header from './Header';
import { Button } from './ui/button';
import { PanelLeft } from 'lucide-react';

interface LayoutProps {
  children?: React.ReactNode;
  interface?: 'admin' | 'waiter' | 'kitchen' | 'customer' | 'system';
  contentOnly?: boolean;
}

const Layout: React.FC<LayoutProps> = ({ children, interface: userInterface = 'admin', contentOnly = false }) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const isMobile = useIsMobile();
  const location = useLocation();
  
  useEffect(() => {
    const storedCollapsed = localStorage.getItem('sidebarCollapsed');
    if (storedCollapsed !== null) {
      setSidebarCollapsed(storedCollapsed === 'true');
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('sidebarCollapsed', sidebarCollapsed.toString());
  }, [sidebarCollapsed]);
  
  const toggleSidebar = () => {
    setSidebarCollapsed(prev => !prev);
  };

  const content = children || <Outlet />;

  // Mobile layout
  if (isMobile) {
    return (
      <div className="flex min-h-screen bg-background compact-layout compact-ui">
        <div className="fixed inset-0 z-20 bg-black/60 lg:hidden" 
          style={{ display: !sidebarCollapsed ? 'block' : 'none' }}
          onClick={toggleSidebar}
        />
        
        <div className={cn(
          "fixed inset-y-0 left-0 z-30 transition-transform duration-300 ease-in-out transform",
          sidebarCollapsed ? "-translate-x-full" : "translate-x-0"
        )}>
          <MainSidebar
            collapsed={false}
            toggleCollapse={toggleSidebar}
            interface={userInterface}
          />
        </div>
        
        {sidebarCollapsed && (
          <div className="fixed top-4 left-4 z-40">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleSidebar}
              className="bg-background shadow-md border border-border"
              aria-label="Open sidebar"
            >
              <PanelLeft className="h-5 w-5" />
            </Button>
          </div>
        )}
        
        <div className="flex-1 flex flex-col w-full">
          <Header toggleSidebar={toggleSidebar} interface={userInterface} />
          
          <main className="flex-1 overflow-auto p-2">
            {content}
          </main>
          
          <footer className="p-2 border-t border-border text-center text-xs text-muted-foreground bg-card/50">
            <T text="© 2025 Ge'ez Restaurant. All rights reserved." />
          </footer>
        </div>
      </div>
    );
  }

  // Desktop layout
  return (
    <div className="flex min-h-screen bg-background compact-layout compact-ui">
      <div className={cn(
        "transition-all duration-300 ease-in-out",
        sidebarCollapsed ? "w-0" : "w-64 flex-shrink-0"
      )}>
        <div className={cn(
          "fixed top-0 left-0 h-screen z-30",
          sidebarCollapsed ? "w-auto" : "w-64"
        )}>
          <MainSidebar
            collapsed={sidebarCollapsed}
            toggleCollapse={toggleSidebar}
            interface={userInterface}
          />
        </div>
      </div>
      
      {sidebarCollapsed && (
        <div className="fixed top-4 left-4 z-40">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            className="bg-background shadow-md border border-border"
            aria-label="Open sidebar"
          >
            <PanelLeft className="h-5 w-5" />
          </Button>
        </div>
      )}
      
      <div className="flex-1 flex flex-col w-full transition-all duration-300 ease-in-out">
        <Header toggleSidebar={toggleSidebar} interface={userInterface} />
        
        <main className="flex-1 overflow-auto p-3">  
          {content}
        </main>
        
        <footer className="p-2 border-t border-border text-center text-xs text-muted-foreground bg-card/50">
          <T text="© 2025 Ge'ez Restaurant. All rights reserved." />
        </footer>
      </div>
    </div>
  );
};

export default Layout;
