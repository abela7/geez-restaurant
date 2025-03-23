
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2, Edit, Trash } from "lucide-react";
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

const StaffProfile = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const { toast } = useToast();
  
  console.log("StaffProfile component loaded with ID:", id);
  
  // Use our custom hook to fetch staff data
  const { staffMember, isLoading, error, fetchStaffProfile } = useStaffProfile(id || "");

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

  if (!id) {
    console.error("No ID parameter found");
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
        <ErrorState message="No staff ID provided" />
      </>
    );
  }

  return (
    <>
      <PageHeader 
        heading={
          isLoading ? 
            <T text="Staff Profile" /> : 
            staffMember ? 
              `${staffMember.first_name || ""} ${staffMember.last_name || ""}` : 
              <T text="Staff Profile" />
        }
        description={
          isLoading ? 
            <T text="Loading staff information..." /> : 
            staffMember ? 
              staffMember.role || <T text="Staff Member" /> : 
              <T text="Staff information" />
        }
        actions={
          <div className="flex space-x-2">
            <Button 
              variant="outline"
              onClick={() => navigate("/admin/staff/directory")}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              <T text="Back to Directory" />
            </Button>
            {!isLoading && staffMember && (
              <>
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
              </>
            )}
          </div>
        }
      />

      {isLoading ? (
        <div className="flex items-center justify-center min-h-[50vh]">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
        </div>
      ) : error || !staffMember ? (
        <ErrorState message={error || "Staff member not found"} />
      ) : (
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
      )}

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
