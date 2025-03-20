
import { supabase } from "@/integrations/supabase/client";
import { Room, Table, Reservation } from "./types";

// Room functions
export const getRooms = async (): Promise<Room[]> => {
  // Use type assertion to bypass TypeScript checking for table names
  const { data, error } = await (supabase as any)
    .from('rooms')
    .select('*')
    .order('name');
  
  if (error) {
    console.error('Error fetching rooms:', error);
    throw error;
  }
  
  return (data || []) as unknown as Room[];
};

export const getRoomById = async (id: string): Promise<Room | null> => {
  const { data, error } = await (supabase as any)
    .from('rooms')
    .select('*')
    .eq('id', id)
    .maybeSingle();
  
  if (error) {
    console.error('Error fetching room:', error);
    throw error;
  }
  
  return data as unknown as Room | null;
};

export const createRoom = async (room: Omit<Room, 'id' | 'created_at' | 'updated_at'>): Promise<Room> => {
  const { data, error } = await (supabase as any)
    .from('rooms')
    .insert(room)
    .select()
    .single();
  
  if (error) {
    console.error('Error creating room:', error);
    throw error;
  }
  
  return data as unknown as Room;
};

export const updateRoom = async (id: string, room: Partial<Room>): Promise<Room> => {
  const { data, error } = await (supabase as any)
    .from('rooms')
    .update(room)
    .eq('id', id)
    .select()
    .single();
  
  if (error) {
    console.error('Error updating room:', error);
    throw error;
  }
  
  return data as unknown as Room;
};

export const deleteRoom = async (id: string): Promise<void> => {
  const { error } = await (supabase as any)
    .from('rooms')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error('Error deleting room:', error);
    throw error;
  }
};

// Table functions
export const getTables = async (): Promise<Table[]> => {
  const { data, error } = await supabase
    .from('restaurant_tables')
    .select('*');
  
  if (error) {
    console.error('Error fetching tables:', error);
    throw error;
  }
  
  return (data || []) as unknown as Table[];
};

export const getTablesByRoom = async (roomId: string): Promise<Table[]> => {
  // Using direct type assertion to avoid excessive type instantiation
  const { data, error } = await supabase
    .from('restaurant_tables')
    .select('*')
    .eq('room_id', roomId)
    .order('table_number');
  
  if (error) {
    console.error('Error fetching tables by room:', error);
    throw error;
  }
  
  return (data || []) as any;
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
  
  return data as unknown as Table;
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
  
  return data as unknown as Table;
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
  
  return data as unknown as Table;
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

// Reservation functions
export const getReservations = async (): Promise<Reservation[]> => {
  const { data, error } = await supabase
    .from('reservations')
    .select('*, table:table_id(table_number)')
    .order('reservation_date', { ascending: true })
    .order('start_time', { ascending: true });
  
  if (error) {
    console.error('Error fetching reservations:', error);
    throw error;
  }
  
  return (data || []) as any;
};

export const getReservationsByDate = async (date: string): Promise<Reservation[]> => {
  const { data, error } = await supabase
    .from('reservations')
    .select('*, table:table_id(table_number)')
    .eq('reservation_date', date)
    .order('start_time', { ascending: true });
  
  if (error) {
    console.error('Error fetching reservations by date:', error);
    throw error;
  }
  
  return (data || []) as any;
};

export const getReservationById = async (id: string): Promise<Reservation | null> => {
  const { data, error } = await supabase
    .from('reservations')
    .select('*, table:table_id(table_number)')
    .eq('id', id)
    .maybeSingle();
  
  if (error) {
    console.error('Error fetching reservation:', error);
    throw error;
  }
  
  return data as any;
};

export const createReservation = async (reservation: Omit<Reservation, 'id' | 'created_at' | 'updated_at'>): Promise<Reservation> => {
  const { data, error } = await supabase
    .from('reservations')
    .insert(reservation)
    .select()
    .single();
  
  if (error) {
    console.error('Error creating reservation:', error);
    throw error;
  }
  
  return data as any;
};

export const updateReservation = async (id: string, reservation: Partial<Reservation>): Promise<Reservation> => {
  const { data, error } = await supabase
    .from('reservations')
    .update(reservation)
    .eq('id', id)
    .select()
    .single();
  
  if (error) {
    console.error('Error updating reservation:', error);
    throw error;
  }
  
  return data as any;
};

export const deleteReservation = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('reservations')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error('Error deleting reservation:', error);
    throw error;
  }
};

// Table layout functions
export const updateTablePosition = async (id: string, position_x: number, position_y: number): Promise<Table> => {
  const updateData = { 
    position_x, 
    position_y 
  } as any;
  
  const { data, error } = await supabase
    .from('restaurant_tables')
    .update(updateData)
    .eq('id', id)
    .select()
    .single();
  
  if (error) {
    console.error('Error updating table position:', error);
    throw error;
  }
  
  return data as any;
};

export const updateTableDimensions = async (id: string, width: number, height: number): Promise<Table> => {
  const updateData = { 
    width, 
    height 
  } as any;
  
  const { data, error } = await supabase
    .from('restaurant_tables')
    .update(updateData)
    .eq('id', id)
    .select()
    .single();
  
  if (error) {
    console.error('Error updating table dimensions:', error);
    throw error;
  }
  
  return data as any;
};

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
