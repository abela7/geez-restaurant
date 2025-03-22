
import React from 'react';
import { useLanguage, T } from '@/contexts/LanguageContext';
import { Check } from 'lucide-react';

interface ThemePreviewProps {
  themeName: string;
  icon: React.ElementType;
  isActive: boolean;
  onClick: () => void;
}

const ThemePreview: React.FC<ThemePreviewProps> = ({ 
  themeName, 
  icon: Icon, 
  isActive, 
  onClick 
}) => {
  const { t } = useLanguage();
  
  // Generate theme-specific class names for the preview card
  const getThemeClasses = () => {
    switch(themeName.toLowerCase()) {
      case 'light':
        return {
          bg: 'bg-[#F1ECE2]',
          text: 'text-[#4D4052]',
          border: 'border-[#CDAF56]',
          button: 'bg-[#DAA520] text-[#301934]'
        };
      case 'dark':
        return {
          bg: 'bg-[#301934]',
          text: 'text-[#F1ECE2]',
          border: 'border-[#4D4052]',
          button: 'bg-[#DAA520] text-[#F1ECE2]'
        };
      case 'high contrast':
        return {
          bg: 'bg-white',
          text: 'text-[#301934]',
          border: 'border-[#301934] border-2',
          button: 'bg-[#DAA520] text-[#301934]'
        };
      case 'warm blend':
        return {
          bg: 'bg-white',
          text: 'text-[#33394A]',
          border: 'border-[#dee7f2]',
          button: 'bg-[#7c5cef] text-white'
        };
      default:
        return {
          bg: 'bg-background',
          text: 'text-foreground',
          border: 'border-border',
          button: 'bg-primary text-primary-foreground'
        };
    }
  };
  
  const classes = getThemeClasses();
  
  return (
    <div 
      className={`relative rounded-lg border-2 ${isActive ? 'border-primary' : 'border-transparent'} cursor-pointer`}
      onClick={onClick}
    >
      {isActive && (
        <div className="absolute -top-2 -right-2 z-10 rounded-full bg-primary p-1">
          <Check className="h-4 w-4 text-white" />
        </div>
      )}
      
      <div className={`p-3 rounded-lg ${classes.bg} ${classes.text} ${classes.border}`}>
        <div className="mb-2 flex items-center gap-2">
          <Icon className="h-4 w-4" />
          <span className="font-semibold">{t(themeName)}</span>
        </div>
        <p className="text-xs mb-2">
          <T text="Sample text" />
        </p>
        <div className={`text-center py-1 px-2 rounded text-xs ${classes.button}`}>
          <T text="Button" />
        </div>
      </div>
    </div>
  );
};

export default ThemePreview;
