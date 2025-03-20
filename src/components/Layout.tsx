
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
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    // Get initial collapsed state from localStorage, default to false (expanded)
    const storedState = localStorage.getItem('sidebarCollapsed');
    return storedState ? JSON.parse(storedState) : false;
  });
  const isMobile = useIsMobile();
  const location = useLocation();
  
  // Mobile sidebar visibility (separate from collapse state)
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  
  useEffect(() => {
    // Close mobile sidebar when location changes
    if (isMobile) {
      setMobileSidebarOpen(false);
    }
  }, [location, isMobile]);
  
  // When sidebar collapse state changes, save to localStorage
  useEffect(() => {
    localStorage.setItem('sidebarCollapsed', JSON.stringify(sidebarCollapsed));
  }, [sidebarCollapsed]);
  
  const toggleSidebar = () => {
    if (isMobile) {
      setMobileSidebarOpen(prev => !prev);
    } else {
      setSidebarCollapsed(prev => !prev);
    }
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
  
  // Calculate sidebar width based on collapsed state
  const sidebarWidth = sidebarCollapsed ? '64px' : '256px'; // 4rem or 16rem

  return (
    <div className="flex min-h-screen bg-background">
      {/* Overlay for mobile sidebar */}
      {isMobile && mobileSidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/60"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}
      
      {/* Sidebar - fixed position for mobile, static for desktop */}
      <div 
        className={cn(
          "h-screen z-30 transition-all duration-300 ease-in-out", 
          isMobile 
            ? "fixed left-0 top-0" 
            : "relative",
          isMobile && !mobileSidebarOpen && "-translate-x-full"
        )}
        style={{ width: sidebarWidth }}
      >
        <MainSidebar 
          collapsed={sidebarCollapsed} 
          setCollapsed={setSidebarCollapsed} 
          interface={userInterface} 
        />
      </div>
      
      {/* Main content - adjust margin based on sidebar state */}
      <div 
        className="flex-1 flex flex-col w-full transition-all duration-300 ease-in-out"
        style={{ 
          marginLeft: isMobile ? 0 : sidebarWidth 
        }}
      >
        <Header toggleSidebar={toggleSidebar} interface={userInterface} />
        
        <main className="flex-1 overflow-auto p-4 md:p-6">
          {/* Breadcrumbs */}
          <div className="mb-4">
            <Breadcrumb>
              <BreadcrumbList>
                {breadcrumbs.map((crumb, index) => (
                  <React.Fragment key={crumb.path}>
                    {index < breadcrumbs.length - 1 ? (
                      <>
                        <BreadcrumbItem>
                          <BreadcrumbLink asChild>
                            <Link to={crumb.path}>
                              <T text={crumb.label} />
                            </Link>
                          </BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                      </>
                    ) : (
                      <BreadcrumbItem>
                        <BreadcrumbPage>
                          <T text={crumb.label} />
                        </BreadcrumbPage>
                      </BreadcrumbItem>
                    )}
                  </React.Fragment>
                ))}
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          
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
