
import { supabase } from "@/integrations/supabase/client";
import { TableGroup } from "./types";

export const getTableGroups = async (): Promise<TableGroup[]> => {
  const { data, error } = await supabase
    .from('table_groups')
    .select('*, room:rooms(*)');
  
  if (error) {
    console.error('Error fetching table groups:', error);
    throw error;
  }
  
  return (data || []) as TableGroup[];
};

export const getTableGroupsByRoomId = async (roomId: string): Promise<TableGroup[]> => {
  const { data, error } = await supabase
    .from('table_groups')
    .select('*, room:rooms(*)')
    .eq('room_id', roomId);
  
  if (error) {
    console.error('Error fetching table groups by room:', error);
    throw error;
  }
  
  return (data || []) as TableGroup[];
};

export const createTableGroup = async (group: Omit<TableGroup, 'id' | 'created_at' | 'updated_at'>): Promise<TableGroup> => {
  const { data, error } = await supabase
    .from('table_groups')
    .insert(group)
    .select()
    .single();
  
  if (error) {
    console.error('Error creating table group:', error);
    throw error;
  }
  
  return data as TableGroup;
};

export const updateTableGroup = async (id: string, group: Partial<TableGroup>): Promise<TableGroup> => {
  const { data, error } = await supabase
    .from('table_groups')
    .update(group)
    .eq('id', id)
    .select()
    .single();
  
  if (error) {
    console.error('Error updating table group:', error);
    throw error;
  }
  
  return data as TableGroup;
};

export const deleteTableGroup = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('table_groups')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error('Error deleting table group:', error);
    throw error;
  }
};
