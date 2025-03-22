
import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Globe } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useIsMobile } from '@/hooks/use-mobile';

const LanguageSwitcher: React.FC = () => {
  const { currentLanguage, setCurrentLanguage, t } = useLanguage();
  const isMobile = useIsMobile();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant={currentLanguage === 'am' ? "default" : "outline"} 
          size={isMobile ? "sm" : "default"} 
          className="relative language-switcher px-3"
        >
          <Globe className="h-[18px] w-[18px] mr-2" />
          <span className="font-medium">{currentLanguage === 'en' ? 'English' : 'አማርኛ'}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[120px]">
        <DropdownMenuItem 
          onClick={() => setCurrentLanguage('en')}
          className="cursor-pointer"
        >
          <div className="flex items-center w-full justify-between">
            <span className={currentLanguage === 'en' ? "font-bold" : ""}>English</span>
            {currentLanguage === 'en' && <span className="ml-2">✓</span>}
          </div>
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => setCurrentLanguage('am')}
          className="cursor-pointer"
        >
          <div className="flex items-center w-full justify-between">
            <span className={currentLanguage === 'am' ? "font-bold" : ""}>አማርኛ</span>
            {currentLanguage === 'am' && <span className="ml-2">✓</span>}
          </div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageSwitcher;
