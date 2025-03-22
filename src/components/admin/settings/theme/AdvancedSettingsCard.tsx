
import React from 'react';
import { useLanguage, T } from '@/contexts/LanguageContext';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { 
  Card, 
  CardContent, 
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle 
} from '@/components/ui/card';

const AdvancedSettingsCard: React.FC = () => {
  const { t } = useLanguage();
  
  // In a real implementation, these would be connected to state and actual functionality
  const animations = true;
  const reducedMotion = true;
  const persistentTheme = false;
  
  return (
    <Card>
      <CardHeader>
        <CardTitle><T text="Advanced Settings" /></CardTitle>
        <CardDescription>
          <T text="Configure advanced theme behavior" />
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between space-x-2">
            <Label htmlFor="animations" className="flex flex-col space-y-1">
              <span><T text="Enable animations" /></span>
              <span className="font-normal text-xs text-muted-foreground">
                <T text="Show animated transitions throughout the application" />
              </span>
            </Label>
            <Switch
              id="animations"
              checked={animations}
            />
          </div>
          
          <div className="flex items-center justify-between space-x-2">
            <Label htmlFor="reduced-motion" className="flex flex-col space-y-1">
              <span><T text="Reduce motion" /></span>
              <span className="font-normal text-xs text-muted-foreground">
                <T text="Honor the system's reduced motion setting" />
              </span>
            </Label>
            <Switch
              id="reduced-motion"
              checked={reducedMotion}
            />
          </div>
          
          <div className="flex items-center justify-between space-x-2">
            <Label htmlFor="persistent-theme" className="flex flex-col space-y-1">
              <span><T text="Save theme per device" /></span>
              <span className="font-normal text-xs text-muted-foreground">
                <T text="Use different themes on different devices" />
              </span>
            </Label>
            <Switch
              id="persistent-theme"
              checked={persistentTheme}
            />
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="outline" className="w-full">
          <T text="Reset All Settings" />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default AdvancedSettingsCard;
