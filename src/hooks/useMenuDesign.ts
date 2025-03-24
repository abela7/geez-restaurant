
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { MenuDesignType } from '@/types/menu';

// Default menu design values
const defaultMenuDesign: MenuDesignType = {
  layout: 'grid',
  columns: 2,
  showImages: true,
  showDescriptions: true,
  showPrices: true,
  pageSize: 'a4',
  orientation: 'portrait',
  titleFont: 'Playfair Display',
  titleSize: 32,
  subtitleFont: 'Open Sans',
  subtitleSize: 18,
  bodyFont: 'Open Sans',
  bodySize: 14,
  primaryColor: '#8B5CF6',
  secondaryColor: '#D946EF',
  backgroundColor: '#FFFFFF',
  textColor: '#333333',
  accentColor: '#F97316',
  borderRadius: 8,
  showBorders: true,
  borderColor: '#E5E7EB',
  spacing: 'comfortable',
  headerStyle: 'centered',
  footerText: '© Ge\'ez Restaurant',
  logoPosition: 'top',
};

export const useMenuDesign = () => {
  const [menuDesign, setMenuDesign] = useState<MenuDesignType>(defaultMenuDesign);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const loadMenuDesign = async () => {
      try {
        setIsLoading(true);
        // Check if there's an existing design in the database
        const { data, error } = await supabase
          .from('menu_design')
          .select('*')
          .limit(1)
          .single();

        if (error && error.code !== 'PGRST116') {
          // PGRST116 is "no rows returned" error, which we handle by using default values
          console.error('Error loading menu design:', error);
          throw error;
        }

        if (data) {
          // If we have design data, use it
          setMenuDesign({
            ...defaultMenuDesign, // Include defaults for any missing fields
            ...data.design_data // Override with stored values
          });
        }
        
      } catch (err) {
        console.error('Failed to load menu design:', err);
        setError(err instanceof Error ? err : new Error('Unknown error loading menu design'));
        toast.error('Failed to load menu design settings');
      } finally {
        setIsLoading(false);
      }
    };

    loadMenuDesign();
  }, []);

  const updateDesignField = (field: keyof MenuDesignType, value: any) => {
    setMenuDesign(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const saveMenuDesign = async () => {
    try {
      setIsLoading(true);
      
      // Check if we have an existing record
      const { data: existingData, error: checkError } = await supabase
        .from('menu_design')
        .select('id')
        .limit(1);
      
      if (checkError) {
        console.error('Error checking for existing menu design:', checkError);
        throw checkError;
      }
      
      let result;
      
      if (existingData && existingData.length > 0) {
        // Update existing record
        result = await supabase
          .from('menu_design')
          .update({
            design_data: menuDesign,
            updated_at: new Date().toISOString()
          })
          .eq('id', existingData[0].id);
      } else {
        // Insert new record
        result = await supabase
          .from('menu_design')
          .insert({
            design_data: menuDesign,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          });
      }
      
      if (result.error) {
        throw result.error;
      }
      
      return true;
    } catch (err) {
      console.error('Failed to save menu design:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    menuDesign,
    setMenuDesign,
    updateDesignField,
    saveMenuDesign,
    isLoading,
    error
  };
};
