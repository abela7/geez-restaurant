// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://ddgbhzvocdhaxvfuqhwv.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRkZ2JoenZvY2RoYXh2ZnVxaHd2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDIzNzM3MzksImV4cCI6MjA1Nzk0OTczOX0.M0eBFmvXdNIQ2IhbeWSCtBwKwV2g_ypht2i8sIaeid4";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);