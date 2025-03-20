
import { supabase } from "@/integrations/supabase/client";
import { TableWithDetails } from "./types";
import { getTables } from "./tableService";

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
