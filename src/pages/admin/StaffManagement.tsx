
import React, { useState } from "react";
import Layout from "@/components/Layout";
import { PageHeader } from "@/components/ui/page-header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { UserPlus } from "lucide-react";
import { useLanguage, T } from "@/contexts/LanguageContext";
import { useNavigate } from "react-router-dom";

// Custom hooks and components
import useStaffMembers from "@/hooks/useStaffMembers";
import StaffStatCards from "@/components/staff/StaffStatCards";
import SearchBar from "@/components/staff/SearchBar";
import StaffListByDepartment from "@/components/staff/StaffListByDepartment";
import StaffLoadingState from "@/components/staff/StaffLoadingState";
import ErrorDisplay from "@/components/staff/ErrorDisplay";

const StaffManagement = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  
  // Use our custom hook to fetch staff data
  const { data: staffMembers, isLoading, error } = useStaffMembers();
  
  // Filter staff based on search term
  const filteredStaff = staffMembers.filter(staff => {
    const fullName = `${staff.first_name || ""} ${staff.last_name || ""}`.toLowerCase();
    return fullName.includes(searchTerm.toLowerCase()) ||
      (staff.role || "").toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <Layout interface="admin">
      <PageHeader 
        heading={<T text="Staff Management" />}
        description={<T text="Manage your restaurant staff, track attendance and performance" />}
        actions={
          <Button onClick={() => navigate("/admin/staff/new")}>
            <UserPlus className="mr-2 h-4 w-4" />
            <T text="Add Staff" />
          </Button>
        }
      />

      {error && <ErrorDisplay error={error} />}

      <StaffStatCards staffMembers={staffMembers} />

      <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      
      <Tabs defaultValue="all">
        <TabsList className="mb-4">
          <TabsTrigger value="all"><T text="All Staff" /></TabsTrigger>
          <TabsTrigger value="Kitchen"><T text="Kitchen" /></TabsTrigger>
          <TabsTrigger value="Front of House"><T text="Waiters" /></TabsTrigger>
          <TabsTrigger value="Management"><T text="Management" /></TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          {isLoading ? (
            <Card>
              <StaffLoadingState />
            </Card>
          ) : (
            <StaffListByDepartment staffMembers={filteredStaff} department="all" />
          )}
        </TabsContent>

        <TabsContent value="Kitchen">
          <StaffListByDepartment staffMembers={filteredStaff} department="Kitchen" />
        </TabsContent>

        <TabsContent value="Front of House">
          <StaffListByDepartment staffMembers={filteredStaff} department="Front of House" />
        </TabsContent>

        <TabsContent value="Management">
          <StaffListByDepartment staffMembers={filteredStaff} department="Management" />
        </TabsContent>
      </Tabs>
    </Layout>
  );
};

export default StaffManagement;
