
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
      let query = supabase
        .from('recent_orders')
        .select('*, restaurant_tables(table_number)')
        .order('created_at', { ascending: false })
        .limit(10);
      
      if (waiterId) {
        query = query.eq('waiter_id', waiterId);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      
      setOrders(data as any[]);
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
  }, [waiterId]);

  return {
    orders,
    isLoading,
    error,
    refetch: fetchRecentOrders
  };
};
