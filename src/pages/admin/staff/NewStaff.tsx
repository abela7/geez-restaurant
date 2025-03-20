
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, UserPlus, Upload, Loader2, AlertCircle } from "lucide-react";
import { useLanguage, T } from "@/contexts/LanguageContext";
import { useForm } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

type StaffFormValues = {
  first_name: string;
  last_name: string;
  role: string;
  department: string;
  email: string;
  phone: string;
  address: string;
  hourly_rate: string;
  bio: string;
  gender: string;
};

const NewStaff = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  
  const form = useForm<StaffFormValues>({
    defaultValues: {
      first_name: "",
      last_name: "",
      role: "",
      department: "",
      email: "",
      phone: "",
      address: "",
      hourly_rate: "",
      bio: "",
      gender: ""
    }
  });

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedImage(file);
    }
  };

  // Get initials for Avatar fallback
  const getInitials = () => {
    const firstName = form.watch("first_name") || "";
    const lastName = form.watch("last_name") || "";
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const uploadProfileImage = async (staffId: string): Promise<string | null> => {
    if (!selectedImage) return null;
    
    setUploadingImage(true);
    
    try {
      // Create a unique file name using timestamp and original file name
      const fileExt = selectedImage.name.split('.').pop();
      const fileName = `${staffId}-${Date.now()}.${fileExt}`;
      const filePath = `staff_images/${fileName}`;
      
      // Upload image to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('staff_images')
        .upload(filePath, selectedImage);
      
      if (uploadError) throw uploadError;
      
      // Get public URL for the uploaded image
      const { data } = supabase.storage
        .from('staff_images')
        .getPublicUrl(filePath);
      
      return data.publicUrl;
    } catch (err: any) {
      console.error('Error uploading image:', err);
      toast({
        title: "Warning",
        description: `Failed to upload profile image: ${err.message}`,
      });
      return null;
    } finally {
      setUploadingImage(false);
    }
  };

  const onSubmit = async (data: StaffFormValues) => {
    setIsSaving(true);
    setError(null);
    
    try {
      // Create a new staff member in the profiles table
      const { data: newStaff, error: insertError } = await supabase
        .from('profiles')
        .insert({
          first_name: data.first_name,
          last_name: data.last_name,
          role: data.role,
          department: data.department,
          email: data.email,
          phone: data.phone,
          address: data.address,
          hourly_rate: data.hourly_rate ? parseFloat(data.hourly_rate) : null,
          bio: data.bio,
          gender: data.gender,
          attendance: "Present", // Default attendance
          performance: 90, // Default performance
          hiring_date: new Date().toISOString().split('T')[0],
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select();
      
      if (insertError) {
        throw insertError;
      }
      
      const staffId = newStaff[0].id;
      
      // Upload profile image if selected
      if (selectedImage) {
        const imageUrl = await uploadProfileImage(staffId);
        
        if (imageUrl) {
          // Update the staff record with the image URL
          const { error: updateError } = await supabase
            .from('profiles')
            .update({ image_url: imageUrl })
            .eq('id', staffId);
          
          if (updateError) {
            console.error('Error updating staff with image URL:', updateError);
          }
        }
      }
      
      toast({
        title: "Success",
        description: "New staff member created successfully",
      });
      
      navigate("/admin/staff/directory");
    } catch (err: any) {
      console.error('Error creating staff member:', err);
      setError(err.message || 'Failed to create staff member');
      toast({
        title: "Error",
        description: `Failed to create staff member: ${err.message}`,
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Layout interface="admin">
      <PageHeader 
        heading={<T text="Add New Staff" />}
        description={<T text="Create a new staff record" />}
        actions={
          <Button 
            variant="outline"
            onClick={() => navigate("/admin/staff/directory")}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            <T text="Back to Staff" />
          </Button>
        }
      />

      {error && (
        <Card className="mb-6 border-red-300 bg-red-50 dark:bg-red-950/20">
          <CardContent className="p-4 flex items-center gap-3">
            <AlertCircle className="h-5 w-5 text-red-500" />
            <p className="text-red-500">{error}</p>
          </CardContent>
        </Card>
      )}

      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle><T text="Personal Information" /></CardTitle>
                <CardDescription><T text="Basic information about the staff member" /></CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="first_name"><T text="First Name" /></Label>
                    <Input 
                      id="first_name" 
                      {...form.register("first_name", { required: true })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="last_name"><T text="Last Name" /></Label>
                    <Input 
                      id="last_name" 
                      {...form.register("last_name", { required: true })}
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email"><T text="Email" /></Label>
                    <Input 
                      id="email" 
                      type="email" 
                      {...form.register("email")}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone"><T text="Phone Number" /></Label>
                    <Input 
                      id="phone" 
                      {...form.register("phone")}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="address"><T text="Address" /></Label>
                  <Input 
                    id="address" 
                    {...form.register("address")}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="gender"><T text="Gender" /></Label>
                  <Select 
                    onValueChange={(value) => form.setValue("gender", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={t("Select gender")} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male"><T text="Male" /></SelectItem>
                      <SelectItem value="female"><T text="Female" /></SelectItem>
                      <SelectItem value="other"><T text="Other" /></SelectItem>
                      <SelectItem value="prefer_not_to_say"><T text="Prefer not to say" /></SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="bio"><T text="Bio" /></Label>
                  <Textarea 
                    id="bio" 
                    placeholder={t("Brief description of the staff member...")}
                    className="min-h-[100px]"
                    {...form.register("bio")}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle><T text="Employment Details" /></CardTitle>
                <CardDescription><T text="Job-related information" /></CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="role"><T text="Role" /></Label>
                    <Select 
                      onValueChange={(value) => form.setValue("role", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={t("Select a role")} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="chef"><T text="Chef" /></SelectItem>
                        <SelectItem value="waiter"><T text="Waiter" /></SelectItem>
                        <SelectItem value="manager"><T text="Manager" /></SelectItem>
                        <SelectItem value="hostess"><T text="Host/Hostess" /></SelectItem>
                        <SelectItem value="bartender"><T text="Bartender" /></SelectItem>
                        <SelectItem value="dishwasher"><T text="Dishwasher" /></SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="department"><T text="Department" /></Label>
                    <Select 
                      onValueChange={(value) => form.setValue("department", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={t("Select a department")} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Kitchen"><T text="Kitchen" /></SelectItem>
                        <SelectItem value="Front of House"><T text="Front of House" /></SelectItem>
                        <SelectItem value="Management"><T text="Management" /></SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="hourly_rate"><T text="Hourly Rate (£)" /></Label>
                  <Input 
                    id="hourly_rate" 
                    type="number" 
                    min="0" 
                    step="0.01"
                    placeholder="6.00"
                    {...form.register("hourly_rate")}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-1 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle><T text="Profile Picture" /></CardTitle>
                <CardDescription><T text="Upload a staff photo" /></CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {selectedImage ? (
                  <div className="flex flex-col items-center justify-center space-y-4">
                    <Avatar className="h-32 w-32">
                      <AvatarFallback>{getInitials()}</AvatarFallback>
                    </Avatar>
                    <p className="text-sm text-center">
                      {selectedImage.name} ({Math.round(selectedImage.size / 1024)} KB)
                    </p>
                    <div className="flex space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => document.getElementById("profile-picture")?.click()}
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        <T text="Change" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setSelectedImage(null)}
                      >
                        <AlertCircle className="h-4 w-4 mr-2" />
                        <T text="Remove" />
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 flex flex-col items-center justify-center text-center">
                    <div className="mb-4 bg-primary/10 p-3 rounded-full">
                      <Upload className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="font-medium"><T text="Upload an image" /></h3>
                    <p className="text-xs text-muted-foreground mt-1">
                      <T text="Drag and drop or click to browse" />
                    </p>
                    <input
                      type="file"
                      className="hidden"
                      id="profile-picture"
                      accept="image/*"
                      onChange={handleImageSelect}
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-4"
                      onClick={() => document.getElementById("profile-picture")?.click()}
                    >
                      <T text="Select Image" />
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
        
        <div className="mt-6 flex justify-end space-x-2">
          <Button 
            variant="outline" 
            onClick={() => navigate("/admin/staff/directory")}
            disabled={isSaving}
          >
            <T text="Cancel" />
          </Button>
          <Button 
            type="submit" 
            disabled={isSaving}
          >
            {isSaving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                <T text="Creating..." />
              </>
            ) : (
              <>
                <UserPlus className="mr-2 h-4 w-4" />
                <T text="Create Staff Record" />
              </>
            )}
          </Button>
        </div>
      </form>
    </Layout>
  );
};

export default NewStaff;
