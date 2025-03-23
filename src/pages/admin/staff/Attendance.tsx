
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Calendar, Download, Plus, Filter, Users, FileSpreadsheet } from "lucide-react";
import { useLanguage, T } from "@/contexts/LanguageContext";
import { format } from "date-fns";
import AttendanceList from "@/components/staff/AttendanceList";
import { useStaffAttendance } from "@/hooks/useStaffAttendance";
import { useStaffMembers } from "@/hooks/useStaffMembers";
import { DatePicker } from "@/components/ui/date-picker";
import AttendanceRecordDialog from "@/components/staff/AttendanceRecordDialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { exportAttendanceData } from "@/services/staff/performanceService";

const Attendance = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("daily");
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedStaffId, setSelectedStaffId] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [isExporting, setIsExporting] = useState(false);
  
  const { 
    attendanceRecords,
    isLoading,
    fetchAttendanceData,
    addAttendanceRecord,
    updateAttendanceRecord
  } = useStaffAttendance(); 
  
  const { data: staffMembers = [], isLoading: isLoadingStaff } = useStaffMembers();
  
  // Create a mapping of staff IDs to full names
  const staffNames = staffMembers.reduce((acc, staff) => {
    acc[staff.id] = `${staff.first_name || ""} ${staff.last_name || ""}`.trim();
    return acc;
  }, {} as Record<string, string>);
  
  // Get filtered attendance records based on selected date and status
  const filteredAttendanceRecords = attendanceRecords.filter(record => {
    // Filter by date
    const recordDate = new Date(record.date);
    const selected = new Date(selectedDate);
    const dateMatch = 
      recordDate.getDate() === selected.getDate() && 
      recordDate.getMonth() === selected.getMonth() && 
      recordDate.getFullYear() === selected.getFullYear();
    
    // Filter by status
    const statusMatch = statusFilter === "all" || record.status.toLowerCase() === statusFilter.toLowerCase();
    
    // Filter by staff member in staff tab
    const staffMatch = !selectedStaffId || record.staff_id === selectedStaffId;
    
    return dateMatch && statusMatch && staffMatch;
  });

  // Get current date for the heading
  const currentDate = format(selectedDate, "MMMM d, yyyy");

  const handleExport = async () => {
    setIsExporting(true);
    try {
      await exportAttendanceData();
      toast({
        title: t("Export Successful"),
        description: t("Attendance data has been exported successfully"),
      });
    } catch (error) {
      console.error("Export failed:", error);
      toast({
        title: t("Export Failed"),
        description: t("Failed to export attendance data"),
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };

  const handleDateChange = (date: Date | undefined) => {
    if (date) {
      setSelectedDate(date);
    }
  };

  const handleAddAttendance = () => {
    setIsDialogOpen(true);
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    // Refresh data after closing dialog
    fetchAttendanceData();
  };

  const handleStaffSelect = (staffId: string) => {
    setSelectedStaffId(staffId === "all" ? null : staffId);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight"><T text="Staff Attendance" /></h1>
          <p className="text-muted-foreground"><T text="Track and manage staff attendance records" /></p>
        </div>
        <div className="flex space-x-2">
          <div className="flex space-x-2">
            <DatePicker 
              value={selectedDate}
              onChange={handleDateChange}
              placeholder={t("Select date")}
            />
            <Select
              value={statusFilter}
              onValueChange={setStatusFilter}
            >
              <SelectTrigger className="w-[130px]">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder={t("Filter Status")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all"><T text="All Status" /></SelectItem>
                <SelectItem value="present"><T text="Present" /></SelectItem>
                <SelectItem value="late"><T text="Late" /></SelectItem>
                <SelectItem value="absent"><T text="Absent" /></SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" onClick={handleExport} disabled={isExporting}>
              {isExporting ? (
                <span className="animate-spin mr-2 h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
              ) : (
                <FileSpreadsheet className="mr-2 h-4 w-4" />
              )}
              <T text="Export" />
            </Button>
            <Button onClick={handleAddAttendance}>
              <Plus className="mr-2 h-4 w-4" />
              <T text="Record Attendance" />
            </Button>
          </div>
        </div>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-6">
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
              <CardTitle><T text="Attendance for" /> {currentDate}</CardTitle>
            </CardHeader>
            <CardContent>
              <AttendanceList 
                attendanceRecords={filteredAttendanceRecords} 
                isLoading={isLoading}
                showStaffInfo={true}
                staffNames={staffNames}
                onUpdateAttendance={updateAttendanceRecord}
              />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="staff">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle><T text="Attendance by Staff Member" /></CardTitle>
              <Select
                value={selectedStaffId || "all"}
                onValueChange={handleStaffSelect}
              >
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder={t("Select staff member")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all"><T text="All Staff" /></SelectItem>
                  {staffMembers.map((staff) => (
                    <SelectItem key={staff.id} value={staff.id}>
                      {`${staff.first_name || ""} ${staff.last_name || ""}`.trim() || staff.id}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardHeader>
            <CardContent>
              {selectedStaffId ? (
                <AttendanceList 
                  attendanceRecords={filteredAttendanceRecords} 
                  isLoading={isLoading}
                  showStaffInfo={false}
                  staffNames={staffNames}
                  onUpdateAttendance={updateAttendanceRecord}
                />
              ) : (
                <div className="flex flex-col items-center justify-center py-6 text-center">
                  {staffMembers.length > 0 ? (
                    <>
                      <p className="mb-4 text-muted-foreground"><T text="Select a staff member to view their attendance history." /></p>
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 w-full max-w-3xl">
                        {staffMembers.map((staff) => (
                          <Button 
                            key={staff.id} 
                            variant="outline" 
                            className="h-auto py-3 flex flex-col items-center justify-center text-center"
                            onClick={() => handleStaffSelect(staff.id)}
                          >
                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                              <Users className="h-5 w-5 text-primary" />
                            </div>
                            <span className="text-sm font-medium">
                              {`${staff.first_name || ""} ${staff.last_name || ""}`.trim() || "Staff Member"}
                            </span>
                            <span className="text-xs text-muted-foreground mt-1">{staff.role || "Staff"}</span>
                          </Button>
                        ))}
                      </div>
                    </>
                  ) : (
                    <p className="text-muted-foreground">
                      {isLoadingStaff ? <T text="Loading staff members..." /> : <T text="No staff members found" />}
                    </p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <AttendanceRecordDialog 
        isOpen={isDialogOpen} 
        onClose={handleDialogClose}
        staffMembers={staffMembers}
        onSubmit={addAttendanceRecord}
      />
    </div>
  );
};

export default Attendance;
