import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import adminUsersService from "../../../features/admin/services/adminUsersService";
import { useAuth } from "../../../context/AuthContext";
import { useToast } from "../../../context/ToastContext";
import "./ResetPasswordForm.css";

const MIN_PASSWORD_LENGTH = 8;

const ResetPasswordForm = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showToast } = useToast();

  const [loadingSession, setLoadingSession] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [sessionError, setSessionError] = useState("");
  const [formError, setFormError] = useState("");

  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");

  useEffect(() => {
    let isMounted = true;

    const initRecoverySession = async () => {
      try {
        await adminUsersService.preparePasswordRecoverySession();
        if (!isMounted) return;
        setSessionError("");
      } catch (error) {
        if (!isMounted) return;
        setSessionError(error.message || "Invalid or expired recovery link");
      } finally {
        if (isMounted) setLoadingSession(false);
      }
    };

    initRecoverySession();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (password.length < MIN_PASSWORD_LENGTH) {
      setFormError(`Password must have at least ${MIN_PASSWORD_LENGTH} characters.`);
      return;
    }

    if (password !== repeatPassword) {
      setFormError("Passwords do not match.");
      return;
    }

    setSubmitting(true);
    setFormError("");
    const wasAuthenticated = Boolean(user);

    try {
      await adminUsersService.updateRecoveredAdminPassword({ password });

      if (wasAuthenticated) {
        showToast("Password updated successfully. Please sign in again.", "success");
        navigate("/login", { replace: true });
        return;
      }

      // Forces a full reload so the app boots cleanly on the login page.
      window.location.assign("/login");
    } catch (error) {
      setFormError(error.message || "Could not update password.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingSession) {
    return (
      <section className="reset-password">
        <h1 className="reset-password__title">Reset Password</h1>
        <p className="reset-password__state">Validating recovery link...</p>
      </section>
    );
  }

  if (sessionError) {
    return (
      <section className="reset-password">
        <h1 className="reset-password__title">Reset Password</h1>
        <p className="reset-password__error" role="alert">
          {sessionError}
        </p>
        <button
          className="reset-password__button"
          type="button"
          onClick={() => navigate("/login")}
        >
          Back to login
        </button>
      </section>
    );
  }

  return (
    <section className="reset-password">
      <h1 className="reset-password__title">Reset Password</h1>

      <form className="reset-password__form" onSubmit={handleSubmit}>
        <label className="reset-password__label">
          New password
          <input
            className="reset-password__input"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
            disabled={submitting}
          />
        </label>

        <label className="reset-password__label">
          Repeat new password
          <input
            className="reset-password__input"
            type="password"
            value={repeatPassword}
            onChange={(event) => setRepeatPassword(event.target.value)}
            required
            disabled={submitting}
          />
        </label>

        {formError ? (
          <p className="reset-password__error" role="alert">
            {formError}
          </p>
        ) : null}

        <button
          className="reset-password__button"
          type="submit"
          disabled={submitting}
        >
          {submitting ? "Updating..." : "Update password"}
        </button>
      </form>
    </section>
  );
};

export default ResetPasswordForm;
