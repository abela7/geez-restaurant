// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://afpyubmeoylbrsynbfox.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFmcHl1Ym1lb3lsYnJzeW5iZm94Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI0MzY1ODcsImV4cCI6MjA1ODAxMjU4N30.UXB4QcikkubntJUkDk-DCEtj2-w6CuLw6U3v79FR9xI";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);