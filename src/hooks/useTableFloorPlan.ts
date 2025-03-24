
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Table, Room } from "@/services/table/types";

export interface TableFloorPlanProps {
  tables: Table[];
  rooms: Room[];
  currentRoomId: string | null;
  isLoading: boolean;
  error: Error | null;
  updateTablePosition: (tableId: string, position_x: number, position_y: number) => Promise<void>;
  updateTableSize: (tableId: string, width: number, height: number) => Promise<void>;
  updateTableRotation: (tableId: string, rotation: number) => Promise<void>;
  changeRoom: (roomId: string | null) => void;
}

export const useTableFloorPlan = (): TableFloorPlanProps => {
  const [tables, setTables] = useState<Table[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [currentRoomId, setCurrentRoomId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Load tables and rooms
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // Load rooms first
        const { data: roomsData, error: roomsError } = await supabase
          .from('rooms')
          .select('*')
          .eq('active', true)
          .order('name');
        
        if (roomsError) throw roomsError;
        
        const activeRooms = roomsData as Room[];
        setRooms(activeRooms);
        
        // Set default room if none selected and rooms exist
        if (!currentRoomId && activeRooms.length > 0) {
          setCurrentRoomId(activeRooms[0].id);
        }
        
        // Then load tables for the current room or all tables
        let query = supabase.from('restaurant_tables').select('*');
        
        if (currentRoomId) {
          query = query.eq('room_id', currentRoomId);
        }
        
        const { data: tablesData, error: tablesError } = await query;
        
        if (tablesError) throw tablesError;
        
        setTables(tablesData as Table[]);
      } catch (err) {
        console.error("Error loading floor plan data:", err);
        setError(err instanceof Error ? err : new Error('Unknown error loading floor plan'));
        toast.error("Failed to load floor plan data");
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [currentRoomId]);

  // Update table position
  const updateTablePosition = async (tableId: string, position_x: number, position_y: number) => {
    try {
      const { data, error } = await supabase
        .from('restaurant_tables')
        .update({ position_x, position_y })
        .eq('id', tableId)
        .select()
        .single();
      
      if (error) throw error;
      
      setTables(prevTables => 
        prevTables.map(table => 
          table.id === tableId ? { ...table, position_x, position_y } : table
        )
      );
      
    } catch (err) {
      console.error("Error updating table position:", err);
      toast.error("Failed to update table position");
      throw err;
    }
  };

  // Update table size
  const updateTableSize = async (tableId: string, width: number, height: number) => {
    try {
      const { data, error } = await supabase
        .from('restaurant_tables')
        .update({ width, height })
        .eq('id', tableId)
        .select()
        .single();
      
      if (error) throw error;
      
      setTables(prevTables => 
        prevTables.map(table => 
          table.id === tableId ? { ...table, width, height } : table
        )
      );
      
    } catch (err) {
      console.error("Error updating table size:", err);
      toast.error("Failed to update table size");
      throw err;
    }
  };

  // Update table rotation
  const updateTableRotation = async (tableId: string, rotation: number) => {
    try {
      const { data, error } = await supabase
        .from('restaurant_tables')
        .update({ rotation })
        .eq('id', tableId)
        .select()
        .single();
      
      if (error) throw error;
      
      setTables(prevTables => 
        prevTables.map(table => 
          table.id === tableId ? { ...table, rotation } : table
        )
      );
      
    } catch (err) {
      console.error("Error updating table rotation:", err);
      toast.error("Failed to update table rotation");
      throw err;
    }
  };

  // Change current room
  const changeRoom = (roomId: string | null) => {
    setCurrentRoomId(roomId);
  };

  return {
    tables,
    rooms,
    currentRoomId,
    isLoading,
    error,
    updateTablePosition,
    updateTableSize,
    updateTableRotation,
    changeRoom
  };
};
