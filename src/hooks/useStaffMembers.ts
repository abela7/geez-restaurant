
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { 
  fetchAllStaffMembers,
  addStaffMemberData,
  updateStaffMemberData,
  deleteStaffMemberData
} from "@/services/staff/staffService";
import { uploadStaffImage } from "@/utils/staffUtils";
import { handleApiError } from "@/utils/staffUtils";

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
  address: string | null;
  total_hours_worked: number | null;
  dishes_prepared: number | null;
  efficiency_rating: number | null;
  total_orders_completed: number | null;
  total_customers_served: number | null;
  username: string | null;
  password: string | null;
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
      const staffData = await fetchAllStaffMembers();
      setData(staffData);
    } catch (err: any) {
      const errorMessage = handleApiError(err, 'Failed to load staff data', toast);
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStaffData();
  }, []);

  const addStaffMember = async (staffData: Omit<StaffMember, 'id'>, profileImage?: File | null) => {
    setIsLoading(true);
    setError(null);
    try {
      const newStaffMember = await addStaffMemberData(staffData, profileImage);
      
      setData(prevData => [...prevData, newStaffMember as StaffMember]);
      toast({
        title: "Success",
        description: "Staff member added successfully",
      });
      
      return newStaffMember;
    } catch (err: any) {
      const errorMessage = handleApiError(err, 'Failed to add staff member', toast);
      setError(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const updateStaffMember = async (id: string, staffData: Partial<StaffMember>, profileImage?: File | null) => {
    setIsLoading(true);
    setError(null);
    try {
      const updatedStaffMember = await updateStaffMemberData(id, staffData, profileImage);
      
      setData(prevData => 
        prevData.map(staff => 
          staff.id === id ? { ...staff, ...updatedStaffMember } : staff
        )
      );
      
      toast({
        title: "Success",
        description: "Staff member updated successfully",
      });
      
      return updatedStaffMember;
    } catch (err: any) {
      const errorMessage = handleApiError(err, 'Failed to update staff member', toast);
      setError(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteStaffMember = async (id: string) => {
    setIsLoading(true);
    setError(null);
    try {
      await deleteStaffMemberData(id);
      
      setData(prevData => prevData.filter(staff => staff.id !== id));
      
      toast({
        title: "Success",
        description: "Staff member deleted successfully",
      });
      
      return true;
    } catch (err: any) {
      const errorMessage = handleApiError(err, 'Failed to delete staff member', toast);
      setError(errorMessage);
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
