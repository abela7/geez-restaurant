
import { supabase } from "@/integrations/supabase/client";
import type { StaffMember } from "@/hooks/useStaffMembers";
import { uploadStaffImage } from "@/utils/staffUtils";
import * as bcrypt from 'bcryptjs';

/**
 * Fetches all staff profiles
 */
export const fetchAllStaffMembers = async () => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*');
  
  if (error) throw error;
  return data as StaffMember[] || [];
};

/**
 * Creates a new staff member
 */
export const addStaffMemberData = async (staffData: Omit<StaffMember, 'id'>, profileImage?: File | null) => {
  // Handle image upload if provided
  let imageUrl = staffData.image_url;
  if (profileImage) {
    const uploadedUrl = await uploadStaffImage(profileImage);
    if (uploadedUrl) {
      imageUrl = uploadedUrl;
    }
  }
  
  // Hash password if provided
  let hashedPassword = staffData.password;
  if (staffData.password) {
    hashedPassword = await bcrypt.hash(staffData.password, 10);
  }
  
  const dataToInsert = {
    ...staffData,
    image_url: imageUrl,
    password: hashedPassword
  };
  
  const { data, error } = await supabase
    .from('profiles')
    .insert([dataToInsert])
    .select();
  
  if (error) throw error;
  return data[0];
};

/**
 * Updates a staff member
 */
export const updateStaffMemberData = async (id: string, staffData: Partial<StaffMember>, profileImage?: File | null) => {
  // Handle image upload if provided
  let imageUrl = staffData.image_url;
  if (profileImage) {
    const uploadedUrl = await uploadStaffImage(profileImage);
    if (uploadedUrl) {
      imageUrl = uploadedUrl;
    }
  }
  
  // Hash password if provided and changed
  let hashedPassword = staffData.password;
  if (staffData.password && staffData.password.length > 0) {
    hashedPassword = await bcrypt.hash(staffData.password, 10);
  }
  
  const dataToUpdate = {
    ...staffData,
    image_url: imageUrl,
    password: hashedPassword
  };
  
  const { data, error } = await supabase
    .from('profiles')
    .update(dataToUpdate)
    .eq('id', id)
    .select();
  
  if (error) throw error;
  return data[0];
};

/**
 * Deletes a staff member
 */
export const deleteStaffMemberData = async (id: string) => {
  const { error } = await supabase
    .from('profiles')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
  return true;
};
