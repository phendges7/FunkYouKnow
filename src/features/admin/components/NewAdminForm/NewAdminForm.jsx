import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "../../../../context/ToastContext";
import { Eye, EyeOff } from "react-feather";
import adminUsersService from "../../services/adminUsersService";

import "./NewAdminForm.css";

const NewAdminForm = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [form, setForm] = useState({
    email: "",
    password: "",
    repeatPassword: "",
    displayName: "",
  });

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Verifica se as senhas batem antes de enviar
    if (form.password !== form.repeatPassword) {
      showToast("Passwords do not match", "error");
      return;
    }

    setLoading(true);

    try {
      await adminUsersService.createAdminUser({
        email: form.email,
        password: form.password,
        displayName: form.displayName,
      });

      showToast("Admin account created successfully!", "success");
      navigate("/admin");
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  const handleTogglePassword = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <form className="new-admin-form" onSubmit={handleSubmit}>
      <label>
        Display Name
        <input
          name="displayName"
          value={form.displayName}
          onChange={handleChange}
        />
      </label>

      <label>
        Email
        <input
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          required
        />
      </label>

      <label className="new-admin-form__password-label">
        Password
        <div className="new-admin-form__password-wrapper">
          <input
            name="password"
            type={showPassword ? "text" : "password"}
            value={form.password}
            onChange={handleChange}
            required
          />

          <button
            type="button"
            className="toggle-password"
            onClick={handleTogglePassword}
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
      </label>

      <label className="new-admin-form__password-label">
        Repeat Password
        <div className="new-admin-form__password-wrapper">
          <input
            name="repeatPassword"
            type={showPassword ? "text" : "password"}
            value={form.repeatPassword}
            onChange={handleChange}
            required
          />
        </div>
      </label>

      <button className="new-admin-form__submit" disabled={loading}>
        {loading ? "Creating..." : "Create Admin"}
      </button>
    </form>
  );
};

export default NewAdminForm;
