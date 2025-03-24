
import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Table, TableStatus, Room, TableGroup } from "@/services/table/types";

export const useTables = () => {
  const [tables, setTables] = useState<Table[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [tableGroups, setTableGroups] = useState<TableGroup[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const loadTables = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Get tables with room and group information
      const { data, error } = await supabase
        .from('restaurant_tables')
        .select('*, room:rooms(*), group:table_groups(*)')
        .order('table_number');
      
      if (error) {
        throw error;
      }
      
      setTables(data as unknown as Table[]);
    } catch (err) {
      console.error("Error loading tables:", err);
      setError(err instanceof Error ? err : new Error('Unknown error loading tables'));
      toast.error("Failed to load tables");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loadRooms = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('rooms')
        .select('*')
        .order('name');
      
      if (error) {
        throw error;
      }
      
      setRooms(data as Room[]);
    } catch (err) {
      console.error("Error loading rooms:", err);
      toast.error("Failed to load rooms");
    }
  }, []);

  const loadTableGroups = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('table_groups')
        .select('*')
        .order('name');
      
      if (error) {
        throw error;
      }
      
      setTableGroups(data as TableGroup[]);
    } catch (err) {
      console.error("Error loading table groups:", err);
      toast.error("Failed to load table groups");
    }
  }, []);

  const updateTableStatus = useCallback(async (tableId: string, status: TableStatus) => {
    try {
      const { data, error } = await supabase
        .from('restaurant_tables')
        .update({ status })
        .eq('id', tableId)
        .select()
        .single();
      
      if (error) {
        throw error;
      }
      
      setTables(prevTables => 
        prevTables.map(table => 
          table.id === tableId ? { ...table, status } : table
        )
      );
      
      return data as Table;
    } catch (err) {
      console.error("Error updating table status:", err);
      toast.error("Failed to update table status");
      throw err;
    }
  }, []);

  const createTable = useCallback(async (tableData: Omit<Table, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('restaurant_tables')
        .insert(tableData)
        .select()
        .single();
      
      if (error) {
        throw error;
      }
      
      await loadTables();
      return data as Table;
    } catch (err) {
      console.error("Error creating table:", err);
      toast.error("Failed to create table");
      throw err;
    }
  }, [loadTables]);

  const updateTable = useCallback(async (tableId: string, tableData: Partial<Table>) => {
    try {
      const { data, error } = await supabase
        .from('restaurant_tables')
        .update(tableData)
        .eq('id', tableId)
        .select()
        .single();
      
      if (error) {
        throw error;
      }
      
      setTables(prevTables => 
        prevTables.map(table => 
          table.id === tableId ? { ...table, ...tableData } : table
        )
      );
      
      return data as Table;
    } catch (err) {
      console.error("Error updating table:", err);
      toast.error("Failed to update table");
      throw err;
    }
  }, []);

  const deleteTable = useCallback(async (tableId: string) => {
    try {
      const { error } = await supabase
        .from('restaurant_tables')
        .delete()
        .eq('id', tableId);
      
      if (error) {
        throw error;
      }
      
      setTables(prevTables => prevTables.filter(table => table.id !== tableId));
    } catch (err) {
      console.error("Error deleting table:", err);
      toast.error("Failed to delete table");
      throw err;
    }
  }, []);

  // Load initial data
  useEffect(() => {
    const loadData = async () => {
      await Promise.all([
        loadTables(),
        loadRooms(),
        loadTableGroups()
      ]);
    };
    
    loadData();
  }, [loadTables, loadRooms, loadTableGroups]);

  return {
    tables,
    rooms,
    tableGroups,
    isLoading,
    error,
    refresh: loadTables,
    updateTableStatus,
    createTable,
    updateTable,
    deleteTable
  };
};
