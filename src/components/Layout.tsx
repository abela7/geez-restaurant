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

  if (contentOnly) {
    return <div className="compact-layout compact-ui">{children}</div>;
  }

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
            collapsed={sidebarCollapsed}
            toggleCollapse={toggleSidebar}
            interface={userInterface}
          />
        </div>
        
        <div className="flex-1 flex flex-col w-full">
          <Header toggleSidebar={toggleSidebar} interface={userInterface} />
          
          <main className="flex-1 overflow-auto p-2">
            {!contentOnly && (
              <div className="mb-2">
                <Breadcrumb>
                  <BreadcrumbList className="text-xs">
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
            )}
            
            {children}
          </main>
          
          <footer className="p-2 border-t border-border text-center text-xs text-muted-foreground bg-card/50">
            <T text="© 2025 Ge'ez Restaurant. All rights reserved." />
          </footer>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-background compact-layout compact-ui">
      <div className={cn(
        "transition-all duration-300 ease-in-out",
        sidebarCollapsed ? "w-0" : "w-64 flex-shrink-0"
      )}>
        <div className={cn(
          "fixed top-0 left-0 h-screen",
          sidebarCollapsed ? "w-auto" : "w-64"
        )}>
          <MainSidebar
            collapsed={sidebarCollapsed}
            toggleCollapse={toggleSidebar}
            interface={userInterface}
          />
        </div>
      </div>
      
      <div className="flex-1 flex flex-col w-full transition-all duration-300 ease-in-out">
        <Header toggleSidebar={toggleSidebar} interface={userInterface} />
        
        <main className="flex-1 overflow-auto p-3">
          {!contentOnly && (
            <div className="mb-3">
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
          )}
          
          {children}
        </main>
        
        <footer className="p-2 border-t border-border text-center text-xs text-muted-foreground bg-card/50">
          <T text="© 2025 Ge'ez Restaurant. All rights reserved." />
        </footer>
      </div>
    </div>
  );
};

export default Layout;
