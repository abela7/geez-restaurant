
import { supabase } from "@/integrations/supabase/client";
import { Room } from "./types";

export const getRooms = async (): Promise<Room[]> => {
  const { data, error } = await supabase
    .from('rooms')
    .select('*')
    .order('name');
  
  if (error) {
    console.error('Error fetching rooms:', error);
    throw error;
  }
  
  return (data || []) as Room[];
};

export const getActiveRooms = async (): Promise<Room[]> => {
  const { data, error } = await supabase
    .from('rooms')
    .select('*')
    .eq('active', true)
    .order('name');
  
  if (error) {
    console.error('Error fetching active rooms:', error);
    throw error;
  }
  
  return (data || []) as Room[];
};

export const createRoom = async (room: Omit<Room, 'id' | 'created_at' | 'updated_at'>): Promise<Room> => {
  const { data, error } = await supabase
    .from('rooms')
    .insert(room)
    .select()
    .single();
  
  if (error) {
    console.error('Error creating room:', error);
    throw error;
  }
  
  return data as Room;
};

export const updateRoom = async (id: string, room: Partial<Room>): Promise<Room> => {
  const { data, error } = await supabase
    .from('rooms')
    .update(room)
    .eq('id', id)
    .select()
    .single();
  
  if (error) {
    console.error('Error updating room:', error);
    throw error;
  }
  
  return data as Room;
};

export const deleteRoom = async (id: string): Promise<void> => {
  // First check if this room is referenced by any table groups
  const { data: tableGroups, error: tableGroupsError } = await supabase
    .from('table_groups')
    .select('id')
    .eq('room_id', id)
    .limit(1);
  
  if (tableGroupsError) {
    console.error('Error checking table groups for room:', tableGroupsError);
    throw tableGroupsError;
  }
  
  if (tableGroups && tableGroups.length > 0) {
    throw new Error('Cannot delete this room because it has associated table groups. Please remove the table groups first.');
  }
  
  // Next check if this room is referenced by any tables
  const { data: tables, error: tablesError } = await supabase
    .from('restaurant_tables')
    .select('id')
    .eq('room_id', id)
    .limit(1);
  
  if (tablesError) {
    console.error('Error checking tables for room:', tablesError);
    throw tablesError;
  }
  
  if (tables && tables.length > 0) {
    throw new Error('Cannot delete this room because it has associated tables. Please move or remove the tables first.');
  }
  
  // If no references exist, proceed with deletion
  const { error } = await supabase
    .from('rooms')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error('Error deleting room:', error);
    throw error;
  }
};
