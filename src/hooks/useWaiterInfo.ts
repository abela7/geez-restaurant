
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export type WaiterInfo = {
  id: string;
  name: string;
  role: string;
  active: boolean;
};

export const useWaiterInfo = () => {
  const [waiter, setWaiter] = useState<WaiterInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWaiterInfo = async () => {
      setIsLoading(true);
      
      // Get the user from localStorage
      const storedUser = localStorage.getItem('user');
      if (!storedUser) {
        setError('User not found in localStorage');
        setIsLoading(false);
        return;
      }
      
      const user = JSON.parse(storedUser);
      
      try {
        // First check if the waiter exists
        const { data, error } = await supabase
          .from('waiters')
          .select('*')
          .eq('user_id', user.id)
          .single();
        
        if (error && error.code !== 'PGRST116') {
          throw error;
        }
        
        if (data) {
          setWaiter(data as WaiterInfo);
        } else {
          // Create new waiter if not exists
          const { data: newWaiter, error: createError } = await supabase
            .from('waiters')
            .insert([
              { 
                user_id: user.id,
                name: user.username || 'Waiter',
                role: 'waiter'
              }
            ])
            .select()
            .single();
          
          if (createError) throw createError;
          
          setWaiter(newWaiter as WaiterInfo);
        }
      } catch (err: any) {
        console.error('Error fetching waiter info:', err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchWaiterInfo();
  }, []);

  return { waiter, isLoading, error };
};
