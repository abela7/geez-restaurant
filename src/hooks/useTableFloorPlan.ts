
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
  saveChanges: () => Promise<void>;
  hasUnsavedChanges: boolean;
}

export const useTableFloorPlan = (): TableFloorPlanProps => {
  const [tables, setTables] = useState<Table[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [currentRoomId, setCurrentRoomId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [modifiedTables, setModifiedTables] = useState<{[key: string]: Partial<Table>}>({});

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
        setModifiedTables({});
        setHasUnsavedChanges(false);
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

  // Track changes to a table
  const trackTableChange = (tableId: string, changes: Partial<Table>) => {
    setModifiedTables(prev => ({
      ...prev,
      [tableId]: {
        ...(prev[tableId] || {}),
        ...changes
      }
    }));
    setHasUnsavedChanges(true);
  };

  // Update table position in state only (no DB update until save)
  const updateTablePosition = async (tableId: string, position_x: number, position_y: number) => {
    try {
      // Update local state
      setTables(prevTables => 
        prevTables.map(table => 
          table.id === tableId ? { ...table, position_x, position_y } : table
        )
      );
      
      // Track the change
      trackTableChange(tableId, { position_x, position_y });
      
    } catch (err) {
      console.error("Error updating table position:", err);
      toast.error("Failed to update table position");
      throw err;
    }
  };

  // Update table size in state only (no DB update until save)
  const updateTableSize = async (tableId: string, width: number, height: number) => {
    try {
      // Update local state
      setTables(prevTables => 
        prevTables.map(table => 
          table.id === tableId ? { ...table, width, height } : table
        )
      );
      
      // Track the change
      trackTableChange(tableId, { width, height });
      
    } catch (err) {
      console.error("Error updating table size:", err);
      toast.error("Failed to update table size");
      throw err;
    }
  };

  // Update table rotation in state only (no DB update until save)
  const updateTableRotation = async (tableId: string, rotation: number) => {
    try {
      // Update local state
      setTables(prevTables => 
        prevTables.map(table => 
          table.id === tableId ? { ...table, rotation } : table
        )
      );
      
      // Track the change
      trackTableChange(tableId, { rotation });
      
    } catch (err) {
      console.error("Error updating table rotation:", err);
      toast.error("Failed to update table rotation");
      throw err;
    }
  };

  // Save all changes to the database
  const saveChanges = async () => {
    try {
      const promises = Object.entries(modifiedTables).map(([tableId, changes]) => {
        return supabase
          .from('restaurant_tables')
          .update(changes)
          .eq('id', tableId)
          .select();
      });
      
      const results = await Promise.all(promises);
      
      // Check for errors
      const errors = results.filter(result => result.error);
      if (errors.length > 0) {
        console.error("Errors saving changes:", errors);
        throw new Error("Some changes could not be saved");
      }
      
      setModifiedTables({});
      setHasUnsavedChanges(false);
      toast.success("Floor plan changes saved successfully");
      
    } catch (err) {
      console.error("Error saving floor plan changes:", err);
      toast.error("Failed to save floor plan changes");
      throw err;
    }
  };

  // Change current room
  const changeRoom = (roomId: string | null) => {
    // If there are unsaved changes, confirm before changing room
    if (hasUnsavedChanges) {
      if (confirm("You have unsaved changes. Changing rooms will discard these changes. Continue?")) {
        setCurrentRoomId(roomId);
        setModifiedTables({});
        setHasUnsavedChanges(false);
      }
    } else {
      setCurrentRoomId(roomId);
    }
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
    changeRoom,
    saveChanges,
    hasUnsavedChanges
  };
};
