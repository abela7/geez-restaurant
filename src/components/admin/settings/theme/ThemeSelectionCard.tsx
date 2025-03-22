
import React from 'react';
import { useLanguage, T } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { 
  Card, 
  CardContent, 
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle 
} from '@/components/ui/card';
import { Sun, Moon, Eye, Sparkles, RotateCcw } from 'lucide-react';
import ThemePreview from './ThemePreview';

interface ThemeSelectionCardProps {
  currentTheme: string;
  onThemeChange: (theme: string) => void;
  onSavePreferences: () => void;
}

const ThemeSelectionCard: React.FC<ThemeSelectionCardProps> = ({
  currentTheme,
  onThemeChange,
  onSavePreferences
}) => {
  const { t } = useLanguage();
  
  return (
    <Card>
      <CardHeader>
        <CardTitle><T text="Theme Selection" /></CardTitle>
        <CardDescription>
          <T text="Choose a theme that matches your restaurant's style" />
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <ThemePreview 
            themeName="Light" 
            icon={Sun} 
            isActive={currentTheme === 'light'} 
            onClick={() => onThemeChange('light')} 
          />
          <ThemePreview 
            themeName="Dark" 
            icon={Moon} 
            isActive={currentTheme === 'dark'} 
            onClick={() => onThemeChange('dark')} 
          />
          <ThemePreview 
            themeName="High Contrast" 
            icon={Eye} 
            isActive={currentTheme === 'high-contrast'} 
            onClick={() => onThemeChange('high-contrast')} 
          />
          <ThemePreview 
            themeName="Warm Blend" 
            icon={Sparkles} 
            isActive={currentTheme === 'warm-blend'} 
            onClick={() => onThemeChange('warm-blend')} 
          />
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={() => onThemeChange('light')}>
          <RotateCcw className="mr-2 h-4 w-4" />
          <T text="Reset to Default" />
        </Button>
        <Button onClick={onSavePreferences}>
          <T text="Save Preferences" />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ThemeSelectionCard;
