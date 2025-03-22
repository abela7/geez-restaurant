
import React from 'react';
import { useTheme } from './ThemeProvider';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Sun, Moon, Eye, Sparkles } from 'lucide-react';
import { useLanguage, T } from '@/contexts/LanguageContext';

const ThemeSwitcher: React.FC = () => {
  const { theme, setTheme } = useTheme();
  const { t } = useLanguage();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Sun className={cn(
            "h-5 w-5 rotate-0 scale-100 transition-all", 
            theme !== "light" && "opacity-0 scale-0"
          )} />
          <Moon className={cn(
            "absolute h-5 w-5 rotate-90 scale-0 transition-all", 
            theme === "dark" && "rotate-0 scale-100 opacity-100"
          )} />
          <Eye className={cn(
            "absolute h-5 w-5 rotate-90 scale-0 transition-all", 
            theme === "high-contrast" && "rotate-0 scale-100 opacity-100"
          )} />
          <Sparkles className={cn(
            "absolute h-5 w-5 rotate-90 scale-0 transition-all", 
            theme === "warm-blend" && "rotate-0 scale-100 opacity-100"
          )} />
          <span className="sr-only"><T text="Toggle theme" /></span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem 
          onClick={() => setTheme('light')}
          className={cn("cursor-pointer", theme === 'light' && "bg-accent")}
        >
          <Sun className="mr-2 h-4 w-4" />
          <span><T text="Light" /></span>
          <span className="ml-auto text-xs opacity-60">(Cream)</span>
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => setTheme('dark')}
          className={cn("cursor-pointer", theme === 'dark' && "bg-accent")}
        >
          <Moon className="mr-2 h-4 w-4" />
          <span><T text="Dark" /></span>
          <span className="ml-auto text-xs opacity-60">(Eggplant)</span>
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => setTheme('high-contrast')}
          className={cn("cursor-pointer", theme === 'high-contrast' && "bg-accent")}
        >
          <Eye className="mr-2 h-4 w-4" />
          <span><T text="High Contrast" /></span>
          <span className="ml-auto text-xs opacity-60">(White)</span>
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => setTheme('warm-blend')}
          className={cn("cursor-pointer", theme === 'warm-blend' && "bg-accent")}
        >
          <Sparkles className="mr-2 h-4 w-4" />
          <span><T text="Warm Blend" /></span>
          <span className="ml-auto text-xs opacity-60">(White & Purple)</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ThemeSwitcher;
