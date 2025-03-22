
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { TableStatus } from "@/services/table/types";

export interface Table {
  id: string;
  table_number: number;
  capacity: number;
  status: TableStatus; // Updated to use the TableStatus type from services
  location?: string;
}

export const useTables = () => {
  const [tables, setTables] = useState<Table[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const loadTables = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from('restaurant_tables')
        .select('*')
        .in('status', ['available', 'occupied', 'reserved', 'cleaning']);
      
      if (error) {
        throw error;
      }
      
      setTables(data as Table[]);
    } catch (err) {
      console.error("Error loading tables:", err);
      setError(err instanceof Error ? err : new Error('Unknown error loading tables'));
      toast.error("Failed to load tables");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadTables();
  }, []);

  return {
    tables,
    isLoading,
    error,
    refresh: loadTables
  };
};
