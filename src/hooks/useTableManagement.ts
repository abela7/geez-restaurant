
import { useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Table, TableStatus, Room, TableGroup } from "@/services/table/types";

export const useTableManagement = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Create a new table
  const createTable = useCallback(async (tableData: Omit<Table, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      setIsUpdating(true);
      setError(null);
      
      // Process form values to ensure proper types
      const processedData = {
        ...tableData,
        room_id: tableData.room_id === "null" ? null : tableData.room_id,
        group_id: tableData.group_id === "null" ? null : tableData.group_id
      };
      
      const { data, error } = await supabase
        .from('restaurant_tables')
        .insert(processedData)
        .select()
        .single();
      
      if (error) throw error;
      
      toast.success("Table created successfully");
      return data as Table;
    } catch (err) {
      console.error("Error creating table:", err);
      setError(err instanceof Error ? err : new Error('Unknown error creating table'));
      toast.error("Failed to create table");
      throw err;
    } finally {
      setIsUpdating(false);
    }
  }, []);

  // Update an existing table
  const updateTable = useCallback(async (tableId: string, tableData: Partial<Table>) => {
    try {
      setIsUpdating(true);
      setError(null);
      
      // Process form values to ensure proper types
      const processedData = {
        ...tableData,
        room_id: tableData.room_id === "null" ? null : tableData.room_id,
        group_id: tableData.group_id === "null" ? null : tableData.group_id
      };
      
      const { data, error } = await supabase
        .from('restaurant_tables')
        .update(processedData)
        .eq('id', tableId)
        .select()
        .single();
      
      if (error) throw error;
      
      toast.success("Table updated successfully");
      return data as Table;
    } catch (err) {
      console.error("Error updating table:", err);
      setError(err instanceof Error ? err : new Error('Unknown error updating table'));
      toast.error("Failed to update table");
      throw err;
    } finally {
      setIsUpdating(false);
    }
  }, []);

  // Update table status
  const updateTableStatus = useCallback(async (tableId: string, status: TableStatus) => {
    try {
      setIsUpdating(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('restaurant_tables')
        .update({ status })
        .eq('id', tableId)
        .select()
        .single();
      
      if (error) throw error;
      
      toast.success(`Table ${status === 'inactive' ? 'deactivated' : 'status updated'}`);
      return data as Table;
    } catch (err) {
      console.error("Error updating table status:", err);
      setError(err instanceof Error ? err : new Error('Unknown error updating table status'));
      toast.error("Failed to update table status");
      throw err;
    } finally {
      setIsUpdating(false);
    }
  }, []);

  // Delete a table
  const deleteTable = useCallback(async (tableId: string) => {
    try {
      setIsUpdating(true);
      setError(null);
      
      // First check if the table is referenced in orders
      const { data: ordersData, error: ordersError } = await supabase
        .from('orders')
        .select('id')
        .eq('table_id', tableId)
        .limit(1);
      
      if (ordersError) throw ordersError;
      
      // If orders exist with this table, throw a specific error
      if (ordersData && ordersData.length > 0) {
        throw new Error("Cannot delete this table because it has associated orders. You can update its status to 'inactive' instead.");
      }
      
      // If no orders reference this table, proceed with deletion
      const { error } = await supabase
        .from('restaurant_tables')
        .delete()
        .eq('id', tableId);
      
      if (error) throw error;
      
      toast.success("Table deleted successfully");
    } catch (err) {
      console.error("Error deleting table:", err);
      setError(err instanceof Error ? err : new Error('Unknown error deleting table'));
      
      if (err instanceof Error && err.message.includes("associated orders")) {
        toast.error(err.message);
        throw err;
      } else {
        toast.error("Failed to delete table");
        throw err;
      }
    } finally {
      setIsUpdating(false);
    }
  }, []);

  return {
    isLoading,
    isUpdating,
    error,
    createTable,
    updateTable,
    updateTableStatus,
    deleteTable,
  };
};
