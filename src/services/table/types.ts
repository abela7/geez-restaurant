
export interface Room {
  id: string;
  name: string;
  description?: string;
  active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface TableGroup {
  id: string;
  name: string;
  description?: string;
  room_id?: string;
  created_at?: string;
  updated_at?: string;
  room?: Room;
}

export interface Table {
  id: string;
  table_number: number;
  capacity: number;
  status: 'available' | 'occupied' | 'reserved' | 'cleaning';
  location?: string;
  room_id?: string;
  group_id?: string;
  position_x?: number;
  position_y?: number;
  width?: number;
  height?: number;
  shape?: 'rectangle' | 'circle' | 'square' | 'oval';
  rotation?: number;
  created_at?: string;
  updated_at?: string;
  room?: Room;
  group?: TableGroup;
}

export interface TableWithDetails extends Table {
  currentGuests?: number;
  occupiedSince?: string;
  server?: string;
  reservedFor?: string;
  reservationTime?: string;
}

export interface TableGuest {
  id: string;
  table_id: string;
  guest_count: number;
  server_name?: string;
  seated_at?: string;
  status: 'seated' | 'completed' | 'cancelled';
  notes?: string;
  created_at?: string;
  updated_at?: string;
  table?: {
    table_number: number;
    [key: string]: any;
  };
}

export interface Reservation {
  id: string;
  table_id?: string;
  reservation_date: string;
  start_time: string;
  end_time?: string;
  party_size: number;
  special_requests?: string;
  status: 'confirmed' | 'pending' | 'cancelled' | 'completed';
  created_at?: string;
  updated_at?: string;
  table_number?: number;
  table?: {
    table_number: number;
    [key: string]: any;
  };
}

export interface TableLayout {
  id: string;
  name: string;
  room_id?: string;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
  room?: Room;
}
