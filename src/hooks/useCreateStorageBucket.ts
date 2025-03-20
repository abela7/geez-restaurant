
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useCreateStorageBucket = () => {
  const [isCreating, setIsCreating] = useState(false);
  const [isCreated, setIsCreated] = useState(false);
  
  useEffect(() => {
    const createBucket = async () => {
      setIsCreating(true);
      try {
        const { data, error } = await supabase.functions.invoke('create-storage-bucket');
        
        if (error) {
          throw error;
        }
        
        if (data?.success) {
          console.log('Storage bucket status:', data.message);
          setIsCreated(true);
        }
      } catch (error) {
        console.error('Error creating storage bucket:', error);
        toast.error('Failed to create storage bucket');
      } finally {
        setIsCreating(false);
      }
    };
    
    createBucket();
  }, []);
  
  return { isCreating, isCreated };
};
