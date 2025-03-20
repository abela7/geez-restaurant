
import { supabase } from "@/integrations/supabase/client";
import { Table, Reservation } from "./types";

// Table functions
export const getTables = async (): Promise<Table[]> => {
  const { data, error } = await supabase
    .from('restaurant_tables')
    .select('*');
  
  if (error) {
    console.error('Error fetching tables:', error);
    throw error;
  }
  
  return (data || []) as Table[];
};

export const getTableById = async (id: string): Promise<Table | null> => {
  const { data, error } = await supabase
    .from('restaurant_tables')
    .select('*')
    .eq('id', id)
    .maybeSingle();
  
  if (error) {
    console.error('Error fetching table:', error);
    throw error;
  }
  
  return data as Table | null;
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

// Table statistics function
export const getTableStats = async (): Promise<{ 
  total: number;
  available: number;
  occupied: number;
  reserved: number;
  cleaning: number;
}> => {
  const { data, error } = await supabase
    .from('restaurant_tables')
    .select('status');
  
  if (error) {
    console.error('Error fetching table stats:', error);
    throw error;
  }
  
  const stats = {
    total: data.length,
    available: data.filter(t => t.status === 'available').length,
    occupied: data.filter(t => t.status === 'occupied').length,
    reserved: data.filter(t => t.status === 'reserved').length,
    cleaning: data.filter(t => t.status === 'cleaning').length,
  };
  
  return stats;
};
