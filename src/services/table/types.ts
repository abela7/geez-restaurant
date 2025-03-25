
export interface Table {
  id: string;
  table_number: number;
  capacity: number;
  status: TableStatus;
  position_x?: number;
  position_y?: number;
  width?: number;
  height?: number;
  rotation?: number;
  shape?: 'rectangle' | 'circle' | 'square';
  room_id?: string | null;
  group_id?: string | null;
  location?: string;
  created_at?: string;
  updated_at?: string;
  room?: Room | null;
}

export interface TableWithDetails extends Table {
  currentGuests?: number;
  occupiedSince?: string;
  server?: string;
  reservedFor?: string;
  reservationTime?: string;
}

export type TableStatus = 'available' | 'occupied' | 'reserved' | 'cleaning' | 'inactive';

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
  room_id?: string | null;
  room?: Room;
  created_at?: string;
  updated_at?: string;
}

export interface TableStats {
  total: number;
  available: number;
  occupied: number;
  reserved: number;
  cleaning: number;
}

export interface TableGuest {
  id: string;
  table_id: string;
  guest_count: number;
  server_name?: string;
  notes?: string;
  status: 'seated' | 'completed';
  seated_at?: string;
  created_at?: string;
  updated_at?: string;
}
