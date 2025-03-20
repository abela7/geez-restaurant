
import { supabase } from "@/integrations/supabase/client";

export type Translation = {
  id?: string;
  key: string;
  en: string;
  am: string;
  created_at?: string;
  updated_at?: string;
};

/**
 * Fetch all translations from the database
 */
export const fetchTranslations = async (): Promise<Record<string, string>> => {
  try {
    const { data, error } = await supabase
      .from('translations')
      .select('*');
    
    if (error) {
      console.error('Error fetching translations:', error);
      return {};
    }
    
    // Convert the array of translation objects to a key-value object
    const translations: Record<string, string> = {};
    data?.forEach((item: Translation) => {
      translations[item.key] = item.am;
    });
    
    return translations;
  } catch (error) {
    console.error('Error in fetchTranslations:', error);
    return {};
  }
};

/**
 * Save a single translation to the database
 */
export const saveTranslation = async (key: string, value: string): Promise<boolean> => {
  try {
    // Check if translation already exists
    const { data: existingData, error: fetchError } = await supabase
      .from('translations')
      .select('*')
      .eq('key', key)
      .single();
    
    if (fetchError && fetchError.code !== 'PGSQL_ERROR_NO_DATA_FOUND') {
      console.error('Error checking for existing translation:', fetchError);
      return false;
    }
    
    // Update or insert as appropriate
    if (existingData) {
      const { error } = await supabase
        .from('translations')
        .update({ am: value })
        .eq('key', key);
      
      if (error) {
        console.error('Error updating translation:', error);
        return false;
      }
    } else {
      const { error } = await supabase
        .from('translations')
        .insert({ key, en: key, am: value });
      
      if (error) {
        console.error('Error inserting translation:', error);
        return false;
      }
    }
    
    return true;
  } catch (error) {
    console.error('Error in saveTranslation:', error);
    return false;
  }
};

/**
 * Save multiple translations to the database
 */
export const saveTranslations = async (translations: Record<string, string>): Promise<boolean> => {
  try {
    const rows = Object.entries(translations).map(([key, value]) => ({
      key,
      en: key,
      am: value
    }));
    
    // Handle in batches to prevent large payload issues
    const batchSize = 100;
    for (let i = 0; i < rows.length; i += batchSize) {
      const batch = rows.slice(i, i + batchSize);
      
      const { error } = await supabase
        .from('translations')
        .upsert(batch, { 
          onConflict: 'key',
          ignoreDuplicates: false 
        });
      
      if (error) {
        console.error('Error batch saving translations:', error);
        return false;
      }
    }
    
    return true;
  } catch (error) {
    console.error('Error in saveTranslations:', error);
    return false;
  }
};

/**
 * Delete a translation from the database
 */
export const deleteTranslation = async (key: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('translations')
      .delete()
      .eq('key', key);
    
    if (error) {
      console.error('Error deleting translation:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error in deleteTranslation:', error);
    return false;
  }
};
