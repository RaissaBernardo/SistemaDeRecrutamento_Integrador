import React from "react";
import { Navigate, useLocation } from "react-router-dom";

/**
 * Componente de rota protegida.
 * Impede acesso a rotas privadas caso o usuário não esteja autenticado.
 * 
 * @param {boolean} authenticated - Indica se o usuário está autenticado.
 * @param {ReactNode} children - Conteúdo da rota protegida.
 */
export default function PrivateRoute({ authenticated, children }) {
  const location = useLocation();

  // 🔒 Caso não esteja autenticado, redireciona para o login
  // e mantém a rota de origem (para navegação pós-login)
  if (!authenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return children;
}
