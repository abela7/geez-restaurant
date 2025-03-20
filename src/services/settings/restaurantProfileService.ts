
import { supabase } from "@/integrations/supabase/client";
import { RestaurantProfile, BusinessHours, RestaurantBranding } from "./types";
import { toast } from "sonner";

// Restaurant Profile Functions
export const getRestaurantProfile = async (): Promise<RestaurantProfile | null> => {
  try {
    const { data, error } = await supabase
      .from('restaurant_profile')
      .select('*')
      .single();
    
    if (error) {
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error('Error fetching restaurant profile:', error);
    toast.error('Failed to load restaurant profile');
    return null;
  }
};

export const updateRestaurantProfile = async (profile: Partial<RestaurantProfile>): Promise<RestaurantProfile | null> => {
  try {
    // Get the existing profile first
    const { data: existingProfile } = await supabase
      .from('restaurant_profile')
      .select('id')
      .single();
    
    const profileId = existingProfile?.id;
    
    if (!profileId) {
      // If no profile exists, create one
      const { data, error } = await supabase
        .from('restaurant_profile')
        .insert([profile])
        .select('*')
        .single();
      
      if (error) throw error;
      return data;
    }
    
    // Update the existing profile
    const { data, error } = await supabase
      .from('restaurant_profile')
      .update(profile)
      .eq('id', profileId)
      .select('*')
      .single();
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error updating restaurant profile:', error);
    toast.error('Failed to update restaurant profile');
    return null;
  }
};

// Business Hours Functions
export const getBusinessHours = async (): Promise<BusinessHours[]> => {
  try {
    const { data, error } = await supabase
      .from('business_hours')
      .select('*')
      .order('CASE ' +
        'WHEN day_of_week = \'Monday\' THEN 1 ' +
        'WHEN day_of_week = \'Tuesday\' THEN 2 ' +
        'WHEN day_of_week = \'Wednesday\' THEN 3 ' +
        'WHEN day_of_week = \'Thursday\' THEN 4 ' +
        'WHEN day_of_week = \'Friday\' THEN 5 ' +
        'WHEN day_of_week = \'Saturday\' THEN 6 ' +
        'WHEN day_of_week = \'Sunday\' THEN 7 END');
    
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching business hours:', error);
    toast.error('Failed to load business hours');
    return [];
  }
};

export const updateBusinessHours = async (dayOfWeek: string, hours: Partial<BusinessHours>): Promise<BusinessHours | null> => {
  try {
    // Get the existing business hours for the day
    const { data: existingHours } = await supabase
      .from('business_hours')
      .select('id')
      .eq('day_of_week', dayOfWeek)
      .single();
    
    if (!existingHours) {
      // If no hours exist for this day, create them
      const { data, error } = await supabase
        .from('business_hours')
        .insert([{ day_of_week: dayOfWeek, ...hours }])
        .select('*')
        .single();
      
      if (error) throw error;
      return data;
    }
    
    // Update the existing hours
    const { data, error } = await supabase
      .from('business_hours')
      .update(hours)
      .eq('id', existingHours.id)
      .select('*')
      .single();
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error updating business hours:', error);
    toast.error('Failed to update business hours');
    return null;
  }
};

// Restaurant Branding Functions
export const getRestaurantBranding = async (): Promise<RestaurantBranding | null> => {
  try {
    const { data, error } = await supabase
      .from('restaurant_branding')
      .select('*')
      .single();
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching restaurant branding:', error);
    toast.error('Failed to load restaurant branding');
    return null;
  }
};

export const updateRestaurantBranding = async (branding: Partial<RestaurantBranding>): Promise<RestaurantBranding | null> => {
  try {
    // Get the existing branding first
    const { data: existingBranding } = await supabase
      .from('restaurant_branding')
      .select('id')
      .single();
    
    const brandingId = existingBranding?.id;
    
    if (!brandingId) {
      // If no branding exists, create one
      const { data, error } = await supabase
        .from('restaurant_branding')
        .insert([branding])
        .select('*')
        .single();
      
      if (error) throw error;
      return data;
    }
    
    // Update the existing branding
    const { data, error } = await supabase
      .from('restaurant_branding')
      .update(branding)
      .eq('id', brandingId)
      .select('*')
      .single();
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error updating restaurant branding:', error);
    toast.error('Failed to update restaurant branding');
    return null;
  }
};

// Upload functions for logo and cover image
export const uploadImage = async (file: File, path: string): Promise<string | null> => {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
    const filePath = `${path}/${fileName}`;
    
    const { error: uploadError } = await supabase.storage
      .from('restaurant-assets')
      .upload(filePath, file);
    
    if (uploadError) throw uploadError;
    
    const { data } = supabase.storage
      .from('restaurant-assets')
      .getPublicUrl(filePath);
    
    return data.publicUrl;
  } catch (error) {
    console.error('Error uploading image:', error);
    toast.error('Failed to upload image');
    return null;
  }
};
