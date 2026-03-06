// src/features/admin/services/adminUsersService.js
import { supabase } from "../../../lib/supabase/supabaseClient";

const adminUsersService = {
  async createAdminUser({ email, password, displayName }) {
    const { data, error } = await supabase.functions.invoke(
      "create-auth-user",
      {
        body: { email, password, displayName },
      }
    );

    if (error) {
      // erro de invocação da edge function (problema de rede, etc.)
      throw new Error(error.message || "Could not call create-admin function");
    }

    if (data?.error) {
      // erro retornado pela própria function
      throw new Error(data.error);
    }

    return true;
  },

  async requestAdminPasswordReset({ email, redirectTo }) {
    const normalizedEmail = String(email || "")
      .trim()
      .toLowerCase();

    if (!normalizedEmail) {
      throw new Error("Email is required");
    }

    const fallbackRedirect =
      typeof window !== "undefined"
        ? `${window.location.origin}/reset-password`
        : undefined;

    const { error } = await supabase.auth.resetPasswordForEmail(
      normalizedEmail,
      {
        redirectTo: redirectTo || fallbackRedirect,
      }
    );

    if (error) {
      throw new Error(error.message || "Could not send password reset email");
    }

    return true;
  },

  async preparePasswordRecoverySession() {
    const searchParams =
      typeof window !== "undefined"
        ? new URLSearchParams(window.location.search)
        : new URLSearchParams();

    const code = searchParams.get("code");

    if (code) {
      const { error } = await supabase.auth.exchangeCodeForSession(code);
      if (error) {
        throw new Error(error.message || "Invalid or expired recovery link");
      }
    }

    const {
      data: { session },
      error,
    } = await supabase.auth.getSession();

    if (error) {
      throw new Error(error.message || "Could not verify recovery session");
    }

    if (!session?.user) {
      throw new Error("Invalid or expired recovery link");
    }

    const { data: userRow, error: userError } = await supabase
      .from("users")
      .select("isAdmin")
      .eq("id", session.user.id)
      .single();

    if (userError) {
      throw new Error(
        userError.message || "Could not validate account permissions"
      );
    }

    if (!userRow?.isAdmin) {
      await supabase.auth.signOut();
      throw new Error("Password reset is restricted to admin accounts");
    }

    return session.user;
  },

  async updateRecoveredAdminPassword({ password }) {
    const nextPassword = String(password || "");

    if (!nextPassword) {
      throw new Error("Password is required");
    }

    const { error } = await supabase.auth.updateUser({
      password: nextPassword,
    });

    if (error) {
      throw new Error(error.message || "Could not update password");
    }

    await supabase.auth.signOut();
    return true;
  },
};

export default adminUsersService;
