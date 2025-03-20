
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
import { ArrowLeft, Save, UserPlus, Upload } from "lucide-react";
import { useLanguage, T } from "@/contexts/LanguageContext";
import { useForm } from "react-hook-form";
import { useStaff } from "@/hooks/useStaff";
import { StaffMember, StaffRole, Department, StaffRoleEnum } from "@/types/staff";
import { useToast } from "@/hooks/use-toast";

type StaffFormValues = Omit<StaffMember, 'id'> & {
  hiring_date: string;
};

const roleMapping: Record<StaffRole, StaffRoleEnum> = {
  'admin': 'Admin',
  'waiter': 'Waiter',
  'chef': 'Kitchen',
  'dishwasher': 'Kitchen',
  'manager': 'Admin'
};

const NewStaff = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { addStaffMember } = useStaff();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<StaffFormValues>({
    defaultValues: {
      first_name: "",
      last_name: "",
      role: "waiter",
      staff_role: "Waiter",
      department: "Front of House",
      email: "",
      phone: "",
      address: "",
      hourly_rate: 6.00,
      bio: "",
      gender: "",
      performance: 90,
      attendance: "Present",
      image_url: "/placeholder.svg",
      hiring_date: new Date().toISOString().split('T')[0]
    }
  });

  const onSubmit = async (data: StaffFormValues) => {
    setIsSubmitting(true);
    console.log("Form data:", data);
    
    try {
      // Update staff_role based on selected role if not set
      if (!data.staff_role) {
        data.staff_role = roleMapping[data.role as StaffRole];
      }
      
      // In a real app with auth, we would need to create the user first
      // Since we have a foreign key constraint, we cannot directly insert
      // profiles without associated auth.users records
      toast({
        title: "Demo Mode",
        description: "In a production app, this would create a new staff record",
      });
      
      // Navigate back to staff list
      setTimeout(() => {
        navigate("/admin/staff");
      }, 1000);
    } catch (error) {
      console.error("Error:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create staff record",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle role change to update staff_role accordingly
  const handleRoleChange = (role: string) => {
    form.setValue("role", role as StaffRole);
    form.setValue("staff_role", roleMapping[role as StaffRole]);
  };

  return (
    <Layout interface="admin">
      <PageHeader 
        heading={<T text="Add New Staff" />}
        description={<T text="Create a new staff record" />}
        actions={
          <Button 
            variant="outline"
            onClick={() => navigate("/admin/staff")}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            <T text="Back to Staff" />
          </Button>
        }
      />

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
                      {...form.register("email", { required: true })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone"><T text="Phone Number" /></Label>
                    <Input 
                      id="phone" 
                      {...form.register("phone", { required: true })}
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
                    defaultValue={form.getValues().gender}
                    onValueChange={(value) => form.setValue("gender", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={t("Select gender")} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Male"><T text="Male" /></SelectItem>
                      <SelectItem value="Female"><T text="Female" /></SelectItem>
                      <SelectItem value="Other"><T text="Other" /></SelectItem>
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
                      defaultValue={form.getValues().role}
                      onValueChange={(value) => handleRoleChange(value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={t("Select a role")} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="chef"><T text="Chef" /></SelectItem>
                        <SelectItem value="waiter"><T text="Waiter" /></SelectItem>
                        <SelectItem value="manager"><T text="Manager" /></SelectItem>
                        <SelectItem value="dishwasher"><T text="Dishwasher" /></SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="staff_role"><T text="Staff Category" /></Label>
                    <Select 
                      defaultValue={form.getValues().staff_role}
                      onValueChange={(value) => form.setValue("staff_role", value as StaffRoleEnum)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={t("Select a staff category")} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Super Admin"><T text="Super Admin" /></SelectItem>
                        <SelectItem value="Admin"><T text="Admin" /></SelectItem>
                        <SelectItem value="Waiter"><T text="Waiter" /></SelectItem>
                        <SelectItem value="Kitchen"><T text="Kitchen" /></SelectItem>
                        <SelectItem value="Customer"><T text="Customer" /></SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="department"><T text="Department" /></Label>
                    <Select 
                      defaultValue={form.getValues().department}
                      onValueChange={(value) => form.setValue("department", value as Department)}
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
                  <div className="space-y-2">
                    <Label htmlFor="hourly_rate"><T text="Hourly Rate (£)" /></Label>
                    <Input 
                      id="hourly_rate" 
                      type="number" 
                      min="0" 
                      step="0.01"
                      placeholder="6.00"
                      {...form.register("hourly_rate", { 
                        required: true,
                        valueAsNumber: true 
                      })}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="hiring_date"><T text="Start Date" /></Label>
                  <Input 
                    id="hiring_date" 
                    type="date" 
                    {...form.register("hiring_date")}
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
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle><T text="Skills & Qualifications" /></CardTitle>
                <CardDescription><T text="Add specific skills" /></CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label><T text="Add Skills" /></Label>
                  <Input placeholder={t("Enter a skill and press Enter")} />
                </div>
                
                <div className="flex flex-wrap gap-2">
                  {/* This would typically be dynamically generated */}
                  <Button variant="outline" size="sm" className="rounded-full">
                    <T text="Customer Service" />
                  </Button>
                  <Button variant="outline" size="sm" className="rounded-full">
                    <T text="Food Safety" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        
        <div className="mt-6 flex justify-end space-x-2">
          <Button 
            variant="outline" 
            onClick={() => navigate("/admin/staff")}
          >
            <T text="Cancel" />
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            <UserPlus className="mr-2 h-4 w-4" />
            <T text="Create Staff Record" />
          </Button>
        </div>
      </form>
    </Layout>
  );
};

export default NewStaff;
