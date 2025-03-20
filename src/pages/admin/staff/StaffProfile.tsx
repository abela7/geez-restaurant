
import React, { useState } from "react";
import { useParams } from "react-router-dom";
import Layout from "@/components/Layout";
import { PageHeader } from "@/components/ui/page-header";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { useLanguage, T } from "@/contexts/LanguageContext";
import { useToast } from "@/hooks/use-toast";

// Custom hooks for staff data
import useStaffProfile from "@/hooks/useStaffProfile";
import useStaffAttendance from "@/hooks/useStaffAttendance";
import useStaffPayroll from "@/hooks/useStaffPayroll";
import useStaffTasks from "@/hooks/useStaffTasks";

// Refactored components
import ProfileHeader from "@/components/staff/profile/ProfileHeader";
import ProfileSidebar from "@/components/staff/profile/ProfileSidebar";
import PerformanceSection from "@/components/staff/profile/PerformanceSection";
import AttendanceSection from "@/components/staff/profile/AttendanceSection";
import PayrollSection from "@/components/staff/profile/PayrollSection";
import TasksSection from "@/components/staff/profile/TasksSection";
import ErrorState from "@/components/staff/profile/ErrorState";
import StaffLoadingState from "@/components/staff/StaffLoadingState";

const StaffProfile = () => {
  const { id } = useParams<{ id: string }>();
  const { t } = useLanguage();
  const { toast } = useToast();
  
  // Fetch staff profile data
  const { 
    staffMember, 
    isLoading: isProfileLoading, 
    error: profileError 
  } = useStaffProfile(id || '');
  
  // Fetch attendance records
  const { 
    attendanceRecords, 
    isLoading: isAttendanceLoading, 
    error: attendanceError,
    addAttendanceRecord,
    updateAttendanceRecord 
  } = useStaffAttendance(id || '');
  
  // Fetch payroll records
  const { 
    payrollRecords, 
    isLoading: isPayrollLoading, 
    error: payrollError,
    addPayrollRecord,
    updatePayrollRecord 
  } = useStaffPayroll(id || '');
  
  // Fetch tasks
  const { 
    tasks, 
    isLoading: isTasksLoading, 
    error: tasksError,
    addTask,
    updateTask,
    deleteTask 
  } = useStaffTasks(id || '');
  
  // Export data to CSV
  const exportToCSV = (data: any[], filename: string) => {
    if (!data.length) {
      toast({
        title: "Error",
        description: "No data to export",
        variant: "destructive"
      });
      return;
    }

    const headers = Object.keys(data[0]);
    const csvRows = [
      headers.join(','),
      ...data.map(row => 
        headers.map(header => {
          let value = row[header];
          // Handle special formatting
          if (value === null || value === undefined) value = '';
          if (typeof value === 'string') value = `"${value.replace(/"/g, '""')}"`;
          return value;
        }).join(',')
      )
    ];
    
    const csvContent = csvRows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    
    // Create a link to download
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}.csv`);
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "Success",
      description: `${filename} exported successfully`,
    });
  };
  
  // Display loading state
  if (isProfileLoading) {
    return (
      <Layout interface="admin">
        <div className="container mx-auto py-6">
          <PageHeader 
            heading={<T text="Staff Profile" />}
            description={<T text="Loading staff details..." />}
          />
          <Card>
            <StaffLoadingState />
          </Card>
        </div>
      </Layout>
    );
  }

  // Display error state
  if (profileError || !staffMember) {
    return (
      <Layout interface="admin">
        <ErrorState error={profileError} />
      </Layout>
    );
  }

  const getFullName = () => {
    return `${staffMember.first_name || ""} ${staffMember.last_name || ""}`.trim() || "No Name";
  };

  return (
    <Layout interface="admin">
      <ProfileHeader id={id || ''} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <ProfileSidebar staffMember={staffMember} />
        </div>
        
        <div className="lg:col-span-2">
          <Tabs defaultValue="performance">
            <TabsList className="mb-4">
              <TabsTrigger value="performance"><T text="Performance" /></TabsTrigger>
              <TabsTrigger value="attendance"><T text="Attendance" /></TabsTrigger>
              <TabsTrigger value="payroll"><T text="Payroll" /></TabsTrigger>
              <TabsTrigger value="tasks"><T text="Tasks" /></TabsTrigger>
            </TabsList>
            
            <TabsContent value="performance">
              <PerformanceSection 
                staffMember={staffMember}
                onExportData={exportToCSV}
              />
            </TabsContent>
            
            <TabsContent value="attendance">
              <AttendanceSection 
                staffId={id || ''}
                fullName={getFullName()}
                attendanceRecords={attendanceRecords}
                isLoading={isAttendanceLoading}
                error={attendanceError}
                addAttendanceRecord={addAttendanceRecord}
                onExportData={exportToCSV}
              />
            </TabsContent>
            
            <TabsContent value="payroll">
              <PayrollSection 
                staffId={id || ''}
                staffMember={staffMember}
                payrollRecords={payrollRecords}
                isLoading={isPayrollLoading}
                error={payrollError}
                addPayrollRecord={addPayrollRecord}
                updatePayrollRecord={updatePayrollRecord}
                onExportData={exportToCSV}
              />
            </TabsContent>
            
            <TabsContent value="tasks">
              <TasksSection 
                staffId={id || ''}
                fullName={getFullName()}
                tasks={tasks}
                isLoading={isTasksLoading}
                error={tasksError}
                addTask={addTask}
                updateTask={updateTask}
                deleteTask={deleteTask}
                onExportData={exportToCSV}
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Layout>
  );
};

export default StaffProfile;
