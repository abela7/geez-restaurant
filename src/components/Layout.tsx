
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
import { ChevronDown, User, LogOut } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  interface?: 'admin' | 'waiter' | 'kitchen' | 'customer' | 'system';
}

const Layout: React.FC<LayoutProps> = ({ children, interface: userInterface = 'admin' }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { t } = useLanguage();
  const location = useLocation();

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
    <div className="flex min-h-screen relative">
      <Sidebar open={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} interface={userInterface} />
      
      <div className={cn(
        "flex-1 transition-all duration-300 ease-in-out",
        sidebarOpen ? "md:ml-64 ml-0" : "md:ml-16 ml-0"
      )}>
        <header className="h-16 flex items-center justify-between px-6 border-b">
          <div className="flex items-center">
            <button 
              onClick={() => setSidebarOpen(!sidebarOpen)} 
              className="mr-4 p-2 rounded-md hover:bg-accent md:flex hidden"
              aria-label={t("Toggle sidebar")}
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="24" 
                height="24" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              >
                {sidebarOpen ? (
                  <>
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </>
                ) : (
                  <>
                    <line x1="3" y1="12" x2="21" y2="12"></line>
                    <line x1="3" y1="6" x2="21" y2="6"></line>
                    <line x1="3" y1="18" x2="21" y2="18"></line>
                  </>
                )}
              </svg>
            </button>
            
            <div className="md:block hidden">
              <h1 className="text-xl font-semibold"><T text="Habesha Restaurant Manager" /></h1>
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
          
          <div className="flex items-center space-x-4">
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
        
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
