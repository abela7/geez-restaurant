
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { StaffMember } from "./useStaffMembers";

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
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) {
        throw error;
      }

      // Get the summary stats from related tables
      const [attendanceResult, payrollResult, tasksResult] = await Promise.all([
        // Get attendance count and hours
        supabase
          .from('staff_attendance')
          .select('hours_worked, status')
          .eq('staff_id', id),
        
        // Get payroll summary
        supabase
          .from('staff_payroll')
          .select('total_hours, total_pay')
          .eq('staff_id', id),
        
        // Get task completion stats
        supabase
          .from('staff_tasks')
          .select('status')
          .eq('staff_id', id)
      ]);

      // Calculate summary stats if data available
      let summaryStats = {
        total_hours_worked: data.total_hours_worked || 0,
        total_pay: 0,
        completed_tasks: 0,
        pending_tasks: 0,
        on_time_percentage: 0,
      };

      if (attendanceResult.data && attendanceResult.data.length > 0) {
        const totalHours = attendanceResult.data.reduce((sum, record) => 
          sum + (record.hours_worked || 0), 0);
        summaryStats.total_hours_worked = totalHours;
      }

      if (payrollResult.data && payrollResult.data.length > 0) {
        const totalPay = payrollResult.data.reduce((sum, record) => 
          sum + (record.total_pay || 0), 0);
        summaryStats.total_pay = totalPay;
      }

      if (tasksResult.data && tasksResult.data.length > 0) {
        const tasks = tasksResult.data;
        summaryStats.completed_tasks = tasks.filter(task => task.status === 'Completed').length;
        summaryStats.pending_tasks = tasks.filter(task => task.status === 'Pending').length;
        summaryStats.on_time_percentage = tasks.length > 0 
          ? Math.round((summaryStats.completed_tasks / tasks.length) * 100) 
          : 0;
      }
      
      // Merge the profile data with summary stats
      setStaffMember({ ...data, ...summaryStats } as StaffMember);
    } catch (err: any) {
      console.error('Error fetching staff profile:', err);
      setError(err.message || 'Failed to load staff profile');
      toast({
        title: "Error",
        description: `Failed to load staff profile: ${err.message}`,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Upload staff image to storage
  const uploadStaffImage = async (file: File): Promise<string | null> => {
    try {
      // Create a unique filename using UUID
      const fileExt = file.name.split('.').pop();
      const fileName = `${crypto.randomUUID()}.${fileExt}`;
      const filePath = `staff_profiles/${fileName}`;
      
      // Upload to staff_profiles bucket
      const { error: uploadError } = await supabase.storage
        .from('staff_profiles')
        .upload(filePath, file);
      
      if (uploadError) {
        console.error('Error uploading image:', uploadError);
        toast({
          title: "Error",
          description: `Failed to upload image: ${uploadError.message}`,
          variant: "destructive"
        });
        return null;
      }
      
      // Get the public URL
      const { data } = supabase.storage
        .from('staff_profiles')
        .getPublicUrl(filePath);
      
      return data.publicUrl;
    } catch (err: any) {
      console.error('Error in image upload:', err);
      toast({
        title: "Error",
        description: `Image upload failed: ${err.message}`,
        variant: "destructive"
      });
      return null;
    }
  };

  const updateStaffProfile = async (updates: Partial<StaffMember>, profileImage?: File | null) => {
    if (!id) return null;
    
    try {
      // Handle image upload if provided
      let imageUrl = updates.image_url;
      if (profileImage) {
        const uploadedUrl = await uploadStaffImage(profileImage);
        if (uploadedUrl) {
          imageUrl = uploadedUrl;
        }
      }
      
      const dataToUpdate = {
        ...updates,
        image_url: imageUrl
      };
      
      const { data, error } = await supabase
        .from('profiles')
        .update(dataToUpdate)
        .eq('id', id)
        .select()
        .single();
      
      if (error) {
        throw error;
      }
      
      // Update the local state with new data
      if (staffMember) {
        setStaffMember({ ...staffMember, ...data });
      }
      
      toast({
        title: "Success",
        description: "Profile updated successfully",
      });
      
      return data;
    } catch (err: any) {
      console.error('Error updating staff profile:', err);
      toast({
        title: "Error",
        description: `Failed to update profile: ${err.message}`,
        variant: "destructive"
      });
      return null;
    }
  };

  const deleteStaffProfile = async () => {
    try {
      const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      return { success: true };
    } catch (err: any) {
      console.error('Error deleting staff profile:', err);
      toast({
        title: "Error",
        description: `Failed to delete profile: ${err.message}`,
        variant: "destructive"
      });
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
