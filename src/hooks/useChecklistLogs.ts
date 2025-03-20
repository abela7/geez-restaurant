
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type ChecklistLog = {
  id: string;
  template_id: string;
  completed_by: string;
  completed_at: string;
  notes: string | null;
  created_at: string;
  updated_at: string;
};

export type ChecklistItemLog = {
  id: string;
  checklist_log_id: string;
  checklist_item_id: string;
  value: string | null;
  is_compliant: boolean;
  notes: string | null;
  created_at: string;
  updated_at: string;
};

export type ChecklistLogWithItems = ChecklistLog & {
  items: ChecklistItemLog[];
};

export const useChecklistLogs = (templateId?: string, staffId?: string) => {
  return useQuery({
    queryKey: ["checklist-logs", templateId, staffId],
    queryFn: async (): Promise<ChecklistLog[]> => {
      let query = supabase
        .from("checklist_logs")
        .select("*")
        .order("completed_at", { ascending: false });
      
      if (templateId) {
        query = query.eq("template_id", templateId);
      }
      
      if (staffId) {
        query = query.eq("completed_by", staffId);
      }
      
      const { data, error } = await query;
      
      if (error) {
        console.error("Error fetching checklist logs:", error);
        throw error;
      }
      
      return data || [];
    },
    enabled: !!(templateId || staffId),
  });
};

export const useChecklistItemLogs = (checklistLogId: string | null) => {
  return useQuery({
    queryKey: ["checklist-item-logs", checklistLogId],
    queryFn: async (): Promise<ChecklistItemLog[]> => {
      if (!checklistLogId) return [];
      
      const { data, error } = await supabase
        .from("checklist_item_logs")
        .select("*")
        .eq("checklist_log_id", checklistLogId);
        
      if (error) {
        console.error("Error fetching checklist item logs:", error);
        throw error;
      }
      
      return data || [];
    },
    enabled: !!checklistLogId,
  });
};

type SubmitChecklistParams = {
  templateId: string;
  staffId: string;
  notes?: string;
  items: {
    itemId: string;
    value?: string;
    isCompliant: boolean;
    notes?: string;
  }[];
};

export const useSubmitChecklist = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (params: SubmitChecklistParams) => {
      const { templateId, staffId, notes, items } = params;
      
      // Step 1: Create the checklist log
      const { data: logData, error: logError } = await supabase
        .from("checklist_logs")
        .insert([{
          template_id: templateId,
          completed_by: staffId,
          notes: notes || null
        }])
        .select("id")
        .single();
        
      if (logError) {
        console.error("Error creating checklist log:", logError);
        throw logError;
      }
      
      const checklistLogId = logData.id;
      
      // Step 2: Create all the checklist item logs
      const itemLogs = items.map(item => ({
        checklist_log_id: checklistLogId,
        checklist_item_id: item.itemId,
        value: item.value || null,
        is_compliant: item.isCompliant,
        notes: item.notes || null
      }));
      
      const { error: itemsError } = await supabase
        .from("checklist_item_logs")
        .insert(itemLogs);
        
      if (itemsError) {
        console.error("Error creating checklist item logs:", itemsError);
        throw itemsError;
      }
      
      return { success: true, checklistLogId };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["checklist-logs"] });
    },
  });
};
