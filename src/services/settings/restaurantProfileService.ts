
import { supabase } from "@/integrations/supabase/client";
import { RestaurantProfile, RestaurantBranding } from "./types";
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
      // We need to ensure name is provided for new profiles
      if (!profile.name) {
        throw new Error('Restaurant name is required');
      }
      
      const { data, error } = await supabase
        .from('restaurant_profile')
        .insert({
          name: profile.name,
          cuisine_type: profile.cuisine_type,
          phone: profile.phone,
          email: profile.email,
          address: profile.address,
          description: profile.description,
          tax_id: profile.tax_id,
          founded_year: profile.founded_year
        })
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
        .insert(branding)
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
