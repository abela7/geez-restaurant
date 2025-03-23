
import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  ArrowLeft, Loader2, Edit, Trash, CalendarDays, 
  DollarSign, ClipboardCheck
} from "lucide-react";
import { useLanguage, T } from "@/contexts/LanguageContext";
import { useToast } from "@/hooks/use-toast";
import useStaffProfile from "@/hooks/useStaffProfile";

// Import profile components
import ProfileSidebar from "@/components/staff/profile/ProfileSidebar";
import ProfileHeader from "@/components/staff/profile/ProfileHeader";
import AttendanceSection from "@/components/staff/profile/AttendanceSection";
import PayrollSection from "@/components/staff/profile/PayrollSection";
import TasksSection from "@/components/staff/profile/TasksSection";
import PerformanceMetrics from "@/components/staff/profile/PerformanceMetrics";
import ErrorState from "@/components/staff/profile/ErrorState";

import {
  Tabs, TabsList, TabsTrigger, TabsContent
} from "@/components/ui/tabs";

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

const StaffProfile = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast } = useToast();
  const { t } = useLanguage();
  
  // Use the custom hook to fetch the staff profile
  const { staffMember, isLoading, error, fetchStaffProfile, deleteStaffProfile } = useStaffProfile(id || '');
  
  const handleDeleteStaff = async () => {
    if (!id) return;
    
    setIsDeleting(true);
    try {
      const result = await deleteStaffProfile();
      
      if (!result.success) {
        throw new Error(result.error || "An unknown error occurred");
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
      setIsDeleting(false);
      setDeleteDialogOpen(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !staffMember) {
    return (
      <ErrorState message={error || "Staff member not found"} />
    );
  }

  return (
    <div className="space-y-4">
      {/* Action buttons at the top right */}
      <div className="flex justify-end space-x-2">
        <Button 
          variant="outline"
          onClick={() => navigate("/admin/staff/directory")}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          <T text="Back to Directory" />
        </Button>
        
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

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <div className="lg:col-span-1">
          <ProfileSidebar staff={staffMember} />
        </div>
        
        <div className="lg:col-span-3 space-y-4">
          {/* Tabs section moved to the top for important info */}
          <Tabs defaultValue="attendance">
            <TabsList>
              <TabsTrigger value="attendance">
                <CalendarDays className="h-4 w-4 mr-2" />
                <T text="Attendance" />
              </TabsTrigger>
              <TabsTrigger value="payroll">
                <DollarSign className="h-4 w-4 mr-2" />
                <T text="Payroll" />
              </TabsTrigger>
              <TabsTrigger value="tasks">
                <ClipboardCheck className="h-4 w-4 mr-2" />
                <T text="Tasks" />
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="attendance" className="mt-4">
              <AttendanceSection staffId={staffMember.id} />
            </TabsContent>
            
            <TabsContent value="payroll" className="mt-4">
              <PayrollSection staffId={staffMember.id} />
            </TabsContent>
            
            <TabsContent value="tasks" className="mt-4">
              <TasksSection staffId={staffMember.id} />
            </TabsContent>
          </Tabs>
          
          {/* Staff info (default collapsed) */}
          <ProfileHeader staff={staffMember} />
          
          {/* Performance metrics moved to bottom */}
          <PerformanceMetrics staff={staffMember} />
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
            <AlertDialogAction 
              onClick={handleDeleteStaff} 
              className="bg-red-500 hover:bg-red-600"
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  <T text="Deleting..." />
                </>
              ) : (
                <T text="Delete" />
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default StaffProfile;
