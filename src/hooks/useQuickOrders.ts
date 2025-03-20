
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export type QuickOrder = {
  id: string;
  name: string;
  description: string | null;
  price: number;
  category: string;
  image_url: string | null;
  is_available: boolean;
};

export const useQuickOrders = () => {
  const [orders, setOrders] = useState<QuickOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchQuickOrders = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from('quick_orders')
        .select('*')
        .eq('is_available', true)
        .order('category');
      
      if (error) throw error;
      
      setOrders(data as QuickOrder[]);
    } catch (err: any) {
      console.error('Error fetching quick orders:', err);
      setError(err.message || 'Failed to load quick orders');
      toast({
        title: "Error",
        description: `Failed to load quick orders: ${err.message}`,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchQuickOrders();
  }, []);

  return {
    orders,
    isLoading,
    error,
    refetch: fetchQuickOrders
  };
};
