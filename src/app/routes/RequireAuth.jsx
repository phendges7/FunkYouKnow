import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

// Tiny inline fallback to avoid "blank screen" during auth loading.
// Replace with your Skeleton/Spinner component later if you want.
const AuthGateFallback = () => {
  return (
    <div
      style={{
        minHeight: "40vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem",
      }}
      aria-busy="true"
      aria-live="polite"
    >
      <span>Loading…</span>
    </div>
  );
};

const RequireAuth = ({ adminOnly = false }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  // 1) Loading: show a minimal fallback so layout doesn't "disappear"
  if (loading) return <AuthGateFallback />;

  // 2) Not authenticated: send to login, preserving where they came from
  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  // 3) Admin guard: do NOT assume isAdmin exists on user
  // Support common shapes:
  // - user.isAdmin (custom merged user)
  // - user.user_metadata.isAdmin (Supabase metadata pattern)
  // - user.app_metadata.isAdmin (another common place)
  const isAdmin =
    Boolean(user?.isAdmin) ||
    Boolean(user?.user_metadata?.isAdmin) ||
    Boolean(user?.app_metadata?.isAdmin);

  if (adminOnly && !isAdmin) {
    return <Navigate to="/admin" replace />;
  }

  return <Outlet />;
};

export default RequireAuth;
