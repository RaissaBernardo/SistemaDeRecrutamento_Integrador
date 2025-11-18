import React from "react";
import { Navigate, useLocation } from "react-router-dom";

/**
 * Rota protegida com suporte a controle de autenticação e tipo de usuário.
 *
 * @param {boolean} authenticated - Define se o usuário está logado.
 * @param {string|string[]} allowedRoles - (Opcional) Tipos de usuário permitidos.
 * @param {ReactNode} children - Conteúdo que deve ser renderizado quando permitido.
 */
export default function PrivateRoute({
  authenticated,
  allowedRoles = null,
  children,
}) {
  const location = useLocation();

  // 🔒 Se não estiver autenticado → volta para login
  if (!authenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  // 📌 Caso existam roles definidas (opcional)
  if (allowedRoles) {
    const userType = JSON.parse(localStorage.getItem("loggedUser"))?.tipoUsuario;

    const rolesArray = Array.isArray(allowedRoles)
      ? allowedRoles
      : [allowedRoles];

    if (!rolesArray.includes(userType)) {
      // 🚫 Usuário autenticado, porém sem permissão
      return <Navigate to="/login" replace />;
    }
  }

  return children;
}
