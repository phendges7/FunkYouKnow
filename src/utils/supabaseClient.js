import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey);

// Test the Supabase connection
(async () => {
  try {
    const { data, error } = await supabase
      .from("requested_songs")
      .select("id")
      .limit(1);
    if (error) throw error;
    console.log("✅ Supabase connection successful!");
  } catch (err) {
    console.error("❌ Supabase connection failed:", err.message);
  }
})();
