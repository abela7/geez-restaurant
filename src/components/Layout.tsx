
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { MainSidebar } from './MainSidebar';
import { cn } from '@/lib/utils';
import { useLanguage, T } from '@/contexts/LanguageContext';
import { useIsMobile } from '@/hooks/use-mobile';
import Header from './Header';
import { Menu } from 'lucide-react'; 
import { Button } from './ui/button';

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
  // Set default sidebar state to closed on initial load
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const isMobile = useIsMobile();
  
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
      {/* Overlay for mobile sidebar */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/60 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      
      {/* Sidebar */}
      <div 
        className={cn(
          "fixed top-0 left-0 h-screen z-30 w-64",
          "transition-transform duration-300 ease-in-out",
          sidebarOpen ? "translate-x-0" : "-translate-x-full",
          "md:relative md:translate-x-0",
          !sidebarOpen && "md:hidden"
        )}
      >
        <MainSidebar open={sidebarOpen} onToggle={toggleSidebar} interface={userInterface} />
      </div>
      
      {/* Main content */}
      <div className="flex-1 flex flex-col w-full">
        <div className="sticky top-0 z-10 bg-background border-b border-border">
          <div className="flex items-center h-16 px-4">
            <Button
              variant="ghost"
              size="icon"
              className="mr-4"
              onClick={toggleSidebar}
            >
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
            <div className="flex-1">
              <Header toggleSidebar={toggleSidebar} interface={userInterface} />
            </div>
          </div>
        </div>
        
        {location.pathname !== '/' && (
          <div className="px-4 md:px-6 py-2 bg-background/50 border-b border-border/50">
            <Breadcrumb>
              <BreadcrumbList className="flex-wrap">
                {breadcrumbs.map((crumb, index) => (
                  <React.Fragment key={crumb.path}>
                    {index > 0 && <BreadcrumbSeparator />}
                    <BreadcrumbItem>
                      {index === breadcrumbs.length - 1 ? (
                        <BreadcrumbPage><T text={crumb.label} /></BreadcrumbPage>
                      ) : (
                        <BreadcrumbLink asChild>
                          <Link to={crumb.path}><T text={crumb.label} /></Link>
                        </BreadcrumbLink>
                      )}
                    </BreadcrumbItem>
                  </React.Fragment>
                ))}
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        )}
        
        <main className="flex-1 p-4 md:p-6 overflow-auto">
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
