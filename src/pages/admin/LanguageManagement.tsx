
import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { useLanguage, T } from '@/contexts/LanguageContext';
import { PageHeader } from '@/components/ui/page-header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Download, Upload, Search, Save, Plus, CheckCircle, Languages } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

// For mock data - in a real app, this would be aggregated from UI components
const mockUITexts = [
  { id: 1, key: 'Dashboard', en: 'Dashboard', am: '' },
  { id: 2, key: 'Reports', en: 'Reports', am: '' },
  { id: 3, key: 'Staff Management', en: 'Staff Management', am: '' },
  { id: 4, key: 'Inventory Control', en: 'Inventory Control', am: '' },
  { id: 5, key: 'Menu Management', en: 'Menu Management', am: '' },
  { id: 6, key: 'Tasks', en: 'Tasks', am: '' },
  { id: 7, key: 'Communication', en: 'Communication', am: '' },
  { id: 8, key: 'Finance', en: 'Finance', am: '' },
  { id: 9, key: 'Language Management', en: 'Language Management', am: '' },
  { id: 10, key: 'Habesha Restaurant Manager', en: 'Habesha Restaurant Manager', am: '' },
  { id: 11, key: 'Today\'s Sales', en: 'Today\'s Sales', am: '' },
  { id: 12, key: 'Active Orders', en: 'Active Orders', am: '' },
  { id: 13, key: 'Staff Present', en: 'Staff Present', am: '' },
  { id: 14, key: 'Inventory Alerts', en: 'Inventory Alerts', am: '' },
  { id: 15, key: 'Administrative Dashboard', en: 'Administrative Dashboard', am: '' },
  { id: 16, key: 'Monitor your restaurant operations in real-time', en: 'Monitor your restaurant operations in real-time', am: '' },
  { id: 17, key: 'New Report', en: 'New Report', am: '' },
  { id: 18, key: 'Sales', en: 'Sales', am: '' },
  { id: 19, key: 'Popular Items', en: 'Popular Items', am: '' },
  { id: 20, key: 'Staff', en: 'Staff', am: '' },
];

const LanguageManagement: React.FC = () => {
  const { translations, setTranslations } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [uiTexts, setUiTexts] = useState<Array<{ id: number; key: string; en: string; am: string }>>([]);
  const [newKey, setNewKey] = useState('');
  const [newTranslation, setNewTranslation] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    // Initialize the UI texts with the mock data and any saved translations
    const initializedTexts = mockUITexts.map(text => ({
      ...text,
      am: translations[text.key] || ''
    }));
    setUiTexts(initializedTexts);
  }, [translations]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleTranslationChange = (id: number, value: string) => {
    setUiTexts(prevTexts => 
      prevTexts.map(text => 
        text.id === id ? { ...text, am: value } : text
      )
    );
  };

  const handleSaveAll = () => {
    const newTranslations = { ...translations };
    
    uiTexts.forEach(text => {
      if (text.am) {
        newTranslations[text.key] = text.am;
      }
    });
    
    setTranslations(newTranslations);
    setSaveSuccess(true);
    
    // Hide the success message after 3 seconds
    setTimeout(() => {
      setSaveSuccess(false);
    }, 3000);
  };

  const handleAddNewTranslation = () => {
    if (newKey && newTranslation) {
      // Add to UI texts
      const newId = uiTexts.length > 0 ? Math.max(...uiTexts.map(t => t.id)) + 1 : 1;
      setUiTexts([...uiTexts, { 
        id: newId,
        key: newKey,
        en: newKey,
        am: newTranslation
      }]);
      
      // Add to translations
      setTranslations({
        ...translations,
        [newKey]: newTranslation
      });
      
      // Reset form
      setNewKey('');
      setNewTranslation('');
      
      // Show success
      setSaveSuccess(true);
      setTimeout(() => {
        setSaveSuccess(false);
      }, 3000);
    }
  };

  const handleExport = () => {
    const dataStr = JSON.stringify(translations, null, 2);
    const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`;
    
    const exportFileDefaultName = 'habesha_translations.json';
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  // Filter texts based on search term
  const filteredTexts = uiTexts.filter(text => 
    text.key.toLowerCase().includes(searchTerm.toLowerCase()) ||
    text.en.toLowerCase().includes(searchTerm.toLowerCase()) ||
    text.am.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Layout interface="admin">
      <PageHeader 
        title="Language Management" 
        description="Manage translations for the Habesha Restaurant System"
        actions={
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleExport}>
              <Download className="mr-2 h-4 w-4" />
              <T text="Export" />
            </Button>
            <Button onClick={handleSaveAll}>
              <Save className="mr-2 h-4 w-4" />
              <T text="Save All" />
            </Button>
          </div>
        }
      />

      {saveSuccess && (
        <Alert className="mb-6 bg-green-50 text-green-800 dark:bg-green-900 dark:text-green-300 border-green-200 dark:border-green-800">
          <CheckCircle className="h-4 w-4" />
          <AlertDescription>
            <T text="Translations saved successfully!" />
          </AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="translations">
        <TabsList>
          <TabsTrigger value="translations">
            <T text="Translations" />
          </TabsTrigger>
          <TabsTrigger value="add-new">
            <T text="Add New" />
          </TabsTrigger>
          <TabsTrigger value="settings">
            <T text="Settings" />
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="translations">
          <Card>
            <CardHeader>
              <CardTitle><T text="UI Text Translations" /></CardTitle>
              <CardDescription>
                <T text="Manage translations for all UI elements" />
              </CardDescription>
              <div className="relative mt-2">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Search translations..." 
                  className="pl-8" 
                  value={searchTerm}
                  onChange={handleSearchChange}
                />
              </div>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[600px] rounded-md border">
                <Table>
                  <TableHeader className="sticky top-0 bg-background">
                    <TableRow>
                      <TableHead className="w-[30%]"><T text="Key" /></TableHead>
                      <TableHead className="w-[35%]"><T text="English" /></TableHead>
                      <TableHead className="w-[35%]"><T text="Amharic" /></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTexts.map((text) => (
                      <TableRow key={text.id}>
                        <TableCell className="font-medium">{text.key}</TableCell>
                        <TableCell>{text.en}</TableCell>
                        <TableCell>
                          <Input 
                            value={text.am} 
                            onChange={(e) => handleTranslationChange(text.id, e.target.value)}
                            placeholder="Add Amharic translation..."
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                    {filteredTexts.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={3} className="text-center py-4">
                          <T text="No results found. Try a different search term." />
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="add-new">
          <Card>
            <CardHeader>
              <CardTitle><T text="Add New Translation" /></CardTitle>
              <CardDescription>
                <T text="Add a new UI text element and its Amharic translation" />
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6">
                <div className="grid gap-3">
                  <Label htmlFor="new-key"><T text="English Text" /></Label>
                  <Input 
                    id="new-key" 
                    value={newKey} 
                    onChange={(e) => setNewKey(e.target.value)}
                    placeholder="Enter English text..."
                  />
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="new-translation"><T text="Amharic Translation" /></Label>
                  <Input 
                    id="new-translation" 
                    value={newTranslation} 
                    onChange={(e) => setNewTranslation(e.target.value)}
                    placeholder="Enter Amharic translation..."
                  />
                </div>
                <Button onClick={handleAddNewTranslation} disabled={!newKey || !newTranslation}>
                  <Plus className="mr-2 h-4 w-4" />
                  <T text="Add Translation" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle><T text="Language Settings" /></CardTitle>
              <CardDescription>
                <T text="Configure language system behavior" />
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium"><T text="Default Language" /></h4>
                    <p className="text-sm text-muted-foreground">
                      <T text="Set the default language for new users" />
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" className="bg-primary text-primary-foreground">
                      <T text="English" />
                    </Button>
                    <Button variant="outline">
                      <T text="Amharic" />
                    </Button>
                  </div>
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium"><T text="Import Translations" /></h4>
                    <p className="text-sm text-muted-foreground">
                      <T text="Upload a JSON file with translations" />
                    </p>
                  </div>
                  <Button variant="outline" className="flex items-center gap-2">
                    <Upload size={16} />
                    <T text="Upload File" />
                  </Button>
                </div>
                
                <Separator />
                
                <div className="rounded-md border p-4 bg-muted/50">
                  <div className="flex items-center gap-3">
                    <Languages className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <h4 className="font-medium"><T text="Translation Statistics" /></h4>
                      <p className="text-sm text-muted-foreground">
                        {Object.keys(translations).length} <T text="of" /> {mockUITexts.length} <T text="items translated" /> ({Math.round((Object.keys(translations).length / mockUITexts.length) * 100) || 0}%)
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </Layout>
  );
};

export default LanguageManagement;
