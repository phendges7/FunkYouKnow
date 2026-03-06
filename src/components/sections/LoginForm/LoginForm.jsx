import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "../../../lib/supabase/supabaseClient";
import { useAuth } from "../../../context/AuthContext";
import adminUsersService from "../../../features/admin/services/adminUsersService";
import "./LoginForm.css";

const LoginForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, loading } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [formError, setFormError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [resetting, setResetting] = useState(false);
  const [resetMessage, setResetMessage] = useState("");

  const from = location.state?.from?.pathname || "/";

  // 🚀 Redireciona após login bem-sucedido (via AuthProvider)
  useEffect(() => {
    if (loading || submitting) return;
    if (user) {
      const redirectPath = user?.isAdmin ? "/admin" : from;
      navigate(redirectPath, { replace: true });
    }
  }, [user, loading, submitting, navigate, from]);

  // 🔐 Login simples com tratamento de erro
  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);
    setSubmitting(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password,
      });

      if (error) {
        setFormError(error.message);
        if (
          error.message.includes("token") ||
          error.message.includes("session")
        ) {
          await supabase.auth.signOut(); // Limpa sessões corrompidas
        }
      }
    } catch (err) {
      setFormError("Unexpected error: " + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleForgotPassword = async () => {
    setFormError(null);
    setResetMessage("");

    const normalizedEmail = email.trim().toLowerCase();
    if (!normalizedEmail) {
      setFormError("Enter your admin email first to reset the password.");
      return;
    }

    setResetting(true);

    try {
      await adminUsersService.requestAdminPasswordReset({
        email: normalizedEmail,
      });

      setResetMessage(
        "If this admin account exists, a reset link was sent to the email."
      );
    } catch (error) {
      setFormError(error.message || "Could not send reset email.");
    } finally {
      setResetting(false);
    }
  };

  if (loading) {
    return (
      <section className="login">
        <div className="login__loading">Checking authentication...</div>
      </section>
    );
  }

  return (
    <section className="login">
      <h1 className="login__title">Login</h1>

      <form className="login__form" onSubmit={handleSubmit}>
        <div className="login__inputs">
          <label className="login__label">
            Email
            <input
              className="login__input"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={submitting}
              placeholder="your@email.com"
            />
          </label>

          <label className="login__label">
            Password
            <input
              className="login__input"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={submitting}
              placeholder="••••••••"
            />
          </label>
        </div>

        {formError && (
          <div className="login__error" aria-live="polite">
            <strong>Error:</strong> {formError}
          </div>
        )}

        <button
          className={`login__button ${
            submitting ? "login__button--loading" : ""
          }`}
          type="submit"
          disabled={submitting || loading || resetting}
        >
          {submitting ? "Signing in..." : "Sign in"}
        </button>

        <div className="login__links">
          <button
            type="button"
            className="login__link-button"
            disabled={submitting || resetting || loading}
            onClick={handleForgotPassword}
          >
            {resetting ? "Sending reset..." : "Forgot password?"}
          </button>
        </div>

        {resetMessage && (
          <p className="login__message" aria-live="polite">
            {resetMessage}
          </p>
        )}
      </form>
    </section>
  );
};

export default LoginForm;
