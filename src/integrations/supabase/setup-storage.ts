
import { supabase } from "./client";

// Setup function to create the necessary buckets if they don't exist
export const setupStorage = async () => {
  try {
    // Check if staff_images bucket exists
    const { data: buckets } = await supabase.storage.listBuckets();
    
    const staffImagesBucketExists = buckets?.some(bucket => bucket.name === 'staff_images');
    
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
  } catch (error) {
    console.error('Error setting up storage buckets:', error);
  }
};

// Call the setup function
setupStorage();
