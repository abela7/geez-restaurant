
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type ChecklistTemplate = {
  id: string;
  name: string;
  role: string;
  frequency: string;
  required_time: string | null;
  created_at: string;
  updated_at: string;
};

export const useChecklistTemplates = (role?: string) => {
  return useQuery({
    queryKey: ["checklist-templates", role],
    queryFn: async (): Promise<ChecklistTemplate[]> => {
      let query = supabase
        .from("checklist_templates")
        .select("*")
        .order("name");
        
      if (role) {
        query = query.eq("role", role);
      }
      
      const { data, error } = await query;
      
      if (error) {
        console.error("Error fetching checklist templates:", error);
        throw error;
      }
      
      return data || [];
    },
  });
};
