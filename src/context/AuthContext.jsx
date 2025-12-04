// src/context/AuthContext.jsx
import { createContext, useContext } from "react";

// Contexto de autenticação global
export const AuthContext = createContext({
  user: null,
  loading: true,
});

// Hook de acesso rápido ao contexto
export const useAuth = () => useContext(AuthContext);
