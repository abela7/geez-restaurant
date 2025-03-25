
import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Table } from "@/services/table/types";

export const useTables = () => {
  const [tables, setTables] = useState<Table[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Fetch all tables with their room information
  const fetchTables = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('restaurant_tables')
        .select('*, room:rooms(*)')
        .order('table_number');
      
      if (error) throw error;
      
      setTables(data || []);
    } catch (err) {
      console.error('Error fetching tables:', err);
      setError(err instanceof Error ? err : new Error('Error fetching tables'));
      toast.error('Failed to load tables');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Get a table by ID
  const getTableById = useCallback((id: string) => {
    return tables.find(table => table.id === id) || null;
  }, [tables]);

  // Get tables by room ID
  const getTablesByRoomId = useCallback((roomId: string) => {
    return tables.filter(table => table.room_id === roomId);
  }, [tables]);

  // Get available tables
  const getAvailableTables = useCallback(() => {
    return tables.filter(table => table.status === 'available');
  }, [tables]);

  // Load tables when the hook is first used
  useEffect(() => {
    fetchTables();
  }, [fetchTables]);

  return {
    tables,
    isLoading,
    error,
    fetchTables,
    getTableById,
    getTablesByRoomId,
    getAvailableTables
  };
};
