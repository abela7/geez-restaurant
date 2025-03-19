import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import ThemeSwitcher from './ThemeSwitcher';
import LanguageSwitcher from './LanguageSwitcher';
import { cn } from '@/lib/utils';
import { useLanguage, T } from '@/contexts/LanguageContext';
import { useIsMobile } from '@/hooks/use-mobile';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
  ChevronDown, User, LogOut, Search, Bell, Store,
  Menu as MenuIcon, X
} from 'lucide-react';
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
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { t } = useLanguage();
  const location = useLocation();
  const isMobile = useIsMobile();
  
  // Auto-close sidebar on mobile when navigating
  useEffect(() => {
    if (isMobile) {
      setSidebarOpen(false);
    }
  }, [location.pathname, isMobile]);

  // Helper function to generate breadcrumbs from the current location
  const getBreadcrumbs = () => {
    const paths = location.pathname.split('/').filter(path => path);
    
    // Return just a home breadcrumb for the root path
    if (paths.length === 0) {
      return [{ label: 'Dashboard', path: '/' }];
    }
    
    // Build the breadcrumb items
    const breadcrumbs = [{ label: 'Dashboard', path: '/' }];
    
    let currentPath = '';
    paths.forEach((path) => {
      currentPath += `/${path}`;
      // Format the label (capitalize first letter, replace hyphens with spaces)
      const label = path
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
      
      breadcrumbs.push({ label, path: currentPath });
    });
    
    return breadcrumbs;
  };
  
  const breadcrumbs = getBreadcrumbs();

  // Interface selector for demo purposes
  const interfaces = [
    { value: 'admin', label: 'Administrative Portal', path: '/' },
    { value: 'waiter', label: 'Waiter Interface', path: '/waiter' },
    { value: 'kitchen', label: 'Kitchen Staff Interface', path: '/kitchen' },
    { value: 'customer', label: 'Customer Interface', path: '/menu' },
    { value: 'system', label: 'System Administration', path: '/system' },
  ];

  const currentInterface = interfaces.find(i => i.value === userInterface) || interfaces[0];

  return (
    <div className="flex min-h-screen relative bg-background">
      {/* Mobile overlay - Only visible on mobile when sidebar is open */}
      {isMobile && (
        <div
          className={cn(
            "fixed inset-0 z-40 bg-background/80 md:hidden transition-opacity duration-300",
            sidebarOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
          )}
          onClick={() => setSidebarOpen(false)}
        />
      )}
      
      {/* Sidebar - hidden by default but can be toggled */}
      <div className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 bg-sidebar text-sidebar-foreground transition-transform duration-300 transform border-r border-sidebar-border",
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <Sidebar open={true} onToggle={() => setSidebarOpen(!sidebarOpen)} interface={userInterface} />
      </div>
      
      <div className="flex-1 flex flex-col">
        <header className="h-16 flex items-center justify-between px-4 md:px-6 border-b border-border shadow-sm bg-background sticky top-0 z-30">
          <div className="flex items-center gap-2">
            <Button 
              onClick={() => setSidebarOpen(!sidebarOpen)} 
              variant="ghost"
              size="icon"
              className="mr-2"
              aria-label={t("Toggle sidebar")}
            >
              {sidebarOpen ? <X size={20} /> : <MenuIcon size={20} />}
            </Button>
            
            {/* Interface Selector - Only for demo */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2">
                  <span className="hidden md:inline"><T text={currentInterface.label} /></span>
                  <span className="md:hidden inline"><T text="Interface" /></span>
                  <ChevronDown size={16} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {interfaces.map((item) => (
                  <DropdownMenuItem key={item.value} asChild>
                    <Link to={item.path} className={cn(
                      "cursor-pointer",
                      location.pathname === item.path && "bg-accent"
                    )}>
                      <T text={item.label} />
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          
          <div className="flex items-center space-x-1 md:space-x-4">
            <Button variant="ghost" size="icon" className="hidden md:flex">
              <Search size={20} />
            </Button>
            
            <Button variant="ghost" size="icon" className="hidden md:flex relative">
              <Bell size={20} />
              <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-red-500"></span>
            </Button>
            
            <Button variant="outline" size="sm" className="hidden md:flex items-center">
              <Store size={16} className="mr-2" />
              <T text="Open" />
            </Button>
            
            <LanguageSwitcher />
            <ThemeSwitcher />
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <div className="rounded-full bg-primary text-primary-foreground flex items-center justify-center h-8 w-8">
                    <span className="font-bold">A</span>
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem className="cursor-pointer">
                  <User className="mr-2 h-4 w-4" />
                  <span><T text="Profile" /></span>
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span><T text="Logout" /></span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>
        
        {/* Breadcrumbs - shown only on non-dashboard pages */}
        {location.pathname !== '/' && (
          <div className="px-4 md:px-6 py-2 border-b border-border bg-background/50">
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
        
        <footer className="p-4 border-t border-border text-center text-sm text-muted-foreground">
          <p><T text="© 2023" /></p>
        </footer>
      </div>
    </div>
  );
};

export default Layout;
