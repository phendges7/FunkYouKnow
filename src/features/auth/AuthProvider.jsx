import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "./supabaseClient";

const AuthContext = createContext({ user: null, loading: true });

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const loadSession = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (!mounted) return;

        if (session?.user) {
          const { data, error } = await supabase
            .from("users")
            .select("isAdmin")
            .eq("id", session.user.id)
            .single();

          if (!error) {
            setUser({ ...session.user, isAdmin: !!data?.isAdmin });
          } else {
            setUser(session.user);
          }
        } else {
          setUser(null);
        }

        setLoading(false);
      } catch {
        if (mounted) {
          setUser(null);
          setLoading(false);
        }
      }
    };

    loadSession();

    // Corrigido: pega o unsubscribe corretamente
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        const { data, error } = await supabase
          .from("users")
          .select("isAdmin")
          .eq("id", session.user.id)
          .single();

        if (!error) {
          setUser({ ...session.user, isAdmin: !!data?.isAdmin });
        } else {
          setUser(session.user);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => {
      mounted = false;
      subscription?.unsubscribe(); // ✅ forma correta
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
