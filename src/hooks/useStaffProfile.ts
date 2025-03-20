
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
    setIsLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) {
        throw error;
      }
      
      setStaffMember(data as StaffMember);
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
  };
};

export default useStaffProfile;
