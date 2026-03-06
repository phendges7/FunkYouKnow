import { createContext, useContext } from "react";

// Contexto de autenticação global
export const AuthContext = createContext({
  user: null,
  loading: true,
  logout: async () => {},
  bootReady: false,
  bootExiting: false,
});

// Hook de acesso rápido ao contexto
export const useAuth = () => useContext(AuthContext);
