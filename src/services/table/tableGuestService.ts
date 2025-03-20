
import { supabase } from "@/integrations/supabase/client";
import { TableGuest, Table } from "./types";
import { updateTableStatus, deleteTable } from "./tableService";

export const getTableGuests = async (): Promise<TableGuest[]> => {
  const { data, error } = await supabase
    .from('table_guests')
    .select('*, table:restaurant_tables(table_number, capacity)')
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('Error fetching table guests:', error);
    throw error;
  }
  
  return (data || []) as TableGuest[];
};

export const getActiveTableGuests = async (): Promise<TableGuest[]> => {
  const { data, error } = await supabase
    .from('table_guests')
    .select('*, table:restaurant_tables(table_number, capacity)')
    .eq('status', 'seated')
    .order('seated_at', { ascending: false });
  
  if (error) {
    console.error('Error fetching active table guests:', error);
    throw error;
  }
  
  return (data || []) as TableGuest[];
};

export const getTableGuestsByTableId = async (tableId: string): Promise<TableGuest[]> => {
  const { data, error } = await supabase
    .from('table_guests')
    .select('*')
    .eq('table_id', tableId)
    .order('seated_at', { ascending: false });
  
  if (error) {
    console.error('Error fetching table guests by table ID:', error);
    throw error;
  }
  
  return (data || []) as TableGuest[];
};

export const getActiveTableGuestByTableId = async (tableId: string): Promise<TableGuest | null> => {
  const { data, error } = await supabase
    .from('table_guests')
    .select('*')
    .eq('table_id', tableId)
    .eq('status', 'seated')
    .maybeSingle();
  
  if (error) {
    console.error('Error fetching active table guest:', error);
    throw error;
  }
  
  return data as TableGuest | null;
};

export const createTableGuest = async (guest: { table_id: string; guest_count: number; server_name?: string; notes?: string; status?: 'seated' | 'completed'; seated_at?: string; }): Promise<TableGuest> => {
  await updateTableStatus(guest.table_id, 'occupied');
  
  const { data, error } = await supabase
    .from('table_guests')
    .insert(guest)
    .select()
    .single();
  
  if (error) {
    console.error('Error creating table guest:', error);
    throw error;
  }
  
  return data as TableGuest;
};

export const updateTableGuest = async (id: string, guest: Partial<TableGuest>): Promise<TableGuest> => {
  const { data, error } = await supabase
    .from('table_guests')
    .update(guest)
    .eq('id', id)
    .select()
    .single();
  
  if (error) {
    console.error('Error updating table guest:', error);
    throw error;
  }
  
  return data as TableGuest;
};

export const completeTableGuest = async (id: string): Promise<void> => {
  const { data: guest, error: guestError } = await supabase
    .from('table_guests')
    .select('table_id')
    .eq('id', id)
    .single();
  
  if (guestError) {
    console.error('Error fetching table guest:', guestError);
    throw guestError;
  }
  
  const { error: updateError } = await supabase
    .from('table_guests')
    .update({ status: 'completed' })
    .eq('id', id);
  
  if (updateError) {
    console.error('Error completing table guest:', updateError);
    throw updateError;
  }
  
  await updateTableStatus(guest.table_id, 'cleaning');
};

export const completeTemporaryTable = async (tableId: string): Promise<void> => {
  try {
    const { data: table, error: tableError } = await supabase
      .from('restaurant_tables')
      .select('*')
      .eq('id', tableId)
      .eq('location', 'temporary')
      .maybeSingle();
    
    if (tableError) {
      console.error('Error fetching temporary table:', tableError);
      throw tableError;
    }
    
    if (!table) {
      throw new Error('Table is not a temporary table');
    }
    
    const activeGuest = await getActiveTableGuestByTableId(tableId);
    
    if (activeGuest) {
      await updateTableGuest(activeGuest.id, { status: 'completed' });
    }
    
    await deleteTable(tableId);
  } catch (error) {
    console.error('Error completing temporary table:', error);
    throw error;
  }
};

export const checkTemporaryTableUsage = async (): Promise<Table[]> => {
  try {
    const { data, error } = await supabase
      .from('restaurant_tables')
      .select('*')
      .eq('location', 'temporary');
    
    if (error) {
      console.error('Error fetching temporary tables:', error);
      throw error;
    }
    
    return data as Table[];
  } catch (error) {
    console.error('Error checking temporary tables:', error);
    throw error;
  }
};
