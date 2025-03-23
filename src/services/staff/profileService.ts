
import { supabase } from "@/integrations/supabase/client";
import type { StaffMember } from "@/hooks/useStaffMembers";
import { uploadStaffImage } from "@/utils/staffUtils";

/**
 * Fetches a staff profile by ID
 */
export const fetchStaffProfileById = async (id: string) => {
  // Get the staff profile details
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data;
};

/**
 * Fetches attendance stats for a staff member
 */
export const fetchAttendanceStats = async (staffId: string) => {
  const { data, error } = await supabase
    .from('staff_attendance')
    .select('hours_worked, status')
    .eq('staff_id', staffId);
  
  if (error) throw error;
  return data;
};

/**
 * Fetches payroll data for a staff member
 */
export const fetchPayrollData = async (staffId: string) => {
  const { data, error } = await supabase
    .from('staff_payroll')
    .select('total_hours, total_pay')
    .eq('staff_id', staffId);
  
  if (error) throw error;
  return data;
};

/**
 * Fetches task stats for a staff member
 */
export const fetchTaskStats = async (staffId: string) => {
  const { data, error } = await supabase
    .from('staff_tasks')
    .select('status')
    .eq('staff_id', staffId);
  
  if (error) throw error;
  return data;
};

/**
 * Updates a staff profile
 */
export const updateStaffProfileData = async (id: string, updates: Partial<StaffMember>, profileImage?: File | null) => {
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
  
  if (error) throw error;
  return data;
};

/**
 * Deletes a staff profile
 */
export const deleteStaffProfileData = async (id: string) => {
  const { error } = await supabase
    .from('profiles')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
  return { success: true };
};
