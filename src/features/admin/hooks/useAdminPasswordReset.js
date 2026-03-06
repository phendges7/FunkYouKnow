import { useState } from "react";
import adminUsersService from "../services/adminUsersService";

const useAdminPasswordReset = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const submitResetRequest = async () => {
    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedEmail) {
      setError("Email is required");
      return false;
    }

    setLoading(true);
    setError("");

    try {
      await adminUsersService.requestAdminPasswordReset({
        email: normalizedEmail,
      });

      return true;
    } catch (err) {
      setError(err.message || "Could not send password reset email");
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    email,
    setEmail,
    loading,
    error,
    setError,
    submitResetRequest,
  };
};

export default useAdminPasswordReset;
