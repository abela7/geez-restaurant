
import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { useLanguage, T } from '@/contexts/LanguageContext';
import { PageHeader } from '@/components/ui/page-header';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Building, MapPin, Phone, Mail, Clock, Save, Image as ImageIcon, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import NoData from '@/components/ui/no-data';
import { toast } from 'sonner';
import { 
  getRestaurantProfile,
  updateRestaurantProfile,
  getBusinessHours,
  updateBusinessHours,
  getRestaurantBranding,
  updateRestaurantBranding,
  uploadImage
} from '@/services/settings/restaurantProfileService';
import { RestaurantProfile as RestaurantProfileType, BusinessHours, RestaurantBranding } from '@/services/settings/types';

const RestaurantProfilePage: React.FC = () => {
  const { t } = useLanguage();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [profile, setProfile] = useState<RestaurantProfileType | null>(null);
  const [businessHours, setBusinessHours] = useState<BusinessHours[]>([]);
  const [branding, setBranding] = useState<RestaurantBranding | null>(null);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [coverImageFile, setCoverImageFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);

  useEffect(() => {
    const loadRestaurantData = async () => {
      setIsLoading(true);
      try {
        const profileData = await getRestaurantProfile();
        const hoursData = await getBusinessHours();
        const brandingData = await getRestaurantBranding();
        
        setProfile(profileData);
        setBusinessHours(hoursData);
        setBranding(brandingData);
        
        if (brandingData?.logo_url) {
          setLogoPreview(brandingData.logo_url);
        }
        if (brandingData?.cover_image_url) {
          setCoverPreview(brandingData.cover_image_url);
        }
      } catch (error) {
        console.error('Error loading restaurant data:', error);
        toast.error('Failed to load restaurant data');
      } finally {
        setIsLoading(false);
      }
    };
    
    loadRestaurantData();
  }, []);

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfile(prev => prev ? { ...prev, [name]: value } : null);
  };

  const handleHoursChange = (day: string, field: 'open_time' | 'close_time', value: string) => {
    setBusinessHours(prev => 
      prev.map(hour => 
        hour.day_of_week === day 
          ? { ...hour, [field]: value } 
          : hour
      )
    );
  };

  const handleBrandingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setBranding(prev => prev ? { ...prev, [name]: value } : null);
  };

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>, 
    setFile: React.Dispatch<React.SetStateAction<File | null>>,
    setPreview: React.Dispatch<React.SetStateAction<string | null>>
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      setFile(file);
      const reader = new FileReader();
      reader.onload = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = async () => {
    if (!profile) return;
    
    setIsSaving(true);
    try {
      await updateRestaurantProfile(profile);
      toast.success('Restaurant profile updated successfully');
    } catch (error) {
      console.error('Error saving profile:', error);
      toast.error('Failed to save restaurant profile');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveHours = async () => {
    setIsSaving(true);
    try {
      for (const hour of businessHours) {
        await updateBusinessHours(hour.day_of_week, {
          open_time: hour.open_time,
          close_time: hour.close_time,
          is_closed: hour.is_closed
        });
      }
      toast.success('Business hours updated successfully');
    } catch (error) {
      console.error('Error saving hours:', error);
      toast.error('Failed to save business hours');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveBranding = async () => {
    if (!branding) return;
    
    setIsSaving(true);
    try {
      let brandingData = { ...branding };
      
      // Handle logo upload
      if (logoFile) {
        const logoUrl = await uploadImage(logoFile, 'logos');
        if (logoUrl) {
          brandingData.logo_url = logoUrl;
        }
      }
      
      // Handle cover image upload
      if (coverImageFile) {
        const coverUrl = await uploadImage(coverImageFile, 'covers');
        if (coverUrl) {
          brandingData.cover_image_url = coverUrl;
        }
      }
      
      await updateRestaurantBranding(brandingData);
      toast.success('Branding updated successfully');
    } catch (error) {
      console.error('Error saving branding:', error);
      toast.error('Failed to save branding');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <Layout interface="admin">
        <div className="flex items-center justify-center h-full">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

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
            {!profile ? (
              <CardContent>
                <NoData message={t("No restaurant profile information found")} />
              </CardContent>
            ) : (
              <>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name"><T text="Restaurant Name" /></Label>
                      <Input 
                        id="name" 
                        name="name"
                        value={profile.name || ''}
                        onChange={handleProfileChange}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="cuisine_type"><T text="Cuisine Type" /></Label>
                      <Input 
                        id="cuisine_type" 
                        name="cuisine_type"
                        value={profile.cuisine_type || ''}
                        onChange={handleProfileChange}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="phone"><T text="Phone Number" /></Label>
                      <Input 
                        id="phone" 
                        name="phone"
                        value={profile.phone || ''}
                        onChange={handleProfileChange}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="email"><T text="Email Address" /></Label>
                      <Input 
                        id="email" 
                        name="email"
                        value={profile.email || ''}
                        onChange={handleProfileChange}
                      />
                    </div>
                    
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="address"><T text="Address" /></Label>
                      <Input 
                        id="address" 
                        name="address"
                        value={profile.address || ''}
                        onChange={handleProfileChange}
                      />
                    </div>
                    
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="description"><T text="Restaurant Description" /></Label>
                      <Textarea 
                        id="description" 
                        name="description"
                        rows={4}
                        value={profile.description || ''}
                        onChange={handleProfileChange}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="tax_id"><T text="Tax ID" /></Label>
                      <Input 
                        id="tax_id" 
                        name="tax_id"
                        value={profile.tax_id || ''}
                        onChange={handleProfileChange}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="founded_year"><T text="Founded Year" /></Label>
                      <Input 
                        id="founded_year" 
                        name="founded_year"
                        type="number"
                        value={profile.founded_year || ''}
                        onChange={handleProfileChange}
                      />
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button onClick={handleSaveProfile} disabled={isSaving}>
                    {isSaving ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Save className="h-4 w-4 mr-2" />
                    )}
                    <T text="Save Changes" />
                  </Button>
                </CardFooter>
              </>
            )}
          </Card>
        </TabsContent>
        
        <TabsContent value="hours">
          <Card>
            <CardHeader>
              <CardTitle><T text="Business Hours" /></CardTitle>
              <CardDescription><T text="Set your operating hours" /></CardDescription>
            </CardHeader>
            {businessHours.length === 0 ? (
              <CardContent>
                <NoData message={t("No business hours information found")} />
              </CardContent>
            ) : (
              <>
                <CardContent>
                  <div className="space-y-4">
                    {businessHours.map((hour) => (
                      <div key={hour.day_of_week} className="flex flex-col md:flex-row md:items-center justify-between border-b pb-4 last:border-0">
                        <div className="font-medium w-32 mb-2 md:mb-0">
                          <T text={hour.day_of_week} />
                        </div>
                        
                        <div className="flex items-center space-x-4 flex-1">
                          <div className="grid grid-cols-2 gap-2 flex-1">
                            <div>
                              <Label htmlFor={`${hour.day_of_week.toLowerCase()}-open`} className="text-xs">
                                <T text="Open" />
                              </Label>
                              <Input 
                                id={`${hour.day_of_week.toLowerCase()}-open`} 
                                value={hour.open_time}
                                onChange={(e) => handleHoursChange(hour.day_of_week, 'open_time', e.target.value)}
                                className="h-8" 
                              />
                            </div>
                            <div>
                              <Label htmlFor={`${hour.day_of_week.toLowerCase()}-close`} className="text-xs">
                                <T text="Close" />
                              </Label>
                              <Input 
                                id={`${hour.day_of_week.toLowerCase()}-close`} 
                                value={hour.close_time}
                                onChange={(e) => handleHoursChange(hour.day_of_week, 'close_time', e.target.value)}
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
                  <Button onClick={handleSaveHours} disabled={isSaving}>
                    {isSaving ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Save className="h-4 w-4 mr-2" />
                    )}
                    <T text="Save Hours" />
                  </Button>
                </CardFooter>
              </>
            )}
          </Card>
        </TabsContent>
        
        <TabsContent value="branding">
          <Card>
            <CardHeader>
              <CardTitle><T text="Branding" /></CardTitle>
              <CardDescription><T text="Customize your restaurant's visual identity" /></CardDescription>
            </CardHeader>
            {!branding ? (
              <CardContent>
                <NoData message={t("No branding information found")} />
              </CardContent>
            ) : (
              <>
                <CardContent className="space-y-6">
                  <div>
                    <Label className="block mb-2"><T text="Restaurant Logo" /></Label>
                    <div className="flex items-center">
                      <div className="w-24 h-24 bg-muted rounded-lg flex items-center justify-center mr-4 border-2 border-dashed border-muted-foreground overflow-hidden">
                        {logoPreview ? (
                          <img src={logoPreview} alt="Logo" className="w-full h-full object-cover" />
                        ) : (
                          <ImageIcon className="h-8 w-8 text-muted-foreground" />
                        )}
                      </div>
                      <div>
                        <Input
                          type="file"
                          accept="image/*"
                          id="logo"
                          className="hidden"
                          onChange={(e) => handleFileChange(e, setLogoFile, setLogoPreview)}
                        />
                        <Label htmlFor="logo" className="cursor-pointer">
                          <Button variant="outline" type="button" onClick={() => document.getElementById('logo')?.click()}>
                            <T text="Upload Logo" />
                          </Button>
                        </Label>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <Label className="block mb-2"><T text="Restaurant Cover Image" /></Label>
                    <div className="w-full h-40 bg-muted rounded-lg flex items-center justify-center border-2 border-dashed border-muted-foreground mb-2 overflow-hidden">
                      {coverPreview ? (
                        <img src={coverPreview} alt="Cover" className="w-full h-full object-cover" />
                      ) : (
                        <ImageIcon className="h-8 w-8 text-muted-foreground" />
                      )}
                    </div>
                    <div>
                      <Input
                        type="file"
                        accept="image/*"
                        id="cover"
                        className="hidden"
                        onChange={(e) => handleFileChange(e, setCoverImageFile, setCoverPreview)}
                      />
                      <Label htmlFor="cover" className="cursor-pointer">
                        <Button variant="outline" type="button" onClick={() => document.getElementById('cover')?.click()}>
                          <T text="Upload Cover Image" />
                        </Button>
                      </Label>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="primary_color"><T text="Primary Color" /></Label>
                      <div className="flex">
                        <Input 
                          id="primary_color" 
                          name="primary_color"
                          value={branding.primary_color || ''}
                          onChange={handleBrandingChange}
                          className="rounded-r-none" 
                        />
                        <div 
                          className="w-10 h-10 rounded-r-md border border-l-0 border-input" 
                          style={{ backgroundColor: branding.primary_color || '#E67E22' }}
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="secondary_color"><T text="Secondary Color" /></Label>
                      <div className="flex">
                        <Input 
                          id="secondary_color" 
                          name="secondary_color"
                          value={branding.secondary_color || ''}
                          onChange={handleBrandingChange}
                          className="rounded-r-none" 
                        />
                        <div 
                          className="w-10 h-10 rounded-r-md border border-l-0 border-input" 
                          style={{ backgroundColor: branding.secondary_color || '#2ECC71' }}
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button onClick={handleSaveBranding} disabled={isSaving}>
                    {isSaving ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Save className="h-4 w-4 mr-2" />
                    )}
                    <T text="Save Branding" />
                  </Button>
                </CardFooter>
              </>
            )}
          </Card>
        </TabsContent>
      </Tabs>
    </Layout>
  );
};

export default RestaurantProfilePage;
