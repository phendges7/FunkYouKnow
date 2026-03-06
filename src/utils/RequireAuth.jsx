import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// Protege rotas sensíveis (ex: Admin)
const RequireAuth = ({ adminOnly = false }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  // Aguarda carregamento da sessão sem quebrar layout
  if (loading) return null;

  // Redireciona usuários não autenticados
  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  // Se for rota admin e o usuário não for admin
  if (adminOnly && !user.isAdmin) {
    return <Navigate to="/login" replace />;
  }

  // Tudo certo
  return <Outlet />;
};

export default RequireAuth;
