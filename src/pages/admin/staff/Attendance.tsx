
import React, { useState } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Calendar, Download, Plus, Filter, Users } from "lucide-react";
import { useLanguage, T } from "@/contexts/LanguageContext";
import { format } from "date-fns";
import AttendanceList from "@/components/staff/AttendanceList";
import { useStaffAttendance } from "@/hooks/useStaffAttendance";
import { useStaffMembers } from "@/hooks/useStaffMembers";

const Attendance = () => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState("daily");
  
  const { 
    attendanceRecords,
    isLoading
  } = useStaffAttendance();
  
  const { data: staffMembers = [] } = useStaffMembers({});
  
  // Create a mapping of staff IDs to full names
  const staffNames = staffMembers.reduce((acc, staff) => {
    acc[staff.id] = `${staff.first_name || ""} ${staff.last_name || ""}`.trim();
    return acc;
  }, {} as Record<string, string>);
  
  // Get current date for the heading
  const currentDate = format(new Date(), "MMMM d, yyyy");

  return (
    <>
      <PageHeader 
        heading={<T text="Staff Attendance" />}
        description={<T text="Track and manage staff attendance records" />}
        actions={
          <div className="flex space-x-2">
            <Button variant="outline">
              <Filter className="mr-2 h-4 w-4" />
              <T text="Filter" />
            </Button>
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              <T text="Export" />
            </Button>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              <T text="Record Attendance" />
            </Button>
          </div>
        }
      />
      
      <Tabs defaultValue="daily" onValueChange={setActiveTab} className="mt-6">
        <TabsList className="mb-4">
          <TabsTrigger value="daily">
            <Calendar className="mr-2 h-4 w-4" />
            <T text="Daily View" />
          </TabsTrigger>
          <TabsTrigger value="staff">
            <Users className="mr-2 h-4 w-4" />
            <T text="By Staff Member" />
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="daily">
          <Card>
            <CardHeader>
              <CardTitle><T text="Today's Attendance" /> - {currentDate}</CardTitle>
            </CardHeader>
            <CardContent>
              <AttendanceList 
                attendanceRecords={attendanceRecords} 
                isLoading={isLoading}
                showStaffInfo={true}
                staffNames={staffNames}
              />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="staff">
          <Card>
            <CardHeader>
              <CardTitle><T text="Attendance by Staff Member" /></CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-center py-6">
                <T text="Select a staff member to view their attendance history." />
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </>
  );
};

export default Attendance;
