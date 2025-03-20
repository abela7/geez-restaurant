
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
  // Set default sidebar state to closed on initial load for mobile and open for desktop
  const isMobile = useIsMobile();
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);
  const location = useLocation();
  
  useEffect(() => {
    // Close sidebar on mobile when location changes
    if (isMobile) {
      setSidebarOpen(false);
    }
  }, [location, isMobile]);
  
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
  
  // Calculate sidebar width based on state
  const sidebarWidth = sidebarOpen ? "w-64" : "w-16";

  return (
    <div className="flex min-h-screen bg-background">
      {/* Overlay for mobile sidebar */}
      {sidebarOpen && isMobile && (
        <div
          className="fixed inset-0 z-20 bg-black/60 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      
      {/* Sidebar - fixed position for desktop */}
      <div 
        className={cn(
          "fixed left-0 top-0 h-screen z-30",
          sidebarWidth,
          "transition-all duration-300 ease-in-out",
          isMobile && !sidebarOpen ? "-translate-x-full" : "translate-x-0"
        )}
      >
        <MainSidebar open={sidebarOpen} onToggle={toggleSidebar} interface={userInterface} />
      </div>
      
      {/* Main content - adjusted with padding to account for fixed sidebar */}
      <div className={cn(
        "flex-1 flex flex-col w-full",
        sidebarOpen ? "md:ml-64" : "md:ml-16", // Adjust margin based on sidebar width
        "transition-all duration-300" // Smooth transition for the margin
      )}>
        <div className="sticky top-0 z-10 bg-background border-b border-border">
          <div className="flex items-center h-16 px-4">
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
