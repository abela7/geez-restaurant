
import { supabase } from "@/integrations/supabase/client";
import { TableLayout } from "./types";

export const getLayouts = async (): Promise<TableLayout[]> => {
  const { data, error } = await supabase
    .from('table_layouts')
    .select('*, room:rooms(*)');
  
  if (error) {
    console.error('Error fetching layouts:', error);
    throw error;
  }
  
  return (data || []) as unknown as TableLayout[];
};

export const getActiveLayout = async (roomId?: string): Promise<TableLayout | null> => {
  let query = supabase
    .from('table_layouts')
    .select('*, room:rooms(*)')
    .eq('is_active', true);
    
  if (roomId) {
    query = query.eq('room_id', roomId);
  }
  
  const { data, error } = await query.maybeSingle();
  
  if (error) {
    console.error('Error fetching active layout:', error);
    throw error;
  }
  
  return data as unknown as TableLayout | null;
};

export const createLayout = async (layout: Omit<TableLayout, 'id' | 'created_at' | 'updated_at'>): Promise<TableLayout> => {
  const { data, error } = await supabase
    .from('table_layouts')
    .insert(layout)
    .select()
    .single();
  
  if (error) {
    console.error('Error creating layout:', error);
    throw error;
  }
  
  return data as TableLayout;
};

export const updateLayout = async (id: string, layout: Partial<TableLayout>): Promise<TableLayout> => {
  const { data, error } = await supabase
    .from('table_layouts')
    .update({
      name: layout.name,
      room_id: layout.room_id,
      is_active: layout.is_active
    })
    .eq('id', id)
    .select()
    .single();
  
  if (error) {
    console.error('Error updating layout:', error);
    throw error;
  }
  
  return data as unknown as TableLayout;
};

export const activateLayout = async (id: string, roomId?: string): Promise<void> => {
  // First, deactivate all existing active layouts for the room
  let deactivateQuery = supabase
    .from('table_layouts')
    .update({ is_active: false });
    
  if (roomId) {
    deactivateQuery = deactivateQuery.eq('room_id', roomId);
  }
  
  const { error: deactivateError } = await deactivateQuery;
  
  if (deactivateError) {
    console.error('Error deactivating layouts:', deactivateError);
    throw deactivateError;
  }
  
  // Then, activate the specified layout
  const { error: activateError } = await supabase
    .from('table_layouts')
    .update({ is_active: true })
    .eq('id', id);
  
  if (activateError) {
    console.error('Error activating layout:', activateError);
    throw activateError;
  }
};

export const deleteLayout = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('table_layouts')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error('Error deleting layout:', error);
    throw error;
  }
};
