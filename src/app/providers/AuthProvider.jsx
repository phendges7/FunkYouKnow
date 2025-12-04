// src/app/providers/AuthProvider.jsx
import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase/supabaseClient";
import { AuthContext } from "../../context/AuthContext";

// Provider responsável por gerenciar o estado de autenticação
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    // Busca dados adicionais do usuário no banco
    const fetchUserData = async (userId) => {
      try {
        const { data, error } = await supabase
          .from("users")
          .select("isAdmin")
          .eq("id", userId)
          .single();

        if (error) {
          console.warn("Could not fetch user data:", error.message);
          return { isAdmin: false };
        }

        return { isAdmin: !!data?.isAdmin };
      } catch (error) {
        console.error("Error fetching user data:", error);
        return { isAdmin: false };
      }
    };

    // Atualiza o estado global do usuário com base na sessão
    const updateUserState = async (session) => {
      if (!session?.user) {
        if (mounted) {
          setUser(null);
          setLoading(false);
        }
        return;
      }

      try {
        const userData = await fetchUserData(session.user.id);

        if (mounted) {
          setUser({
            ...session.user,
            isAdmin: userData.isAdmin,
          });
          setLoading(false);
        }
      } catch (error) {
        console.error("Error updating user state:", error);
        if (mounted) {
          // Fallback sem dados adicionais
          setUser(session.user);
          setLoading(false);
        }
      }
    };

    // Carrega sessão inicial
    const loadInitialSession = async () => {
      try {
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();

        if (error) {
          console.error("Session error:", error);
          throw error;
        }

        await updateUserState(session);
      } catch (error) {
        console.error("Load session error:", error);
        if (mounted) {
          setUser(null);
          setLoading(false);
        }
      }
    };

    // Handler para mudanças de auth (login, logout, refresh, etc.)
    const handleAuthStateChange = async (event, session) => {
      if (!mounted) return;

      switch (event) {
        case "SIGNED_IN":
        case "TOKEN_REFRESHED":
        case "USER_UPDATED":
          await updateUserState(session);
          break;

        case "SIGNED_OUT":
        case "USER_DELETED":
        case "TOKEN_REFRESH_FAILED":
          console.log("🚪 Signing out due to:", event);
          setUser(null);
          setLoading(false);

          try {
            await supabase.auth.signOut();
          } catch (signOutError) {
            console.error("Error during sign out:", signOutError);
          }
          break;

        default:
          break;
      }
    };

    // Sincronização entre abas via localStorage
    const handleStorageSync = (event) => {
      if (event.key === null || event.key?.startsWith("sb-")) {
        // Recarrega a sessão quando detecta mudanças de auth entre abas
        loadInitialSession();
      }
    };

    // Configura listeners (Supabase + storage + sync periódico)
    const setupListeners = () => {
      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange(handleAuthStateChange);

      window.addEventListener("storage", handleStorageSync);

      const syncInterval = setInterval(() => {
        if (mounted) {
          loadInitialSession();
        }
      }, 120000); // Sincroniza a cada 2 minutos

      return () => {
        subscription?.unsubscribe();
        window.removeEventListener("storage", handleStorageSync);
        clearInterval(syncInterval);
      };
    };

    // Inicializa sessão + listeners
    let cleanupListeners;

    loadInitialSession()
      .then(() => {
        if (mounted) {
          cleanupListeners = setupListeners();
        }
      })
      .catch((error) => {
        console.error("Error during auth initialization:", error);
      });

    return () => {
      mounted = false;
      if (cleanupListeners) {
        cleanupListeners();
      }
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
