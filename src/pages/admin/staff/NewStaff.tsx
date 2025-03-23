
import React, { useState } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Save, Upload, Loader2 } from "lucide-react";
import { useLanguage, T } from "@/contexts/LanguageContext";
import { useNavigate } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

// Add console logs to track component loading
console.log("NewStaff component loaded");

type StaffFormData = {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  role: string;
  department: string;
  start_date: string;
  hourly_rate: string;
  bio: string;
  image_url: string;
};

const NewStaff = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [uploading, setUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<StaffFormData>({
    defaultValues: {
      first_name: "",
      last_name: "",
      email: "",
      phone: "",
      role: "",
      department: "",
      start_date: "",
      hourly_rate: "",
      bio: "",
      image_url: "",
    },
  });
  
  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) {
      return;
    }
    
    const file = files[0];
    setUploading(true);
    
    try {
      // Create a unique file name
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `staff_images/${fileName}`;
      
      // Upload image to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('staff_images')
        .upload(filePath, file);
      
      if (uploadError) {
        throw uploadError;
      }
      
      // Get public URL for the uploaded image
      const { data } = supabase.storage
        .from('staff_images')
        .getPublicUrl(filePath);
      
      const publicUrl = data.publicUrl;
      setImageUrl(publicUrl);
      
      toast({
        title: "Success",
        description: "Image uploaded successfully",
      });
    } catch (error: any) {
      console.error('Error uploading image:', error);
      toast({
        title: "Error",
        description: `Failed to upload image: ${error.message}`,
        variant: "destructive"
      });
    } finally {
      setUploading(false);
    }
  };
  
  const onSubmit = async (data: StaffFormData) => {
    console.log("Form submitted with data:", data);
    try {
      // Format numeric values
      const formattedData = {
        ...data,
        hourly_rate: data.hourly_rate ? parseFloat(data.hourly_rate) : null,
        image_url: imageUrl,
        attendance: "Not set",
        performance: 0,
      };
      
      const { data: insertedStaff, error } = await supabase
        .from("profiles")
        .insert([formattedData])
        .select()
        .single();
      
      if (error) {
        throw error;
      }
      
      toast({
        title: "Success",
        description: "Staff member has been added successfully",
      });
      
      // Navigate to the staff directory after successful addition
      navigate("/admin/staff/directory");
    } catch (error: any) {
      console.error("Error adding staff:", error);
      toast({
        title: "Error",
        description: `Failed to add staff member: ${error.message}`,
        variant: "destructive",
      });
    }
  };
  
  return (
    <>
      <PageHeader 
        heading={<T text="Add New Staff" />}
        description={<T text="Create a new staff profile" />}
        actions={
          <Button
            variant="outline"
            onClick={() => navigate("/admin/staff/directory")}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            <T text="Back to Directory" />
          </Button>
        }
      />
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle><T text="Personal Information" /></CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="first_name"><T text="First Name" /></Label>
                <Input 
                  id="first_name" 
                  {...register("first_name", { required: "First name is required" })} 
                  className={errors.first_name ? "border-red-500" : ""}
                />
                {errors.first_name && (
                  <p className="text-sm text-red-500">{errors.first_name.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="last_name"><T text="Last Name" /></Label>
                <Input 
                  id="last_name" 
                  {...register("last_name", { required: "Last name is required" })} 
                  className={errors.last_name ? "border-red-500" : ""}
                />
                {errors.last_name && (
                  <p className="text-sm text-red-500">{errors.last_name.message}</p>
                )}
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email"><T text="Email" /></Label>
                <Input 
                  id="email" 
                  type="email" 
                  {...register("email", { 
                    required: "Email is required",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Invalid email address"
                    }
                  })} 
                  className={errors.email ? "border-red-500" : ""}
                />
                {errors.email && (
                  <p className="text-sm text-red-500">{errors.email.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone"><T text="Phone Number" /></Label>
                <Input 
                  id="phone" 
                  {...register("phone")} 
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="bio"><T text="Bio" /></Label>
              <Textarea 
                id="bio" 
                {...register("bio")} 
              />
            </div>
            
            <div className="space-y-2">
              <Label><T text="Profile Image" /></Label>
              <div className="border rounded-md p-4">
                {imageUrl ? (
                  <div className="flex flex-col items-center">
                    <img src={imageUrl} alt="Profile" className="h-32 w-32 object-cover rounded-full mb-4" />
                    <Button type="button" variant="outline" onClick={() => document.getElementById('profile-image-upload')?.click()}>
                      <Upload className="mr-2 h-4 w-4" />
                      <T text="Change Image" />
                    </Button>
                  </div>
                ) : (
                  <Button 
                    type="button" 
                    variant="outline" 
                    className="w-full"
                    onClick={() => document.getElementById('profile-image-upload')?.click()}
                    disabled={uploading}
                  >
                    {uploading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        <T text="Uploading..." />
                      </>
                    ) : (
                      <>
                        <Upload className="mr-2 h-4 w-4" />
                        <T text="Upload Image" />
                      </>
                    )}
                  </Button>
                )}
                <input 
                  id="profile-image-upload" 
                  type="file" 
                  accept="image/*" 
                  onChange={handleImageUpload} 
                  className="hidden" 
                  disabled={uploading}
                />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle><T text="Employment Details" /></CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="role"><T text="Role" /></Label>
                <Controller
                  name="role"
                  control={control}
                  rules={{ required: "Role is required" }}
                  render={({ field }) => (
                    <Select 
                      onValueChange={field.onChange}
                      value={field.value}
                    >
                      <SelectTrigger id="role">
                        <SelectValue placeholder={t("Select role")} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Chef">Chef</SelectItem>
                        <SelectItem value="Sous Chef">Sous Chef</SelectItem>
                        <SelectItem value="Line Cook">Line Cook</SelectItem>
                        <SelectItem value="Server">Server</SelectItem>
                        <SelectItem value="Host">Host</SelectItem>
                        <SelectItem value="Bartender">Bartender</SelectItem>
                        <SelectItem value="Manager">Manager</SelectItem>
                        <SelectItem value="Assistant Manager">Assistant Manager</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.role && (
                  <p className="text-sm text-red-500">{errors.role.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="department"><T text="Department" /></Label>
                <Controller
                  name="department"
                  control={control}
                  rules={{ required: "Department is required" }}
                  render={({ field }) => (
                    <Select 
                      onValueChange={field.onChange}
                      value={field.value}
                    >
                      <SelectTrigger id="department">
                        <SelectValue placeholder={t("Select department")} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Kitchen">Kitchen</SelectItem>
                        <SelectItem value="Front of House">Front of House</SelectItem>
                        <SelectItem value="Management">Management</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.department && (
                  <p className="text-sm text-red-500">{errors.department.message}</p>
                )}
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="start_date"><T text="Start Date" /></Label>
                <Input 
                  id="start_date" 
                  type="date" 
                  {...register("start_date")} 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="hourly_rate"><T text="Hourly Rate (£)" /></Label>
                <Input 
                  id="hourly_rate" 
                  type="number" 
                  step="0.01" 
                  {...register("hourly_rate")} 
                />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <div className="flex justify-end space-x-2">
          <Button 
            type="button" 
            variant="outline"
            onClick={() => navigate("/admin/staff/directory")}
            disabled={isSubmitting}
          >
            <T text="Cancel" />
          </Button>
          <Button 
            type="submit" 
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                <T text="Saving..." />
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                <T text="Save Staff" />
              </>
            )}
          </Button>
        </div>
      </form>
    </>
  );
};

export default NewStaff;
