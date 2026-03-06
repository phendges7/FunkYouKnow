import { useToast } from "../../../../context/ToastContext";
import useAdminPasswordReset from "../../hooks/useAdminPasswordReset";
import "./AdminPasswordResetForm.css";

const AdminPasswordResetForm = () => {
  const { showToast } = useToast();
  const { email, setEmail, loading, error, setError, submitResetRequest } =
    useAdminPasswordReset();

  const handleSubmit = async (event) => {
    event.preventDefault();

    const success = await submitResetRequest();
    if (!success) return;

    showToast("Password reset email sent successfully.", "success");
    setEmail("");
  };

  return (
    <form className="admin-password-reset-form" onSubmit={handleSubmit}>
      <p className="admin-password-reset-form__description">
        Send a recovery link to an admin email. The user will set a new
        password from the email link.
      </p>

      <label className="admin-password-reset-form__label">
        Admin email
        <input
          className="admin-password-reset-form__input"
          type="email"
          value={email}
          onChange={(event) => {
            setEmail(event.target.value);
            if (error) setError("");
          }}
          placeholder="admin@email.com"
          required
          disabled={loading}
        />
      </label>

      {error ? (
        <p className="admin-password-reset-form__error" role="alert">
          {error}
        </p>
      ) : null}

      <button
        className="admin-password-reset-form__submit"
        type="submit"
        disabled={loading}
      >
        {loading ? "Sending..." : "Send reset email"}
      </button>
    </form>
  );
};

export default AdminPasswordResetForm;
