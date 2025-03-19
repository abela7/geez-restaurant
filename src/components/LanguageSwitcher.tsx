
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

const LanguageSwitcher: React.FC = () => {
  const { currentLanguage, setCurrentLanguage, t } = useLanguage();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <Globe className="h-5 w-5" />
          <span className="sr-only">{t("Switch language")}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem 
          onClick={() => setCurrentLanguage('en')}
          className="cursor-pointer"
        >
          <div className="flex items-center">
            <span className={currentLanguage === 'en' ? "font-bold" : ""}>English</span>
            {currentLanguage === 'en' && <span className="ml-2">✓</span>}
          </div>
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => setCurrentLanguage('am')}
          className="cursor-pointer"
        >
          <div className="flex items-center">
            <span className={currentLanguage === 'am' ? "font-bold" : ""}>አማርኛ</span>
            {currentLanguage === 'am' && <span className="ml-2">✓</span>}
          </div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageSwitcher;
