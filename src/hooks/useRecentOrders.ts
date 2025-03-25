
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export type RecentOrder = {
  id: string;
  table_id: string | null;
  waiter_id: string | null;
  customer_name: string | null;
  order_type: string;
  status: string;
  total_amount: number;
  items_count: number;
  created_at: string;
  table_number?: number | null; // Add table number directly in the RecentOrder type
};

export const useRecentOrders = (waiterId?: string) => {
  const [orders, setOrders] = useState<RecentOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchRecentOrders = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // For now, use sample data
      const sampleOrders: RecentOrder[] = [
        {
          id: "1",
          table_id: "table-1",
          waiter_id: "4", // Tsion's ID
          customer_name: "John Smith",
          order_type: "dine-in",
          status: "completed",
          total_amount: 45.99,
          items_count: 3,
          created_at: new Date(Date.now() - 1000 * 60 * 35).toISOString(), // 35 minutes ago
          table_number: 12
        },
        {
          id: "2",
          table_id: "table-2",
          waiter_id: "4", // Tsion's ID
          customer_name: "Sarah Johnson",
          order_type: "dine-in",
          status: "in-progress",
          total_amount: 67.50,
          items_count: 5,
          created_at: new Date(Date.now() - 1000 * 60 * 15).toISOString(), // 15 minutes ago
          table_number: 8
        },
        {
          id: "3",
          table_id: null,
          waiter_id: "4", // Tsion's ID
          customer_name: "Mohammed Ali",
          order_type: "takeout",
          status: "pending",
          total_amount: 32.99,
          items_count: 2,
          created_at: new Date(Date.now() - 1000 * 60 * 5).toISOString(), // 5 minutes ago
          table_number: null
        }
      ];
      
      // If waiterId is provided, filter by waiter
      if (waiterId) {
        setOrders(sampleOrders.filter(order => order.waiter_id === waiterId));
      } else {
        setOrders(sampleOrders);
      }
      
      // In a real implementation, we would fetch from Supabase
      // let query = supabase
      //   .from('recent_orders')
      //   .select('*, restaurant_tables(table_number)')
      //   .order('created_at', { ascending: false })
      //   .limit(10);
      // 
      // if (waiterId) {
      //   query = query.eq('waiter_id', waiterId);
      // }
      // 
      // const { data, error } = await query;
      // 
      // if (error) throw error;
      // 
      // // Process the data to extract table_number from the joins
      // const processedData = data.map(order => ({
      //   ...order,
      //   table_number: order.restaurant_tables?.table_number || null,
      // }));
      // 
      // setOrders(processedData as RecentOrder[]);
    } catch (err: any) {
      console.error('Error fetching recent orders:', err);
      setError(err.message || 'Failed to load recent orders');
      toast({
        title: "Error",
        description: `Failed to load recent orders: ${err.message}`,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRecentOrders();
  }, [waiterId, toast]);

  return {
    orders,
    isLoading,
    error,
    refetch: fetchRecentOrders
  };
};
