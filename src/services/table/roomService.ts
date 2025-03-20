
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
  const { error } = await supabase
    .from('rooms')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error('Error deleting room:', error);
    throw error;
  }
};
