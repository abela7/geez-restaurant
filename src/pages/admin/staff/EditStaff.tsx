
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Save, Upload, Loader2 } from "lucide-react";
import { useLanguage, T } from "@/contexts/LanguageContext";
import { useToast } from "@/hooks/use-toast";
import useStaffProfile from "@/hooks/useStaffProfile";
import useRoles from "@/hooks/useRoles";

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

const departments = [
  { value: "Kitchen", label: "Kitchen" },
  { value: "Front of House", label: "Front of House" },
  { value: "Management", label: "Management" },
];

const EditStaff = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t } = useLanguage();
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { data: roles, isLoading: rolesLoading } = useRoles();
  const { 
    staffMember,
    isLoading,
    error,
    updateStaffProfile
  } = useStaffProfile(id || '');

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
      username: "",
      password: ""
    }
  });

  useEffect(() => {
    if (staffMember) {
      // Set form values
      form.reset({
        first_name: staffMember.first_name || "",
        last_name: staffMember.last_name || "",
        email: staffMember.email || "",
        phone: staffMember.phone || "",
        role: staffMember.role || "",
        department: staffMember.department || "",
        start_date: staffMember.start_date || "",
        hourly_rate: staffMember.hourly_rate?.toString() || "",
        bio: staffMember.bio || "",
        image_url: staffMember.image_url || "",
        username: staffMember.username || "",
        password: "" // Don't pre-fill password for security
      });
      
      // Set image preview if exists
      if (staffMember.image_url) {
        setImagePreview(staffMember.image_url);
      }
    }
  }, [staffMember, form]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setProfileImage(file);
      
      const reader = new FileReader();
      reader.onload = (event) => {
        setImagePreview(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data: any) => {
    if (!id) return;
    
    setIsSubmitting(true);
    try {
      // Remove empty password to avoid overwriting with empty string
      if (!data.password) {
        delete data.password;
      }
      
      // Format numeric data
      const formattedData = {
        ...data,
        hourly_rate: data.hourly_rate ? parseFloat(data.hourly_rate) : null,
      };
      
      const result = await updateStaffProfile(formattedData, profileImage);
      
      if (result) {
        toast({
          title: "Success",
          description: "Staff profile updated successfully",
        });
        navigate(`/admin/staff/profile/${id}`);
      }
    } catch (err: any) {
      console.error('Error updating staff:', err);
      toast({
        title: "Error",
        description: `Failed to update staff profile: ${err.message}`,
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !staffMember) {
    return (
      <div className="p-4 bg-destructive/10 text-destructive rounded-md">
        {error || "Staff member not found"}
      </div>
    );
  }

  return (
    <>
      <PageHeader 
        heading={<T text="Edit Staff Profile" />}
        description={<T text="Update the staff member's information" />}
        actions={
          <Button
            variant="outline"
            onClick={() => navigate(`/admin/staff/profile/${id}`)}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            <T text="Back to Profile" />
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
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="username"
                  rules={{ required: "Username is required" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel><T text="Username" /></FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel><T text="Password" /></FormLabel>
                      <FormControl>
                        <Input 
                          type="password" 
                          {...field} 
                          placeholder={t("Leave blank to keep current password")} 
                        />
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
                    <T text="Upload New Image" />
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
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder={t("Select role")} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {rolesLoading ? (
                            <SelectItem value="loading" disabled>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin inline" />
                              Loading roles...
                            </SelectItem>
                          ) : roles && roles.length > 0 ? (
                            roles.map((role) => (
                              <SelectItem key={role.id} value={role.name}>
                                {role.name}
                              </SelectItem>
                            ))
                          ) : (
                            <SelectItem value="default" disabled>
                              No roles available
                            </SelectItem>
                          )}
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
                        value={field.value}
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
              onClick={() => navigate(`/admin/staff/profile/${id}`)}
            >
              <T text="Cancel" />
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  <T text="Saving..." />
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  <T text="Save Changes" />
                </>
              )}
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
};

export default EditStaff;
