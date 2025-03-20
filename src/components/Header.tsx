
import React from 'react';
import ThemeSwitcher from './ThemeSwitcher';
import LanguageSwitcher from './LanguageSwitcher';
import { Button } from './ui/button';
import { Bell, Menu, Search, User } from 'lucide-react';
import { Input } from './ui/input';
import { cn } from '@/lib/utils';
import { useLanguage, T } from '@/contexts/LanguageContext';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface HeaderProps {
  toggleSidebar: () => void;
  interface?: 'admin' | 'waiter' | 'kitchen' | 'customer' | 'system';
}

const Header: React.FC<HeaderProps> = ({ toggleSidebar, interface: userInterface = 'admin' }) => {
  const { t } = useLanguage();
  
  return (
    <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-10">
      <div className="flex h-16 items-center px-4 md:px-6">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost" 
                size="icon"
                className="mr-4 size-9 shrink-0 border border-border hover:bg-primary hover:text-primary-foreground"
                onClick={toggleSidebar}
                aria-label={t("Toggle sidebar")}
              >
                <Menu className="size-5" />
                <span className="sr-only">{t("Toggle sidebar")}</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <T text="Open Menu" />
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        <div className="flex items-center space-x-4">
          <h2 className="text-lg font-medium">
            <T text={
              userInterface === 'admin' ? 'Admin Portal' :
              userInterface === 'waiter' ? 'Waiter Interface' :
              userInterface === 'kitchen' ? 'Kitchen Staff Interface' :
              userInterface === 'customer' ? 'Customer Interface' :
              'System Administration'
            } />
          </h2>
        </div>
        
        <div className="ml-auto flex items-center space-x-2 md:space-x-4">
          <div className="hidden md:flex relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder={t("Search...")}
              className="w-64 pl-9 rounded-full bg-muted"
            />
          </div>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="icon" className="size-9">
                  <Bell className="size-5" />
                  <span className="sr-only">{t("Notifications")}</span>
                  <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-medium text-primary-foreground">
                    2
                  </span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <T text="Notifications" />
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <ThemeSwitcher />
          <LanguageSwitcher />
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="icon" className="size-9">
                  <User className="size-5" />
                  <span className="sr-only">{t("User menu")}</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <T text="User Menu" />
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
    </header>
  );
};

export default Header;
