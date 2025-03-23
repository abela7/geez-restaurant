
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export type StaffMember = {
  id: string;
  first_name: string | null;
  last_name: string | null;
  email: string | null;
  phone: string | null;
  role: string;
  department: string | null;
  attendance: string | null;
  performance: number | null;
  hourly_rate: number | null;
  image_url: string | null;
  bio: string | null;
  skills: string[] | null;
  start_date: string | null;
  // Address field that was missing
  address: string | null;
  // New fields
  total_hours_worked: number | null;
  dishes_prepared: number | null;
  efficiency_rating: number | null;
  total_orders_completed: number | null;
  total_customers_served: number | null;
  // Summary stats from related tables (not in the DB)
  total_pay?: number;
  completed_tasks?: number;
  pending_tasks?: number;
  on_time_percentage?: number;
};

export const useStaffMembers = () => {
  const [data, setData] = useState<StaffMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchStaffData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*');
      
      if (error) {
        throw error;
      }
      
      setData(data as StaffMember[] || []);
    } catch (err: any) {
      console.error('Error fetching staff:', err);
      setError(err.message || 'Failed to load staff data');
      toast({
        title: "Error",
        description: `Failed to load staff data: ${err.message}`,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStaffData();
  }, []);

  // Upload staff image to storage
  const uploadStaffImage = async (file: File): Promise<string | null> => {
    try {
      // Create a unique filename using UUID
      const fileExt = file.name.split('.').pop();
      const fileName = `${crypto.randomUUID()}.${fileExt}`;
      const filePath = `${fileName}`;
      
      // Upload to staff_profiles bucket
      const { error: uploadError, data: uploadData } = await supabase.storage
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

  const addStaffMember = async (staffData: Omit<StaffMember, 'id'>, profileImage?: File | null) => {
    setIsLoading(true);
    setError(null);
    try {
      // Handle image upload if provided
      let imageUrl = staffData.image_url;
      if (profileImage) {
        const uploadedUrl = await uploadStaffImage(profileImage);
        if (uploadedUrl) {
          imageUrl = uploadedUrl;
        }
      }
      
      const dataToInsert = {
        ...staffData,
        image_url: imageUrl
      };
      
      const { data, error } = await supabase
        .from('profiles')
        .insert([dataToInsert])
        .select();
      
      if (error) {
        throw error;
      }
      
      setData(prevData => [...prevData, ...(data as StaffMember[])]);
      toast({
        title: "Success",
        description: "Staff member added successfully",
      });
      
      return data[0];
    } catch (err: any) {
      console.error('Error adding staff:', err);
      setError(err.message || 'Failed to add staff member');
      toast({
        title: "Error",
        description: `Failed to add staff member: ${err.message}`,
        variant: "destructive"
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const updateStaffMember = async (id: string, staffData: Partial<StaffMember>, profileImage?: File | null) => {
    setIsLoading(true);
    setError(null);
    try {
      // Handle image upload if provided
      let imageUrl = staffData.image_url;
      if (profileImage) {
        const uploadedUrl = await uploadStaffImage(profileImage);
        if (uploadedUrl) {
          imageUrl = uploadedUrl;
        }
      }
      
      const dataToUpdate = {
        ...staffData,
        image_url: imageUrl
      };
      
      const { data, error } = await supabase
        .from('profiles')
        .update(dataToUpdate)
        .eq('id', id)
        .select();
      
      if (error) {
        throw error;
      }
      
      setData(prevData => 
        prevData.map(staff => 
          staff.id === id ? { ...staff, ...data[0] } : staff
        )
      );
      
      toast({
        title: "Success",
        description: "Staff member updated successfully",
      });
      
      return data[0];
    } catch (err: any) {
      console.error('Error updating staff:', err);
      setError(err.message || 'Failed to update staff member');
      toast({
        title: "Error",
        description: `Failed to update staff member: ${err.message}`,
        variant: "destructive"
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteStaffMember = async (id: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', id);
      
      if (error) {
        throw error;
      }
      
      setData(prevData => prevData.filter(staff => staff.id !== id));
      
      toast({
        title: "Success",
        description: "Staff member deleted successfully",
      });
      
      return true;
    } catch (err: any) {
      console.error('Error deleting staff:', err);
      setError(err.message || 'Failed to delete staff member');
      toast({
        title: "Error",
        description: `Failed to delete staff member: ${err.message}`,
        variant: "destructive"
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    data,
    isLoading,
    error,
    fetchStaffData,
    addStaffMember,
    updateStaffMember,
    deleteStaffMember,
    uploadStaffImage
  };
};

export default useStaffMembers;
