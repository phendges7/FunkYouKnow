// src/app/providers/AuthProvider.jsx
import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase/supabaseClient";
import { AuthContext } from "../../context/AuthContext";

import BootSplash from "../../components/feedback/BootSplash/BootSplash";

const SPLASH_MIN_MS = 1500;
const SPLASH_EXIT_MS = 350;

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // loading = usado em operações normais (logout, etc.)
  const [loading, setLoading] = useState(true);

  // controle do splash inicial
  const [bootMinDone, setBootMinDone] = useState(false);
  const [bootAuthDone, setBootAuthDone] = useState(false);

  const [showSplash, setShowSplash] = useState(true);
  const [isSplashExiting, setIsSplashExiting] = useState(false);

  // -----------------------------
  // Helpers
  // -----------------------------
  const fetchUserData = async (userId) => {
    try {
      const { data, error } = await supabase
        .from("users")
        .select("isAdmin, name")
        .eq("id", userId)
        .single();

      if (error) {
        console.warn("Could not fetch user data:", error.message);
        return { isAdmin: false };
      }

      return {
        isAdmin: !!data?.isAdmin,
        name: data?.name ?? null,
      };
    } catch (error) {
      console.error("Error fetching user data:", error);
      return { isAdmin: false };
    }
  };

  const updateUserState = async (session) => {
    if (!session?.user) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      const userData = await fetchUserData(session.user.id);

      setUser({
        ...session.user,
        isAdmin: userData.isAdmin,
        displayName: userData.name,
      });
      setLoading(false);
    } catch (error) {
      console.error("Error updating user state:", error);
      setUser(session.user);
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      await supabase.auth.signOut();
    } catch (error) {
      console.error("Error during logout:", error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  // -----------------------------
  // Splash mínimo (3s)
  // -----------------------------
  useEffect(() => {
    const t = setTimeout(() => setBootMinDone(true), SPLASH_MIN_MS);
    return () => clearTimeout(t);
  }, []);

  // -----------------------------
  // Auth bootstrap + listeners
  // -----------------------------
  useEffect(() => {
    let mounted = true;

    const loadInitialSession = async () => {
      try {
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();

        if (error) throw error;
        if (!mounted) return;

        await updateUserState(session);
      } catch (error) {
        console.error("Load session error:", error);
        if (mounted) {
          setUser(null);
          setLoading(false);
        }
      } finally {
        if (mounted) setBootAuthDone(true);
      }
    };

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
          console.log("🚪 Auth state change:", event, "→ clearing user");
          setUser(null);
          setLoading(false);
          break;

        default:
          break;
      }
    };

    const handleStorageSync = (event) => {
      if (event.key === null || event.key?.startsWith("sb-")) {
        loadInitialSession();
      }
    };

    const setupListeners = () => {
      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange(handleAuthStateChange);

      window.addEventListener("storage", handleStorageSync);

      return () => {
        subscription?.unsubscribe();
        window.removeEventListener("storage", handleStorageSync);
      };
    };

    let cleanupListeners;

    loadInitialSession()
      .then(() => {
        if (mounted) cleanupListeners = setupListeners();
      })
      .catch((error) => {
        console.error("Error during auth init:", error);
      });

    return () => {
      mounted = false;
      if (cleanupListeners) cleanupListeners();
    };
  }, []);

  // -----------------------------
  // Splash fade-out control
  // -----------------------------
  useEffect(() => {
    const ready = bootMinDone && bootAuthDone;
    if (!ready) return;

    setIsSplashExiting(true);

    const t = setTimeout(() => {
      setShowSplash(false);
    }, SPLASH_EXIT_MS);

    return () => clearTimeout(t);
  }, [bootMinDone, bootAuthDone]);

  const bootReady = !showSplash;
  const bootExiting = isSplashExiting;

  // -----------------------------
  // App ready
  // -----------------------------
  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        logout,
        bootReady,
        bootExiting,
      }}
    >
      {children}
      {showSplash && <BootSplash isExiting={isSplashExiting} />}
    </AuthContext.Provider>
  );
};
