
export interface Room {
  id: string;
  name: string;
  description?: string;
  active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface Table {
  id: string;
  table_number: number;
  capacity: number;
  status: 'available' | 'occupied' | 'reserved' | 'cleaning';
  location?: string;
  room_id?: string;
  position_x?: number;
  position_y?: number;
  width?: number;
  height?: number;
  shape?: string;
  created_at?: string;
  updated_at?: string;
  room?: Room;
}

export interface TableWithDetails extends Table {
  currentGuests?: number;
  occupiedSince?: string;
  reservedFor?: string;
  reservationTime?: string;
  server?: string;
}

export interface Reservation {
  id: string;
  customer_id?: string;
  table_id?: string;
  reservation_date: string;
  start_time: string;
  end_time?: string;
  party_size: number;
  special_requests?: string;
  status: 'confirmed' | 'pending' | 'cancelled' | 'completed';
  created_at?: string;
  updated_at?: string;
  customer_name?: string;
  contact_number?: string;
  table_number?: number;
}
