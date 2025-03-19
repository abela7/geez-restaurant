
import React from 'react';
import Layout from '@/components/Layout';
import { useLanguage, T } from '@/contexts/LanguageContext';
import { PageHeader } from '@/components/ui/page-header';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Building, MapPin, Phone, Mail, Clock, Save, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const RestaurantProfile: React.FC = () => {
  const { t } = useLanguage();

  return (
    <Layout interface="admin">
      <PageHeader
        heading={<T text="Restaurant Profile" />}
        description={<T text="Manage your restaurant information" />}
        icon={<Building className="h-6 w-6" />}
      />
      
      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="general"><T text="General Information" /></TabsTrigger>
          <TabsTrigger value="hours"><T text="Business Hours" /></TabsTrigger>
          <TabsTrigger value="branding"><T text="Branding" /></TabsTrigger>
        </TabsList>
        
        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle><T text="General Information" /></CardTitle>
              <CardDescription><T text="Basic details about your restaurant" /></CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="restaurantName"><T text="Restaurant Name" /></Label>
                  <Input id="restaurantName" defaultValue="Habesha Restaurant" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="cuisine"><T text="Cuisine Type" /></Label>
                  <Input id="cuisine" defaultValue="Ethiopian & Eritrean" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="phone"><T text="Phone Number" /></Label>
                  <Input id="phone" defaultValue="+1 (555) 123-4567" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email"><T text="Email Address" /></Label>
                  <Input id="email" defaultValue="info@habesharestaurant.com" />
                </div>
                
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="address"><T text="Address" /></Label>
                  <Input id="address" defaultValue="123 Ethiopian Way, City, State, 12345" />
                </div>
                
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="description"><T text="Restaurant Description" /></Label>
                  <Textarea 
                    id="description" 
                    rows={4}
                    defaultValue="Authentic Ethiopian and Eritrean cuisine in a warm, inviting atmosphere. We offer traditional dishes prepared with fresh ingredients and served in the customary style."
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="taxId"><T text="Tax ID" /></Label>
                  <Input id="taxId" defaultValue="12-3456789" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="foundedYear"><T text="Founded Year" /></Label>
                  <Input id="foundedYear" defaultValue="2010" />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button>
                <Save className="h-4 w-4 mr-2" />
                <T text="Save Changes" />
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="hours">
          <Card>
            <CardHeader>
              <CardTitle><T text="Business Hours" /></CardTitle>
              <CardDescription><T text="Set your operating hours" /></CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map((day) => (
                  <div key={day} className="flex flex-col md:flex-row md:items-center justify-between border-b pb-4 last:border-0">
                    <div className="font-medium w-32 mb-2 md:mb-0">
                      <T text={day} />
                    </div>
                    
                    <div className="flex items-center space-x-4 flex-1">
                      <div className="grid grid-cols-2 gap-2 flex-1">
                        <div>
                          <Label htmlFor={`${day.toLowerCase()}-open`} className="text-xs">
                            <T text="Open" />
                          </Label>
                          <Input 
                            id={`${day.toLowerCase()}-open`} 
                            defaultValue={day === "Sunday" ? "12:00" : "11:00"}
                            className="h-8" 
                          />
                        </div>
                        <div>
                          <Label htmlFor={`${day.toLowerCase()}-close`} className="text-xs">
                            <T text="Close" />
                          </Label>
                          <Input 
                            id={`${day.toLowerCase()}-close`} 
                            defaultValue="22:00"
                            className="h-8" 
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <Button>
                <Save className="h-4 w-4 mr-2" />
                <T text="Save Hours" />
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="branding">
          <Card>
            <CardHeader>
              <CardTitle><T text="Branding" /></CardTitle>
              <CardDescription><T text="Customize your restaurant's visual identity" /></CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label className="block mb-2"><T text="Restaurant Logo" /></Label>
                <div className="flex items-center">
                  <div className="w-24 h-24 bg-muted rounded-lg flex items-center justify-center mr-4 border-2 border-dashed border-muted-foreground">
                    <ImageIcon className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <Button variant="outline">
                    <T text="Upload Logo" />
                  </Button>
                </div>
              </div>
              
              <div>
                <Label className="block mb-2"><T text="Restaurant Cover Image" /></Label>
                <div className="w-full h-40 bg-muted rounded-lg flex items-center justify-center border-2 border-dashed border-muted-foreground mb-2">
                  <ImageIcon className="h-8 w-8 text-muted-foreground" />
                </div>
                <Button variant="outline">
                  <T text="Upload Cover Image" />
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="primaryColor"><T text="Primary Color" /></Label>
                  <div className="flex">
                    <Input id="primaryColor" defaultValue="#E67E22" className="rounded-r-none" />
                    <div className="w-10 h-10 bg-orange-500 rounded-r-md border border-l-0 border-input" />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="secondaryColor"><T text="Secondary Color" /></Label>
                  <div className="flex">
                    <Input id="secondaryColor" defaultValue="#2ECC71" className="rounded-r-none" />
                    <div className="w-10 h-10 bg-green-500 rounded-r-md border border-l-0 border-input" />
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button>
                <Save className="h-4 w-4 mr-2" />
                <T text="Save Branding" />
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </Layout>
  );
};

export default RestaurantProfile;
