import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "../../utils/supabaseClient";
import { useAuth } from "../../utils/AuthProvider";

import "./LoginForm.css";

const LoginForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, loading } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [formError, setFormError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const from = location.state?.from?.pathname || "/";

  // Redireciona automaticamente se já houver sessão
  useEffect(() => {
    if (loading) return;
    if (!user) return;

    if (user.isAdmin) {
      navigate("/admin", { replace: true });
    } else {
      navigate(from, { replace: true });
    }
  }, [user, loading, from, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);
    setSubmitting(true);

    try {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        setFormError(signInError.message || "Invalid credentials.");
        setSubmitting(false);
        return;
      }

      // AuthProvider fará o redirect automático
      setSubmitting(false);
    } catch (err) {
      setFormError(err?.message || "Unexpected error.");
      setSubmitting(false);
    }
  };

  return (
    <section className="login">
      <h1 className="login__title">Login</h1>

      <form className="login__form" onSubmit={handleSubmit} noValidate>
        <div className="login__inputs">
          <label htmlFor="email" className="login__label">
            Email
            <input
              id="email"
              type="email"
              className="login__input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
            />
          </label>

          <label htmlFor="password" className="login__label">
            Password
            <input
              id="password"
              type="password"
              className="login__input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
            />
          </label>
        </div>

        {formError && (
          <p className="login__error" role="alert">
            {formError}
          </p>
        )}

        <button className="login__button" type="submit" disabled={submitting}>
          {submitting ? "Signing in..." : "Sign in"}
        </button>

        <div className="login__links">
          <p>
            Forgot password?{" "}
            <span
              className="login__link"
              onClick={() => alert("Reset password flow coming soon.")}
            >
              Reset here
            </span>
          </p>
          <p>
            Don’t have an account?{" "}
            <span
              className="login__link"
              onClick={() => alert("Sign-up not implemented yet.")}
            >
              Sign up
            </span>
          </p>
        </div>

        <button
          type="button"
          className="login__cancel"
          onClick={() => navigate("/")}
        >
          Cancel
        </button>
      </form>
    </section>
  );
};

export default LoginForm;
