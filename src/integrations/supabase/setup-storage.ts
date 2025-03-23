
import { supabase } from "./client";

// Initialize storage buckets
const setupStorage = async () => {
  try {
    // Check if the staff_images bucket exists
    const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();
    
    if (bucketsError) {
      throw bucketsError;
    }
    
    const staffImagesBucketExists = buckets.some(bucket => bucket.name === 'staff_images');
    
    // Create the bucket if it doesn't exist
    if (!staffImagesBucketExists) {
      const { error } = await supabase.storage.createBucket('staff_images', {
        public: true, // Make bucket public
        fileSizeLimit: 5242880, // 5MB
      });
      
      if (error) {
        throw error;
      }
      
      console.log('Created staff_images bucket');
    }
  } catch (error) {
    console.error('Error setting up storage:', error);
  }
};

// Run the setup
setupStorage();

export default setupStorage;
