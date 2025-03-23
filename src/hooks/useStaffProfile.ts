
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { StaffMember } from "./useStaffMembers";
import { 
  fetchStaffProfileById, 
  fetchAttendanceStats, 
  fetchPayrollData, 
  fetchTaskStats,
  updateStaffProfileData,
  deleteStaffProfileData
} from "@/services/staff/profileService";
import { uploadStaffImage } from "@/utils/staffUtils";
import { handleApiError } from "@/utils/staffUtils";

export const useStaffProfile = (id: string) => {
  const [staffMember, setStaffMember] = useState<StaffMember | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchStaffProfile = async () => {
    if (!id) return;
    
    setIsLoading(true);
    setError(null);
    try {
      // Get the staff profile details
      const profileData = await fetchStaffProfileById(id);

      // Get the related data in parallel
      const [attendanceData, payrollData, tasksData] = await Promise.all([
        fetchAttendanceStats(id),
        fetchPayrollData(id),
        fetchTaskStats(id)
      ]);

      // Calculate summary stats if data available
      let summaryStats = {
        total_hours_worked: profileData.total_hours_worked || 0,
        total_pay: 0,
        completed_tasks: 0,
        pending_tasks: 0,
        on_time_percentage: 0,
      };

      if (attendanceData && attendanceData.length > 0) {
        const totalHours = attendanceData.reduce((sum, record) => 
          sum + (record.hours_worked || 0), 0);
        summaryStats.total_hours_worked = totalHours;
      }

      if (payrollData && payrollData.length > 0) {
        const totalPay = payrollData.reduce((sum, record) => 
          sum + (record.total_pay || 0), 0);
        summaryStats.total_pay = totalPay;
      }

      if (tasksData && tasksData.length > 0) {
        const tasks = tasksData;
        summaryStats.completed_tasks = tasks.filter(task => task.status === 'Completed').length;
        summaryStats.pending_tasks = tasks.filter(task => task.status === 'Pending').length;
        summaryStats.on_time_percentage = tasks.length > 0 
          ? Math.round((summaryStats.completed_tasks / tasks.length) * 100) 
          : 0;
      }
      
      // Merge the profile data with summary stats
      setStaffMember({ ...profileData, ...summaryStats } as StaffMember);
    } catch (err: any) {
      const errorMessage = handleApiError(err, 'Failed to load staff profile', toast);
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const updateStaffProfile = async (updates: Partial<StaffMember>, profileImage?: File | null) => {
    if (!id) return null;
    
    try {
      const updatedData = await updateStaffProfileData(id, updates, profileImage);
      
      // Update the local state with new data
      if (staffMember) {
        setStaffMember({ ...staffMember, ...updatedData });
      }
      
      toast({
        title: "Success",
        description: "Profile updated successfully",
      });
      
      return updatedData;
    } catch (err: any) {
      handleApiError(err, 'Failed to update profile', toast);
      return null;
    }
  };

  const deleteStaffProfile = async () => {
    try {
      await deleteStaffProfileData(id);
      return { success: true };
    } catch (err: any) {
      handleApiError(err, 'Failed to delete profile', toast);
      return { success: false, error: err.message };
    }
  }

  useEffect(() => {
    if (id) {
      fetchStaffProfile();
    }
  }, [id]);

  return {
    staffMember,
    isLoading,
    error,
    fetchStaffProfile,
    updateStaffProfile,
    deleteStaffProfile,
    uploadStaffImage
  };
};

export default useStaffProfile;
