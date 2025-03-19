
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
  Menu as MenuIcon
} from 'lucide-react';
import ThemeSwitcher from './ThemeSwitcher';
import LanguageSwitcher from './LanguageSwitcher';
import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

interface HeaderProps {
  toggleSidebar: () => void;
  interface?: 'admin' | 'waiter' | 'kitchen' | 'customer' | 'system';
}

const Header: React.FC<HeaderProps> = ({ toggleSidebar, interface: userInterface = 'admin' }) => {
  const { t } = useLanguage();
  const isMobile = useIsMobile();
  const navigate = useNavigate();

  const interfaces = [
    { value: 'admin', label: 'Administrative Portal', path: '/' },
    { value: 'waiter', label: 'Waiter Interface', path: '/waiter' },
    { value: 'kitchen', label: 'Kitchen Staff Interface', path: '/kitchen' },
    { value: 'customer', label: 'Customer Interface', path: '/menu' },
    { value: 'system', label: 'System Administration', path: '/system' },
  ];

  const currentInterface = interfaces.find(i => i.value === userInterface) || interfaces[0];
  
  return (
    <header className="h-16 flex items-center justify-between px-4 md:px-6 border-b border-border bg-card sticky top-0 z-30 shadow-sm">
      <div className="flex items-center gap-2">
        <Button 
          onClick={toggleSidebar} 
          variant="ghost"
          size="icon"
          className="text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          aria-label={t("Toggle sidebar")}
        >
          <MenuIcon size={20} />
        </Button>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="flex items-center gap-1 h-9 px-3 font-medium bg-card hover:bg-muted hover:text-foreground transition-colors border border-input shadow-sm">
              <span className="hidden md:inline text-foreground"><T text={currentInterface.label} /></span>
              <span className="md:hidden inline"><T text="Interface" /></span>
              <ChevronDown size={14} className="text-muted-foreground ml-1" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-56">
            {interfaces.map((item) => (
              <DropdownMenuItem key={item.value} asChild>
                <Link to={item.path} className={cn(
                  "cursor-pointer flex items-center",
                  item.value === userInterface && "bg-primary/10 text-primary font-medium"
                )}>
                  <T text={item.label} />
                </Link>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      
      <div className="flex items-center gap-1 md:gap-3">
        <Button variant="ghost" size="icon" className="hidden md:flex text-muted-foreground hover:text-foreground">
          <Search size={18} />
        </Button>
        
        <Button variant="ghost" size="icon" className="relative text-muted-foreground hover:text-foreground">
          <Bell size={18} />
          <Badge variant="destructive" className="h-2 w-2 p-0 absolute top-2 right-2" />
        </Button>
        
        <Button variant="outline" size="sm" className="hidden md:flex items-center h-8 px-3 border-amber-500/50 bg-amber-50 text-amber-700 hover:bg-amber-100 dark:bg-amber-950/30 dark:text-amber-400 dark:hover:bg-amber-950/50">
          <Store size={14} className="mr-1.5" />
          <T text="Open" />
        </Button>
        
        <div className="flex items-center gap-1 md:gap-2">
          <LanguageSwitcher />
          <ThemeSwitcher />
        </div>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 w-8 rounded-full p-0 overflow-hidden border border-border hover:bg-muted">
              <Avatar className="h-8 w-8">
                <div className="flex items-center justify-center h-full w-full bg-primary text-primary-foreground text-sm font-semibold">
                  A
                </div>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <div className="p-2 border-b">
              <p className="font-medium">Abebe Kebede</p>
              <p className="text-sm text-muted-foreground">admin@habesha.com</p>
            </div>
            <DropdownMenuItem className="cursor-pointer mt-1">
              <User className="mr-2 h-4 w-4" />
              <span><T text="Profile" /></span>
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer" onClick={() => navigate('/login')}>
              <LogOut className="mr-2 h-4 w-4" />
              <span><T text="Logout" /></span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default Header;
