
import { supabase } from "@/integrations/supabase/client";

export const getTableStats = async (): Promise<{ 
  total: number;
  available: number;
  occupied: number;
  reserved: number;
  cleaning: number;
}> => {
  const { data, error } = await supabase
    .from('restaurant_tables')
    .select('status');
  
  if (error) {
    console.error('Error fetching table stats:', error);
    throw error;
  }
  
  const stats = {
    total: data.length,
    available: data.filter(t => t.status === 'available').length,
    occupied: data.filter(t => t.status === 'occupied').length,
    reserved: data.filter(t => t.status === 'reserved').length,
    cleaning: data.filter(t => t.status === 'cleaning').length,
  };
  
  return stats;
};
