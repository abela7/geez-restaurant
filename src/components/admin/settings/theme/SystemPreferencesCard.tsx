
import React from 'react';
import { useLanguage, T } from '@/contexts/LanguageContext';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { 
  RadioGroup, 
  RadioGroupItem 
} from '@/components/ui/radio-group';
import { 
  Card, 
  CardContent, 
  CardDescription,
  CardHeader,
  CardTitle 
} from '@/components/ui/card';

// Define the Theme type to match the one in ThemeProvider
type Theme = 'light' | 'dark' | 'high-contrast' | 'warm-blend';

interface SystemPreferencesCardProps {
  defaultTheme: Theme;
  autoSwitch: boolean;
  onDefaultThemeChange: (value: string) => void;
  onAutoSwitchChange: (checked: boolean) => void;
}

const SystemPreferencesCard: React.FC<SystemPreferencesCardProps> = ({
  defaultTheme,
  autoSwitch,
  onDefaultThemeChange,
  onAutoSwitchChange
}) => {
  const { t } = useLanguage();
  
  return (
    <Card>
      <CardHeader>
        <CardTitle><T text="System Preferences" /></CardTitle>
        <CardDescription>
          <T text="Set default behavior for theme switching" />
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between space-x-2">
          <Label htmlFor="auto-switch" className="flex flex-col space-y-1">
            <span><T text="Follow system theme" /></span>
            <span className="font-normal text-xs text-muted-foreground">
              <T text="Automatically switch between light and dark themes based on system preferences" />
            </span>
          </Label>
          <Switch
            id="auto-switch"
            checked={autoSwitch}
            onCheckedChange={onAutoSwitchChange}
          />
        </div>
        
        <div>
          <h3 className="mb-2 text-sm font-medium">
            <T text="Default theme" />
          </h3>
          <RadioGroup 
            value={defaultTheme} 
            onValueChange={onDefaultThemeChange}
            className="flex flex-col space-y-2"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="light" id="light" />
              <Label htmlFor="light"><T text="Light" /></Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="dark" id="dark" />
              <Label htmlFor="dark"><T text="Dark" /></Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="high-contrast" id="high-contrast" />
              <Label htmlFor="high-contrast"><T text="High Contrast" /></Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="warm-blend" id="warm-blend" />
              <Label htmlFor="warm-blend"><T text="Modern Glass" /></Label>
            </div>
          </RadioGroup>
        </div>
      </CardContent>
    </Card>
  );
};

export default SystemPreferencesCard;
