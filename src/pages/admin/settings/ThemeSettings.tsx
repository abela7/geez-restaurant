
import React, { useState } from 'react';
import { useTheme } from '@/components/ThemeProvider';
import Layout from '@/components/Layout';
import { PageHeader } from '@/components/ui/page-header';
import { useLanguage, T } from '@/contexts/LanguageContext';
import { 
  Card, 
  CardContent, 
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle 
} from '@/components/ui/card';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { 
  RadioGroup, 
  RadioGroupItem 
} from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { 
  Switch 
} from '@/components/ui/switch';
import { Badge } from '../../../components/ui/badge-extended';
import { 
  Sun, 
  Moon, 
  Eye, 
  Palette, 
  Check, 
  RotateCcw 
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// Define the Theme type to match the one in ThemeProvider
type Theme = 'light' | 'dark' | 'high-contrast' | 'warm-blend';

// Theme preview component
const ThemePreview = ({ 
  themeName, 
  icon: Icon, 
  isActive, 
  onClick 
}: { 
  themeName: string;
  icon: React.ElementType;
  isActive: boolean;
  onClick: () => void;
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
          text: 'text-[#4D4052]',
          border: 'border-[#CDAF56]',
          button: 'bg-[#DAA520] text-[#5D4225]'
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

const ThemeSettings = () => {
  const { theme, setTheme } = useTheme();
  const { t } = useLanguage();
  const { toast } = useToast();
  const [defaultTheme, setDefaultTheme] = useState<Theme>(theme);
  const [autoSwitch, setAutoSwitch] = useState(true);
  
  // Fixed function to handle RadioGroup value changes
  const handleThemeChange = (value: string) => {
    // Ensure value is one of our Theme types before setting
    if (value === 'light' || value === 'dark' || value === 'high-contrast' || value === 'warm-blend') {
      setDefaultTheme(value);
    }
  };
  
  // Sample function to save theme preferences to the server/database
  const saveThemePreferences = () => {
    // This would normally send the data to the server
    toast({
      title: t("Theme settings saved"),
      description: t("Your theme preferences have been saved successfully."),
      variant: "default",
    });
  };
  
  return (
    <Layout interface="admin">
      <div className="container mx-auto p-4">
        <PageHeader
          title={<T text="Theme Settings" />}
          description={<T text="Customize the appearance of your restaurant management system" />}
        />
        
        <Tabs defaultValue="themes" className="space-y-4">
          <TabsList>
            <TabsTrigger value="themes"><T text="Themes" /></TabsTrigger>
            <TabsTrigger value="customization"><T text="Customization" /></TabsTrigger>
            <TabsTrigger value="advanced"><T text="Advanced" /></TabsTrigger>
          </TabsList>
          
          <TabsContent value="themes" className="space-y-4">
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
                    isActive={theme === 'light'} 
                    onClick={() => setTheme('light')} 
                  />
                  <ThemePreview 
                    themeName="Dark" 
                    icon={Moon} 
                    isActive={theme === 'dark'} 
                    onClick={() => setTheme('dark')} 
                  />
                  <ThemePreview 
                    themeName="High Contrast" 
                    icon={Eye} 
                    isActive={theme === 'high-contrast'} 
                    onClick={() => setTheme('high-contrast')} 
                  />
                  <ThemePreview 
                    themeName="Warm Blend" 
                    icon={Palette} 
                    isActive={theme === 'warm-blend'} 
                    onClick={() => setTheme('warm-blend')} 
                  />
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={() => setTheme('light')}>
                  <RotateCcw className="mr-2 h-4 w-4" />
                  <T text="Reset to Default" />
                </Button>
                <Button onClick={saveThemePreferences}>
                  <T text="Save Preferences" />
                </Button>
              </CardFooter>
            </Card>
            
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
                    onCheckedChange={setAutoSwitch}
                  />
                </div>
                
                <div>
                  <h3 className="mb-2 text-sm font-medium">
                    <T text="Default theme" />
                  </h3>
                  <RadioGroup 
                    value={defaultTheme} 
                    onValueChange={handleThemeChange}
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
                      <Label htmlFor="warm-blend"><T text="Warm Blend" /></Label>
                    </div>
                  </RadioGroup>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="customization">
            <Card>
              <CardHeader>
                <CardTitle><T text="Color Customization" /></CardTitle>
                <CardDescription>
                  <T text="Fine-tune the color scheme used in your application" />
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6">
                  <div>
                    <h3 className="mb-2 text-sm font-medium">
                      <T text="Color Palette Preview" />
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="turmeric" className="border-none">Turmeric</Badge>
                      <Badge variant="sand" className="border-none">Sand</Badge>
                      <Badge variant="coffee" className="border-none">Coffee</Badge>
                      <Badge variant="plum" className="border-none">Plum</Badge>
                      <Badge variant="default" className="border-none">Default</Badge>
                      <Badge variant="secondary" className="border-none">Secondary</Badge>
                      <Badge variant="destructive" className="border-none">Destructive</Badge>
                    </div>
                  </div>
                  
                  {/* This would be expanded in a real implementation with color pickers and more options */}
                  <p className="text-sm text-muted-foreground">
                    <T text="Additional color customization options will be available in a future update." />
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="advanced">
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
                      checked={true}
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
                      checked={true}
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
                      checked={false}
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
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default ThemeSettings;
