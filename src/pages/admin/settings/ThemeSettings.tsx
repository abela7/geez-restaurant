
import React, { useState } from 'react';
import { useTheme } from '@/components/ThemeProvider';
import Layout from '@/components/Layout';
import { PageHeader } from '@/components/ui/page-header';
import { useLanguage, T } from '@/contexts/LanguageContext';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';

// Import our new components
import ThemeSelectionCard from '@/components/admin/settings/theme/ThemeSelectionCard';
import SystemPreferencesCard from '@/components/admin/settings/theme/SystemPreferencesCard';
import ColorCustomizationCard from '@/components/admin/settings/theme/ColorCustomizationCard';
import AdvancedSettingsCard from '@/components/admin/settings/theme/AdvancedSettingsCard';

// Define the Theme type to match the one in ThemeProvider
type Theme = 'light' | 'dark' | 'high-contrast' | 'warm-blend';

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
            <ThemeSelectionCard 
              currentTheme={theme}
              onThemeChange={setTheme}
              onSavePreferences={saveThemePreferences}
            />
            
            <SystemPreferencesCard 
              defaultTheme={defaultTheme}
              autoSwitch={autoSwitch}
              onDefaultThemeChange={handleThemeChange}
              onAutoSwitchChange={setAutoSwitch}
            />
          </TabsContent>
          
          <TabsContent value="customization">
            <ColorCustomizationCard />
          </TabsContent>
          
          <TabsContent value="advanced">
            <AdvancedSettingsCard />
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default ThemeSettings;
