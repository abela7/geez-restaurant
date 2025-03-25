
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
        group_id: tableData.group_id === "null" ? null : tableData.group_id,
        // Ensure numeric values are properly converted
        table_number: Number(tableData.table_number),
        capacity: Number(tableData.capacity),
        position_x: tableData.position_x ? Number(tableData.position_x) : undefined,
        position_y: tableData.position_y ? Number(tableData.position_y) : undefined,
        width: tableData.width ? Number(tableData.width) : undefined,
        height: tableData.height ? Number(tableData.height) : undefined,
        rotation: tableData.rotation ? Number(tableData.rotation) : undefined
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

  // Update an existing table with optimized handling
  const updateTable = useCallback(async (tableId: string, tableData: Partial<Table>) => {
    try {
      setIsUpdating(true);
      setError(null);
      
      // Process form values to ensure proper types
      const processedData: Record<string, any> = { ...tableData };
      
      // Handle special cases for room_id and group_id
      if ('room_id' in tableData) {
        processedData.room_id = tableData.room_id === "null" ? null : tableData.room_id;
      }
      
      if ('group_id' in tableData) {
        processedData.group_id = tableData.group_id === "null" ? null : tableData.group_id;
      }
      
      // Ensure numeric values are properly converted
      if ('table_number' in tableData) processedData.table_number = Number(tableData.table_number);
      if ('capacity' in tableData) processedData.capacity = Number(tableData.capacity);
      if ('position_x' in tableData) processedData.position_x = Number(tableData.position_x);
      if ('position_y' in tableData) processedData.position_y = Number(tableData.position_y);
      if ('width' in tableData) processedData.width = Number(tableData.width);
      if ('height' in tableData) processedData.height = Number(tableData.height);
      if ('rotation' in tableData) processedData.rotation = Number(tableData.rotation);
      
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

  // Update table status with optimized handling
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

  // Delete a table with proper error handling
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
