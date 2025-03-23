
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { Loader2, UserPlus, Database } from "lucide-react";
import { useLanguage, T } from "@/contexts/LanguageContext";
import useStaffMembers from "@/hooks/useStaffMembers";
import { Input } from "@/components/ui/input";
import StaffListByDepartment from "@/components/staff/StaffListByDepartment";
import StaffStatCards from "@/components/staff/StaffStatCards";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import seedAllStaffData from "@/utils/seedStaffData";

const Directory = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const { data: staffMembers, isLoading, error, fetchStaffData } = useStaffMembers();
  const [isSeedingData, setIsSeedingData] = useState(false);
  const { toast } = useToast();
  
  // Filter staff based on search term
  const filteredStaff = staffMembers.filter(staff => {
    const fullName = `${staff.first_name || ""} ${staff.last_name || ""}`.toLowerCase();
    return fullName.includes(searchTerm.toLowerCase()) ||
      (staff.email || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (staff.role || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (staff.department || "").toLowerCase().includes(searchTerm.toLowerCase());
  });
  
  const handleSeedData = async () => {
    setIsSeedingData(true);
    try {
      const success = await seedAllStaffData();
      if (success) {
        toast({
          title: "Success",
          description: "Sample staff data has been added to the database",
        });
        fetchStaffData(); // Refresh the staff list
      } else {
        toast({
          title: "Error",
          description: "Failed to seed staff data",
          variant: "destructive"
        });
      }
    } catch (error: any) {
      console.error("Error seeding data:", error);
      toast({
        title: "Error",
        description: `Failed to seed data: ${error.message}`,
        variant: "destructive"
      });
    } finally {
      setIsSeedingData(false);
    }
  };
  
  return (
    <>
      <PageHeader
        heading={<T text="Staff Directory" />}
        description={<T text="View and manage all staff members" />}
        actions={
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              disabled={isSeedingData}
              onClick={handleSeedData}
            >
              {isSeedingData ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  <T text="Adding Sample Data..." />
                </>
              ) : (
                <>
                  <Database className="mr-2 h-4 w-4" />
                  <T text="Add Sample Data" />
                </>
              )}
            </Button>
            <Button onClick={() => navigate("/admin/staff/new")}>
              <UserPlus className="mr-2 h-4 w-4" />
              <T text="Add Staff Member" />
            </Button>
          </div>
        }
      />

      <StaffStatCards staffMembers={staffMembers} />

      <div className="my-6">
        <Input
          placeholder={t("Search staff by name, role, or department...")}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-md"
        />
      </div>

      <Tabs defaultValue="all" className="mt-6">
        <TabsList className="mb-4">
          <TabsTrigger value="all"><T text="All Staff" /></TabsTrigger>
          <TabsTrigger value="Kitchen"><T text="Kitchen" /></TabsTrigger>
          <TabsTrigger value="Front of House"><T text="Front of House" /></TabsTrigger>
          <TabsTrigger value="Management"><T text="Management" /></TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          {isLoading ? (
            <div className="flex justify-center items-center h-40">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <StaffListByDepartment staffMembers={filteredStaff} department="all" />
          )}
        </TabsContent>

        <TabsContent value="Kitchen">
          {isLoading ? (
            <div className="flex justify-center items-center h-40">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <StaffListByDepartment staffMembers={filteredStaff} department="Kitchen" />
          )}
        </TabsContent>

        <TabsContent value="Front of House">
          {isLoading ? (
            <div className="flex justify-center items-center h-40">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <StaffListByDepartment staffMembers={filteredStaff} department="Front of House" />
          )}
        </TabsContent>

        <TabsContent value="Management">
          {isLoading ? (
            <div className="flex justify-center items-center h-40">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <StaffListByDepartment staffMembers={filteredStaff} department="Management" />
          )}
        </TabsContent>
      </Tabs>
    </>
  );
};

export default Directory;
