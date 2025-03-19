
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import ThemeSwitcher from './ThemeSwitcher';
import LanguageSwitcher from './LanguageSwitcher';
import { cn } from '@/lib/utils';
import { useLanguage, T } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
  ChevronDown, User, LogOut, Search, Bell, Store,
  Menu as MenuIcon
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
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { t } = useLanguage();
  const location = useLocation();

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
    paths.forEach((path, index) => {
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
    <div className="flex min-h-screen relative bg-cream">
      <Sidebar open={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} interface={userInterface} />
      
      <div className={cn(
        "flex-1 transition-all duration-300 ease-in-out",
        sidebarOpen ? "md:ml-64 ml-0" : "md:ml-16 ml-0"
      )}>
        <header className="h-16 flex items-center justify-between px-6 border-b border-sand shadow-sm bg-cream">
          <div className="flex items-center">
            <button 
              onClick={() => setSidebarOpen(!sidebarOpen)} 
              className="mr-4 p-2 rounded-md hover:bg-accent md:flex hidden"
              aria-label={t("Toggle sidebar")}
            >
              <MenuIcon size={20} />
            </button>
            
            <div className="md:block hidden">
              <h1 className="text-xl font-semibold text-plum"><T text="Habesha Restaurant Manager" /></h1>
            </div>

            {/* Interface Selector - Only for demo */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild className="md:ml-4 ml-0">
                <Button variant="outline" className="flex items-center gap-2">
                  <span className="md:block hidden"><T text={currentInterface.label} /></span>
                  <span className="md:hidden block"><T text="Interface" /></span>
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
          
          <div className="flex items-center space-x-2 md:space-x-4">
            <Button variant="ghost" size="icon" className="hidden md:flex">
              <Search size={20} />
            </Button>
            
            <Button variant="ghost" size="icon" className="hidden md:flex">
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
                  <div className="rounded-full bg-turmeric text-eggplant flex items-center justify-center h-8 w-8">
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
          <div className="px-6 py-2 border-b border-sand bg-cream/50">
            <Breadcrumb>
              <BreadcrumbList>
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
        
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
