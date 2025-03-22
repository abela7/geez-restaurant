
import React from 'react';
import { useLanguage, T } from '@/contexts/LanguageContext';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

const LanguageManagement: React.FC = () => {
  const { t } = useLanguage();

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            <T text="Language Management" />
          </h1>
          <p className="text-muted-foreground">
            <T text="Manage translations for the Habesha Restaurant System" />
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <T text="Export" />
          </Button>
          <Button>
            <T text="Save to Database" />
          </Button>
        </div>
      </div>

      <Tabs defaultValue="translations">
        <TabsList>
          <TabsTrigger value="translations">
            <T text="Translations" />
          </TabsTrigger>
          <TabsTrigger value="add_new">
            <T text="Add New" />
          </TabsTrigger>
          <TabsTrigger value="settings">
            <T text="Settings" />
          </TabsTrigger>
        </TabsList>

        <TabsContent value="translations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>
                <T text="UI Text Translations" />
              </CardTitle>
              <CardDescription>
                <T text="Manage translations for all UI elements" />
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex w-full max-w-sm items-center space-x-2 mb-4">
                <Input 
                  type="search" 
                  placeholder={t("Search translations...")} 
                  className="w-full"
                />
                <Button type="submit" size="icon">
                  <Search className="h-4 w-4" />
                </Button>
              </div>

              <div className="rounded-md border">
                <div className="grid grid-cols-3 p-4 bg-muted/50">
                  <div><T text="Key" /></div>
                  <div><T text="English" /></div>
                  <div><T text="Amharic" /></div>
                </div>
                
                <div className="divide-y">
                  <div className="grid grid-cols-3 p-4">
                    <div>Dashboard</div>
                    <div>Dashboard</div>
                    <div>
                      <Input 
                        value="ዳሽቦርድ" 
                        className="h-8"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-3 p-4">
                    <div>Menu</div>
                    <div>Menu</div>
                    <div>
                      <Input 
                        value="ምናሌ" 
                        className="h-8"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-3 p-4">
                    <div>Settings</div>
                    <div>Settings</div>
                    <div>
                      <Input 
                        value="ቅንብሮች" 
                        className="h-8"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="add_new">
          <Card>
            <CardHeader>
              <CardTitle>
                <T text="Add New Translation" />
              </CardTitle>
              <CardDescription>
                <T text="Add a new translation key and value" />
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    <T text="Key" />
                  </label>
                  <Input placeholder={t("Enter translation key")} />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    <T text="English" />
                  </label>
                  <Input placeholder={t("Enter English translation")} />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    <T text="Amharic" />
                  </label>
                  <Input placeholder={t("Enter Amharic translation")} />
                </div>
              </div>
              <Button>
                <T text="Add Translation" />
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>
                <T text="Translation Settings" />
              </CardTitle>
              <CardDescription>
                <T text="Configure language and translation settings" />
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    <T text="Default Language" />
                  </label>
                  <select className="w-full p-2 border rounded">
                    <option value="en">English</option>
                    <option value="am">Amharic</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    <T text="Translation Source" />
                  </label>
                  <select className="w-full p-2 border rounded">
                    <option value="database">
                      <T text="Database" />
                    </option>
                    <option value="json">
                      <T text="JSON Files" />
                    </option>
                  </select>
                </div>
                <Button>
                  <T text="Save Settings" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default LanguageManagement;
