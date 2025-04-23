
import { createClient } from "@supabase/supabase-js";

// Use explicit values if environment variables are not available
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "https://nabcktytlytgrdwhdanx.supabase.co";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5hYmNrdHl0bHl0Z3Jkd2hkYW54Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ1NjU2NjgsImV4cCI6MjA2MDE0MTY2OH0.Pp7I0dVN0-Tp1bXbjwuXUvF78gH-tXey_a9TNO1Au5E";

// Create and export the Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
