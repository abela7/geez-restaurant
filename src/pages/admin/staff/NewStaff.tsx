
import React, { useState } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Save, Upload, Loader2 } from "lucide-react";
import { useLanguage, T } from "@/contexts/LanguageContext";
import { useNavigate } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { v4 as uuidv4 } from 'uuid';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const roles = [
  { value: "Chef", label: "Chef" },
  { value: "Sous Chef", label: "Sous Chef" },
  { value: "Line Cook", label: "Line Cook" },
  { value: "Server", label: "Server" },
  { value: "Host", label: "Host" },
  { value: "Bartender", label: "Bartender" },
  { value: "Manager", label: "Manager" },
  { value: "Assistant Manager", label: "Assistant Manager" },
];

const departments = [
  { value: "Kitchen", label: "Kitchen" },
  { value: "Front of House", label: "Front of House" },
  { value: "Management", label: "Management" },
];

const NewStaff = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const form = useForm({
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

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setProfileImage(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (event) => {
        setImagePreview(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadImage = async (): Promise<string | null> => {
    if (!profileImage) return null;
    
    setUploading(true);
    const fileExt = profileImage.name.split('.').pop();
    const filePath = `${uuidv4()}.${fileExt}`;
    
    try {
      const { error: uploadError } = await supabase.storage
        .from('staff_images')
        .upload(filePath, profileImage);
      
      if (uploadError) {
        throw uploadError;
      }
      
      const { data } = supabase.storage
        .from('staff_images')
        .getPublicUrl(filePath);
      
      return data.publicUrl;
    } catch (error: any) {
      console.error('Error uploading image:', error);
      toast({
        title: "Upload Error",
        description: error.message || "Failed to upload image",
        variant: "destructive",
      });
      return null;
    } finally {
      setUploading(false);
    }
  };

  const onSubmit = async (data: any) => {
    try {
      setUploading(true);
      
      // Upload image if selected
      let imageUrl = null;
      if (profileImage) {
        imageUrl = await uploadImage();
        if (imageUrl) {
          data.image_url = imageUrl;
        }
      }
      
      // Format numeric values
      const formattedData = {
        ...data,
        hourly_rate: data.hourly_rate ? parseFloat(data.hourly_rate) : null,
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
      
      // Navigate to the staff profile page
      navigate(`/admin/staff/profile/${insertedStaff.id}`);
    } catch (error: any) {
      console.error("Error adding staff:", error);
      toast({
        title: "Error",
        description: `Failed to add staff member: ${error.message}`,
        variant: "destructive",
      });
    } finally {
      setUploading(false);
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
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle><T text="Personal Information" /></CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="first_name"
                  rules={{ required: "First name is required" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel><T text="First Name" /></FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="last_name"
                  rules={{ required: "Last name is required" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel><T text="Last Name" /></FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="email"
                  rules={{
                    required: "Email is required",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Invalid email address",
                    },
                  }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel><T text="Email" /></FormLabel>
                      <FormControl>
                        <Input type="email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel><T text="Phone Number" /></FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="bio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel><T text="Bio" /></FormLabel>
                    <FormControl>
                      <Textarea {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="space-y-2">
                <FormLabel><T text="Profile Image" /></FormLabel>
                <div className="border rounded-md p-4 space-y-4">
                  {imagePreview && (
                    <div className="flex justify-center mb-4">
                      <img 
                        src={imagePreview} 
                        alt="Profile preview" 
                        className="h-32 w-32 object-cover rounded-full border"
                      />
                    </div>
                  )}
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                    id="profile-image"
                  />
                  <Button 
                    type="button" 
                    variant="outline" 
                    className="w-full"
                    onClick={() => document.getElementById('profile-image')?.click()}
                  >
                    <Upload className="mr-2 h-4 w-4" />
                    <T text="Upload Image" />
                  </Button>
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
                <FormField
                  control={form.control}
                  name="role"
                  rules={{ required: "Role is required" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel><T text="Role" /></FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder={t("Select role")} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {roles.map((role) => (
                            <SelectItem key={role.value} value={role.value}>
                              {role.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="department"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel><T text="Department" /></FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder={t("Select department")} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {departments.map((dept) => (
                            <SelectItem key={dept.value} value={dept.value}>
                              {dept.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="start_date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel><T text="Start Date" /></FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="hourly_rate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel><T text="Hourly Rate (£)" /></FormLabel>
                      <FormControl>
                        <Input type="number" step="0.01" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>
          
          <div className="flex justify-end space-x-2">
            <Button 
              type="button" 
              variant="outline"
              onClick={() => navigate("/admin/staff/directory")}
            >
              <T text="Cancel" />
            </Button>
            <Button type="submit" disabled={uploading}>
              {uploading ? (
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
      </Form>
    </>
  );
};

export default NewStaff;
