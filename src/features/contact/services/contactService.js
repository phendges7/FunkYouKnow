import { supabase } from "../../../lib/supabase/supabaseClient";

const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export async function sendContactMessage({ name, email, message }) {
  const payload = {
    name: String(name ?? "").trim(),
    email: String(email ?? "").trim(),
    message: String(message ?? "").trim(),
  };

  // ✅ Força Authorization mesmo se o user não estiver logado
  // (Se houver sessão, o supabase-js normalmente usa o access_token do usuário.)
  const { data, error } = await supabase.functions.invoke(
    "contact-email-autoreply",
    {
      body: payload,
      headers: {
        Authorization: `Bearer ${anonKey}`,
      },
    }
  );

  if (error) {
    throw new Error(error.message || "Failed to send message");
  }

  if (!data?.ok) {
    throw new Error(data?.error || "Failed to send message");
  }

  return data;
}
