import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// ✅ Validação de ambiente
if (!supabaseUrl || !supabaseKey) {
  console.error("❌ Supabase environment variables missing!");
}

// Criação do cliente
export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    storage: typeof window !== "undefined" ? window.localStorage : undefined,
    // ⚠️ storageKey removido (Supabase usa automaticamente sb-<ref>-auth-token)
  },
  global: {
    headers: {
      "X-Client-Info": "react-auth",
    },
  },
});

// 🧪 Teste de conexão — apenas no modo desenvolvimento
if (import.meta.env.DEV) {
  (async () => {
    try {
      const { data: authData, error: authError } =
        await supabase.auth.getSession();
      if (authError) console.warn("Auth session check:", authError.message);

      const { data, error } = await supabase
        .from("requested_songs")
        .select("id")
        .limit(1)
        .maybeSingle();

      if (error) console.warn("Database connection test:", error.message);
    } catch (err) {
      console.error("❌ Supabase initialization failed:", err.message);
    }
  })();
}
