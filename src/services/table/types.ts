
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
  room_id?: string;
  group_id?: string;
  location?: string;
  created_at?: string;
  updated_at?: string;
}

export interface TableWithDetails extends Table {
  currentGuests?: number;
  occupiedSince?: string;
  server?: string;
  reservedFor?: string;
  reservationTime?: string;
}

export type TableStatus = 'available' | 'occupied' | 'reserved' | 'cleaning';

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
