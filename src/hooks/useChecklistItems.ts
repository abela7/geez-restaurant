
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type ChecklistItem = {
  id: string;
  template_id: string;
  description: string;
  requires_value: boolean;
  value_type: string | null;
  value_unit: string | null;
  display_order: number;
  created_at: string;
  updated_at: string;
};

export const useChecklistItems = (templateId: string | null) => {
  return useQuery({
    queryKey: ["checklist-items", templateId],
    queryFn: async (): Promise<ChecklistItem[]> => {
      if (!templateId) return [];
      
      const { data, error } = await supabase
        .from("checklist_items")
        .select("*")
        .eq("template_id", templateId)
        .order("display_order");
        
      if (error) {
        console.error("Error fetching checklist items:", error);
        throw error;
      }
      
      return data || [];
    },
    enabled: !!templateId,
  });
};
