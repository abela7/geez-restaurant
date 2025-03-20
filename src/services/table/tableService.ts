
import { supabase } from "@/integrations/supabase/client";
import { Table } from "./types";

// Table functions
export const getTables = async (): Promise<Table[]> => {
  const { data, error } = await supabase
    .from('restaurant_tables')
    .select('*, room:rooms(*), group:table_groups(*)');
  
  if (error) {
    console.error('Error fetching tables:', error);
    throw error;
  }
  
  return (data || []) as unknown as Table[];
};

export const getTablesByRoomId = async (roomId: string): Promise<Table[]> => {
  const { data, error } = await supabase
    .from('restaurant_tables')
    .select('*, room:rooms(*), group:table_groups(*)')
    .eq('room_id', roomId);
  
  if (error) {
    console.error('Error fetching tables by room:', error);
    throw error;
  }
  
  return (data || []) as unknown as Table[];
};

export const getTablesByGroupId = async (groupId: string): Promise<Table[]> => {
  const { data, error } = await supabase
    .from('restaurant_tables')
    .select('*, room:rooms(*), group:table_groups(*)')
    .eq('group_id', groupId);
  
  if (error) {
    console.error('Error fetching tables by group:', error);
    throw error;
  }
  
  return (data || []) as unknown as Table[];
};

export const getTableById = async (id: string): Promise<Table | null> => {
  const { data, error } = await supabase
    .from('restaurant_tables')
    .select('*, room:rooms(*), group:table_groups(*)')
    .eq('id', id)
    .maybeSingle();
  
  if (error) {
    console.error('Error fetching table:', error);
    throw error;
  }
  
  return data as unknown as Table | null;
};

export const createTable = async (table: Omit<Table, 'id' | 'created_at' | 'updated_at'>): Promise<Table> => {
  const { data, error } = await supabase
    .from('restaurant_tables')
    .insert(table)
    .select()
    .single();
  
  if (error) {
    console.error('Error creating table:', error);
    throw error;
  }
  
  return data as Table;
};

export const updateTable = async (id: string, table: Partial<Table>): Promise<Table> => {
  const { data, error } = await supabase
    .from('restaurant_tables')
    .update(table)
    .eq('id', id)
    .select()
    .single();
  
  if (error) {
    console.error('Error updating table:', error);
    throw error;
  }
  
  return data as Table;
};

export const updateTableStatus = async (id: string, status: Table['status']): Promise<Table> => {
  const { data, error } = await supabase
    .from('restaurant_tables')
    .update({ status })
    .eq('id', id)
    .select()
    .single();
  
  if (error) {
    console.error('Error updating table status:', error);
    throw error;
  }
  
  return data as Table;
};

export const moveTable = async (id: string, position_x: number, position_y: number): Promise<Table> => {
  const { data, error } = await supabase
    .from('restaurant_tables')
    .update({ position_x, position_y })
    .eq('id', id)
    .select()
    .single();
  
  if (error) {
    console.error('Error moving table:', error);
    throw error;
  }
  
  return data as Table;
};

export const resizeTable = async (id: string, width: number, height: number): Promise<Table> => {
  const { data, error } = await supabase
    .from('restaurant_tables')
    .update({ width, height })
    .eq('id', id)
    .select()
    .single();
  
  if (error) {
    console.error('Error resizing table:', error);
    throw error;
  }
  
  return data as Table;
};

export const rotateTable = async (id: string, rotation: number): Promise<Table> => {
  const { data, error } = await supabase
    .from('restaurant_tables')
    .update({ rotation })
    .eq('id', id)
    .select()
    .single();
  
  if (error) {
    console.error('Error rotating table:', error);
    throw error;
  }
  
  return data as Table;
};

export const changeTableShape = async (id: string, shape: Table['shape']): Promise<Table> => {
  const { data, error } = await supabase
    .from('restaurant_tables')
    .update({ shape })
    .eq('id', id)
    .select()
    .single();
  
  if (error) {
    console.error('Error changing table shape:', error);
    throw error;
  }
  
  return data as Table;
};

export const deleteTable = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('restaurant_tables')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error('Error deleting table:', error);
    throw error;
  }
};

// Re-export all the other services
export * from './roomService';
export * from './tableGroupService';
export * from './tableGuestService';
export * from './layoutService';
export * from './tableStatsService';
export * from './tableDetailsService';
