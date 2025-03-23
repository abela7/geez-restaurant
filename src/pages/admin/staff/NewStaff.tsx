
import React from "react";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Save, Upload } from "lucide-react";
import { useLanguage, T } from "@/contexts/LanguageContext";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

// Add console logs to track component loading
console.log("NewStaff component loaded");

const NewStaff = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
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
  
  const onSubmit = async (data) => {
    console.log("Form submitted with data:", data);
    try {
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
      
      // Navigate to the staff directory after successful addition
      navigate("/admin/staff/directory");
    } catch (error) {
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
                  error={errors.first_name?.message}
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
                  error={errors.last_name?.message}
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
                  error={errors.email?.message}
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
                <Button type="button" variant="outline" className="w-full">
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
              <div className="space-y-2">
                <Label htmlFor="role"><T text="Role" /></Label>
                <Select 
                  onValueChange={(value) => setValue("role", value)}
                  defaultValue={watch("role")}
                >
                  <SelectTrigger>
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
              </div>
              <div className="space-y-2">
                <Label htmlFor="department"><T text="Department" /></Label>
                <Select 
                  onValueChange={(value) => setValue("department", value)}
                  defaultValue={watch("department")}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t("Select department")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Kitchen">Kitchen</SelectItem>
                    <SelectItem value="Front of House">Front of House</SelectItem>
                    <SelectItem value="Management">Management</SelectItem>
                  </SelectContent>
                </Select>
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
          >
            <T text="Cancel" />
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            <Save className="mr-2 h-4 w-4" />
            <T text="Save Staff" />
          </Button>
        </div>
      </form>
    </>
  );
};

export default NewStaff;
