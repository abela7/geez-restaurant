
import React from 'react';
import ThemeSwitcher from './ThemeSwitcher';
import LanguageSwitcher from './LanguageSwitcher';
import { Button } from './ui/button';
import { Bell, Search, User } from 'lucide-react';
import { Input } from './ui/input';
import { useLanguage, T } from '@/contexts/LanguageContext';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface HeaderProps {
  toggleSidebar: () => void;
  interface?: 'admin' | 'waiter' | 'kitchen' | 'customer' | 'system';
}

const Header: React.FC<HeaderProps> = ({ 
  toggleSidebar, 
  interface: userInterface = 'admin' 
}) => {
  const { t } = useLanguage();
  
  return (
    <header className="border-b border-border bg-background z-10 px-4 md:px-6 h-16 flex items-center">
      <div className="flex items-center w-full">
        <div className="flex-1"></div>
        
        <div className="flex items-center space-x-2 md:space-x-4">
          <div className="relative hidden md:flex">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder={t("Search...")}
              className="w-80 pl-10 rounded-full bg-muted/50"
            />
          </div>
          
          <Button variant="ghost" size="icon" className="size-9 relative">
            <Bell className="size-5" />
            <span className="sr-only">{t("Notifications")}</span>
            <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-amber-500 text-[10px] font-medium text-white">
              2
            </span>
          </Button>

          <ThemeSwitcher />
          <LanguageSwitcher />
          
          <Button variant="ghost" size="icon" className="size-9 relative ml-1">
            <User className="size-5" />
            <span className="sr-only">{t("User menu")}</span>
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
