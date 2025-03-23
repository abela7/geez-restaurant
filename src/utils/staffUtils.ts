
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

/**
 * Uploads a staff profile image to the staff_profiles bucket
 * @param file The image file to upload
 * @returns The public URL of the uploaded image or null if the upload failed
 */
export const uploadStaffImage = async (file: File): Promise<string | null> => {
  try {
    // Create a unique filename using UUID
    const fileExt = file.name.split('.').pop();
    const fileName = `${crypto.randomUUID()}.${fileExt}`;
    const filePath = `${fileName}`;
    
    // Upload to staff_profiles bucket
    const { error: uploadError } = await supabase.storage
      .from('staff_profiles')
      .upload(filePath, file);
    
    if (uploadError) {
      console.error('Error uploading image:', uploadError);
      return null;
    }
    
    // Get the public URL
    const { data } = supabase.storage
      .from('staff_profiles')
      .getPublicUrl(filePath);
    
    return data.publicUrl;
  } catch (err: any) {
    console.error('Error in image upload:', err);
    return null;
  }
};

/**
 * Utility to format error messages and display toast notifications
 */
export const handleApiError = (err: any, message: string, toast: ReturnType<typeof useToast>['toast']) => {
  console.error(`${message}:`, err);
  const errorMessage = err.message || 'An unknown error occurred';
  toast({
    title: "Error",
    description: `${message}: ${errorMessage}`,
    variant: "destructive"
  });
  return errorMessage;
};
