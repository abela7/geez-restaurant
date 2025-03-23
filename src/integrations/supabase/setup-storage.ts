
import { supabase } from "./client";

// Setup function to create the necessary buckets if they don't exist
export const setupStorage = async () => {
  try {
    // Check if staff_images bucket exists
    const { data: buckets } = await supabase.storage.listBuckets();
    
    const staffImagesBucketExists = buckets?.some(bucket => bucket.name === 'staff_images');
    const foodImagesBucketExists = buckets?.some(bucket => bucket.name === 'food_images');
    
    if (!staffImagesBucketExists) {
      // Create the staff_images bucket
      const { error } = await supabase.storage.createBucket('staff_images', {
        public: true,
        fileSizeLimit: 5242880, // 5MB
        allowedMimeTypes: ['image/png', 'image/jpeg', 'image/jpg', 'image/gif']
      });
      
      if (error) {
        throw error;
      }
      
      console.log('Created staff_images storage bucket');
    } else {
      console.log('staff_images bucket already exists');
    }

    if (!foodImagesBucketExists) {
      // Create the food_images bucket
      const { error } = await supabase.storage.createBucket('food_images', {
        public: true,
        fileSizeLimit: 5242880, // 5MB
        allowedMimeTypes: ['image/png', 'image/jpeg', 'image/jpg', 'image/gif']
      });
      
      if (error) {
        throw error;
      }
      
      console.log('Created food_images storage bucket');
    } else {
      console.log('food_images bucket already exists');
    }

    // Set up storage policies
    try {
      // We don't need to create policies here anymore as they're created in the SQL migration
      // This helps avoid errors when the policies already exist
    } catch (policyError) {
      console.error('Error setting up storage policies:', policyError);
    }
    
  } catch (error) {
    console.error('Error setting up storage buckets:', error);
  }
};

// Call the setup function
setupStorage();
