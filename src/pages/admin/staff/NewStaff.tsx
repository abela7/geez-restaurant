
import React from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Save, UserPlus, Upload } from "lucide-react";
import { useLanguage, T } from "@/contexts/LanguageContext";
import { useForm } from "react-hook-form";

type StaffFormValues = {
  firstName: string;
  lastName: string;
  role: string;
  department: string;
  email: string;
  phone: string;
  address: string;
  hourlyRate: string;
  bio: string;
};

const NewStaff = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  
  const form = useForm<StaffFormValues>({
    defaultValues: {
      firstName: "",
      lastName: "",
      role: "",
      department: "",
      email: "",
      phone: "",
      address: "",
      hourlyRate: "",
      bio: ""
    }
  });

  const onSubmit = (data: StaffFormValues) => {
    console.log("Form data:", data);
    // In a real application, this would submit to an API
    
    // Show success message and navigate back to staff list
    setTimeout(() => {
      navigate("/admin/staff");
    }, 1000);
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
                    <Label htmlFor="firstName"><T text="First Name" /></Label>
                    <Input 
                      id="firstName" 
                      {...form.register("firstName", { required: true })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName"><T text="Last Name" /></Label>
                    <Input 
                      id="lastName" 
                      {...form.register("lastName", { required: true })}
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
                  <Label htmlFor="bio"><T text="Bio" /></Label>
                  <Textarea 
                    id="bio" 
                    placeholder="Brief description of the staff member..."
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
                    <Select defaultValue="" onValueChange={(value) => form.setValue("role", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder={t("Select a role")} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="chef"><T text="Chef" /></SelectItem>
                        <SelectItem value="waiter"><T text="Waiter" /></SelectItem>
                        <SelectItem value="manager"><T text="Manager" /></SelectItem>
                        <SelectItem value="host"><T text="Host/Hostess" /></SelectItem>
                        <SelectItem value="bartender"><T text="Bartender" /></SelectItem>
                        <SelectItem value="dishwasher"><T text="Dishwasher" /></SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="department"><T text="Department" /></Label>
                    <Select defaultValue="" onValueChange={(value) => form.setValue("department", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder={t("Select a department")} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="kitchen"><T text="Kitchen" /></SelectItem>
                        <SelectItem value="front"><T text="Front of House" /></SelectItem>
                        <SelectItem value="management"><T text="Management" /></SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="hourlyRate"><T text="Hourly Rate (£)" /></Label>
                  <Input 
                    id="hourlyRate" 
                    type="number" 
                    min="0" 
                    step="0.01"
                    placeholder="6.00"
                    {...form.register("hourlyRate", { required: true })}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="startDate"><T text="Start Date" /></Label>
                  <Input 
                    id="startDate" 
                    type="date" 
                    defaultValue={new Date().toISOString().split('T')[0]}
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
          <Button type="submit">
            <UserPlus className="mr-2 h-4 w-4" />
            <T text="Create Staff Record" />
          </Button>
        </div>
      </form>
    </Layout>
  );
};

export default NewStaff;
