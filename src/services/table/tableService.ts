import { supabase } from "@/integrations/supabase/client";
import { Table, TableWithDetails, Room, TableGuest, Reservation, TableGroup, TableLayout } from "./types";

// Table functions
export const getTables = async (): Promise<Table[]> => {
  const { data, error } = await supabase
    .from('restaurant_tables')
    .select('*, room:rooms(*), group:table_groups(*)');
  
  if (error) {
    console.error('Error fetching tables:', error);
    throw error;
  }
  
  return (data || []) as Table[];
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
  
  return (data || []) as Table[];
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
  
  return (data || []) as Table[];
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

// Room functions
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

// Table Group functions
export const getTableGroups = async (): Promise<TableGroup[]> => {
  const { data, error } = await supabase
    .from('table_groups')
    .select('*, room:rooms(*)')
    .order('name');
  
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
    .eq('room_id', roomId)
    .order('name');
  
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

// Table Guest functions
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

export const createTableGuest = async (guest: Omit<TableGuest, 'id' | 'created_at' | 'updated_at'>): Promise<TableGuest> => {
  // First, update the table status to occupied
  await updateTableStatus(guest.table_id, 'occupied');
  
  // Then create the guest record
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
  // Get the guest to get the table_id
  const { data: guest, error: guestError } = await supabase
    .from('table_guests')
    .select('table_id')
    .eq('id', id)
    .single();
  
  if (guestError) {
    console.error('Error fetching table guest:', guestError);
    throw guestError;
  }
  
  // Update the guest status to completed
  const { error: updateError } = await supabase
    .from('table_guests')
    .update({ status: 'completed' })
    .eq('id', id);
  
  if (updateError) {
    console.error('Error completing table guest:', updateError);
    throw updateError;
  }
  
  // Update table status to cleaning
  await updateTableStatus(guest.table_id, 'cleaning');
};

export const getTablesWithDetails = async (): Promise<TableWithDetails[]> => {
  // Get all tables
  const tables = await getTables();
  
  // Get active guests
  const { data: activeGuests, error: guestsError } = await supabase
    .from('table_guests')
    .select('*')
    .eq('status', 'seated');
  
  if (guestsError) {
    console.error('Error fetching active table guests:', guestsError);
    throw guestsError;
  }
  
  // Get reservations
  const { data: reservations, error: reservationsError } = await supabase
    .from('reservations')
    .select('*')
    .eq('status', 'confirmed');
  
  if (reservationsError) {
    console.error('Error fetching reservations:', reservationsError);
    throw reservationsError;
  }
  
  // Enhance tables with guest and reservation details
  const tablesWithDetails: TableWithDetails[] = tables.map(table => {
    const tableWithDetails: TableWithDetails = { ...table };
    
    // Find active guest for this table
    const activeGuest = activeGuests?.find(g => g.table_id === table.id);
    if (activeGuest && table.status === 'occupied') {
      tableWithDetails.currentGuests = activeGuest.guest_count;
      tableWithDetails.server = activeGuest.server_name;
      tableWithDetails.occupiedSince = new Date(activeGuest.seated_at).toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit' 
      });
    }
    
    // Find reservation for this table
    const reservation = reservations?.find(r => r.table_id === table.id);
    if (reservation && table.status === 'reserved') {
      // Only include reservation time, no customer info
      tableWithDetails.reservedFor = `${reservation.party_size} guests`;
      tableWithDetails.reservationTime = `${reservation.reservation_date} ${reservation.start_time}`;
    }
    
    return tableWithDetails;
  });
  
  return tablesWithDetails;
};

// Table Layout functions
export const getLayouts = async (): Promise<TableLayout[]> => {
  const { data, error } = await supabase
    .from('table_layouts')
    .select('*, room:rooms(*)')
    .order('name');
  
  if (error) {
    console.error('Error fetching layouts:', error);
    throw error;
  }
  
  return (data || []) as TableLayout[];
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
  
  return data as TableLayout | null;
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
    .update(layout)
    .eq('id', id)
    .select()
    .single();
  
  if (error) {
    console.error('Error updating layout:', error);
    throw error;
  }
  
  return data as TableLayout;
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
