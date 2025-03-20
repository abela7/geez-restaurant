
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
};

export const useStaffMembers = () => {
  const [staffMembers, setStaffMembers] = useState<StaffMember[]>([]);
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
      
      setStaffMembers(data as StaffMember[] || []);
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

  return {
    staffMembers,
    isLoading,
    error,
    fetchStaffData,
  };
};

export default useStaffMembers;
