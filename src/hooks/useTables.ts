
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface Table {
  id: string;
  table_number: number;
  capacity: number;
  status: string;
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
        .in('status', ['available', 'occupied']);
      
      if (error) {
        throw error;
      }
      
      setTables(data);
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
