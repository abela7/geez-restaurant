
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2, Edit, Trash, Clock, Calendar } from "lucide-react";
import { useLanguage, T } from "@/contexts/LanguageContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { type StaffMember } from "@/hooks/useStaffMembers";
import useStaffProfile from "@/hooks/useStaffProfile";

// Import profile components
import ProfileHeader from "@/components/staff/profile/ProfileHeader";
import ProfileSidebar from "@/components/staff/profile/ProfileSidebar";
import AttendanceSection from "@/components/staff/profile/AttendanceSection";
import PayrollSection from "@/components/staff/profile/PayrollSection";
import TasksSection from "@/components/staff/profile/TasksSection";
import ErrorState from "@/components/staff/profile/ErrorState";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const StaffProfile = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [seedDialogOpen, setSeedDialogOpen] = useState(false);
  const [isSeedingData, setIsSeedingData] = useState(false);
  const { toast } = useToast();
  const { t } = useLanguage();
  
  // Use the custom hook to fetch the staff profile
  const { staffMember, isLoading, error, fetchStaffProfile } = useStaffProfile(id || '');
  
  const handleDeleteStaff = async () => {
    if (!id) return;
    
    try {
      const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', id);
      
      if (error) {
        throw error;
      }
      
      toast({
        title: "Success",
        description: "Staff member has been deleted",
      });
      
      navigate("/admin/staff/directory");
    } catch (err: any) {
      console.error('Error deleting staff:', err);
      toast({
        title: "Error",
        description: `Failed to delete staff: ${err.message}`,
        variant: "destructive"
      });
    } finally {
      setDeleteDialogOpen(false);
    }
  };

  const handleSeedData = async () => {
    if (!id) return;
    
    setIsSeedingData(true);
    try {
      // Seed attendance data
      const attendanceData = [
        {
          staff_id: id,
          date: new Date(Date.now() - 86400000 * 0).toISOString().split('T')[0], // Today
          status: 'Present',
          check_in: new Date(Date.now() - 86400000 * 0 + 28800000).toISOString(), // 8:00 AM
          check_out: new Date(Date.now() - 86400000 * 0 + 61200000).toISOString(), // 5:00 PM
          hours_worked: 8,
          notes: 'On time'
        },
        {
          staff_id: id,
          date: new Date(Date.now() - 86400000 * 1).toISOString().split('T')[0], // Yesterday
          status: 'Present',
          check_in: new Date(Date.now() - 86400000 * 1 + 29700000).toISOString(), // 8:15 AM
          check_out: new Date(Date.now() - 86400000 * 1 + 61200000).toISOString(), // 5:00 PM
          hours_worked: 7.75,
          notes: 'Slightly late'
        },
        {
          staff_id: id,
          date: new Date(Date.now() - 86400000 * 2).toISOString().split('T')[0], // 2 days ago
          status: 'Late',
          check_in: new Date(Date.now() - 86400000 * 2 + 32400000).toISOString(), // 9:00 AM
          check_out: new Date(Date.now() - 86400000 * 2 + 61200000).toISOString(), // 5:00 PM
          hours_worked: 7,
          notes: 'Traffic delay'
        },
        {
          staff_id: id,
          date: new Date(Date.now() - 86400000 * 3).toISOString().split('T')[0], // 3 days ago
          status: 'Present',
          check_in: new Date(Date.now() - 86400000 * 3 + 28800000).toISOString(), // 8:00 AM
          check_out: new Date(Date.now() - 86400000 * 3 + 61200000).toISOString(), // 5:00 PM
          hours_worked: 8,
          notes: 'On time'
        },
        {
          staff_id: id,
          date: new Date(Date.now() - 86400000 * 4).toISOString().split('T')[0], // 4 days ago
          status: 'Absent',
          check_in: null,
          check_out: null,
          hours_worked: 0,
          notes: 'Called in sick'
        }
      ];
      
      // Add attendance records
      const { error: attendanceError } = await supabase
        .from('staff_attendance')
        .upsert(attendanceData, { onConflict: 'staff_id, date' });
      
      if (attendanceError) throw attendanceError;
      
      // Seed payroll data
      const payrollData = [
        {
          staff_id: id,
          pay_period: 'June 2023 - Week 1',
          regular_hours: 38,
          overtime_hours: 2,
          total_hours: 40,
          total_pay: 480,
          payment_status: 'Paid',
          payment_date: new Date(Date.now() - 86400000 * 14).toISOString() // 14 days ago
        },
        {
          staff_id: id,
          pay_period: 'June 2023 - Week 2',
          regular_hours: 40,
          overtime_hours: 0,
          total_hours: 40,
          total_pay: 440,
          payment_status: 'Paid',
          payment_date: new Date(Date.now() - 86400000 * 7).toISOString() // 7 days ago
        },
        {
          staff_id: id,
          pay_period: 'June 2023 - Week 3',
          regular_hours: 32,
          overtime_hours: 5,
          total_hours: 37,
          total_pay: 435,
          payment_status: 'Pending',
          payment_date: null
        }
      ];
      
      // Add payroll records
      const { error: payrollError } = await supabase
        .from('staff_payroll')
        .upsert(payrollData, { onConflict: 'staff_id, pay_period' });
      
      if (payrollError) throw payrollError;
      
      // Seed task data
      const taskData = [
        {
          staff_id: id,
          title: 'Complete inventory check',
          description: 'Verify all kitchen supplies and update the inventory system',
          priority: 'High',
          status: 'Pending',
          due_date: new Date(Date.now() + 86400000 * 2).toISOString(), // 2 days from now
          category: 'inventory'
        },
        {
          staff_id: id,
          title: 'Staff training',
          description: 'Conduct training session for new kitchen staff',
          priority: 'Medium',
          status: 'In Progress',
          due_date: new Date(Date.now() + 86400000 * 5).toISOString(), // 5 days from now
          category: 'training'
        },
        {
          staff_id: id,
          title: 'Review menu items',
          description: 'Evaluate current menu performance and suggest changes',
          priority: 'Low',
          status: 'Pending',
          due_date: new Date(Date.now() + 86400000 * 7).toISOString(), // 7 days from now
          category: 'menu'
        },
        {
          staff_id: id,
          title: 'Clean refrigerator',
          description: 'Deep clean the walk-in refrigerator',
          priority: 'Medium',
          status: 'Completed',
          due_date: new Date(Date.now() - 86400000 * 1).toISOString(), // 1 day ago
          completed_at: new Date(Date.now() - 86400000 * 1).toISOString(),
          category: 'cleaning'
        }
      ];
      
      // Add task records
      const { error: taskError } = await supabase
        .from('staff_tasks')
        .upsert(taskData);
      
      if (taskError) throw taskError;
      
      toast({
        title: "Success",
        description: "Sample data has been added for this staff member",
      });
      
      // Refresh the staff profile
      fetchStaffProfile();
    } catch (err: any) {
      console.error('Error seeding data:', err);
      toast({
        title: "Error",
        description: `Failed to seed data: ${err.message}`,
        variant: "destructive"
      });
    } finally {
      setIsSeedingData(false);
      setSeedDialogOpen(false);
    }
  };

  if (isLoading) {
    return (
      <>
        <PageHeader 
          heading={<T text="Staff Profile" />}
          description={<T text="View detailed staff information" />}
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
        <div className="flex items-center justify-center min-h-[50vh]">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
        </div>
      </>
    );
  }

  if (error || !staffMember) {
    return (
      <>
        <PageHeader 
          heading={<T text="Staff Profile" />}
          description={<T text="View detailed staff information" />}
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
        <ErrorState message={error || "Staff member not found"} />
      </>
    );
  }

  return (
    <>
      <PageHeader 
        heading={<T text="Staff Profile" />}
        description={`${staffMember.first_name || ""} ${staffMember.last_name || ""} - ${staffMember.role || "Staff Member"}`}
        actions={
          <div className="flex space-x-2">
            <Button 
              variant="outline"
              onClick={() => navigate("/admin/staff/directory")}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              <T text="Back to Directory" />
            </Button>
            
            <Dialog open={seedDialogOpen} onOpenChange={setSeedDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <Calendar className="mr-2 h-4 w-4" />
                  <T text="Add Sample Data" />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle><T text="Add Sample Data" /></DialogTitle>
                  <DialogDescription>
                    <T text="This will add sample attendance, payroll, and task data for this staff member." />
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <Button 
                    variant="outline" 
                    onClick={() => setSeedDialogOpen(false)}
                  >
                    <T text="Cancel" />
                  </Button>
                  <Button 
                    onClick={handleSeedData}
                    disabled={isSeedingData}
                  >
                    {isSeedingData ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        <T text="Adding..." />
                      </>
                    ) : (
                      <T text="Add Sample Data" />
                    )}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            
            <Button 
              variant="outline"
              onClick={() => navigate(`/admin/staff/edit/${id}`)}
            >
              <Edit className="mr-2 h-4 w-4" />
              <T text="Edit" />
            </Button>
            <Button 
              variant="destructive"
              onClick={() => setDeleteDialogOpen(true)}
            >
              <Trash className="mr-2 h-4 w-4" />
              <T text="Delete" />
            </Button>
          </div>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1">
          <ProfileSidebar staff={staffMember} />
        </div>
        
        <div className="lg:col-span-3 space-y-6">
          <ProfileHeader staff={staffMember} />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <AttendanceSection staffId={staffMember.id} />
            <PayrollSection staffId={staffMember.id} />
          </div>
          
          <TasksSection staffId={staffMember.id} />
        </div>
      </div>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle><T text="Are you sure?" /></AlertDialogTitle>
            <AlertDialogDescription>
              <T text="This action cannot be undone. This will permanently delete the staff member from the system." />
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel><T text="Cancel" /></AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteStaff} className="bg-red-500 hover:bg-red-600">
              <T text="Delete" />
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default StaffProfile;
