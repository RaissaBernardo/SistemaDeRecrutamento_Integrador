import React from "react";
import { Navigate, useLocation } from "react-router-dom";

/**
 * Rota protegida com controle de autenticação + tipo de usuário
 *
 * @param {boolean} authenticated - Define se o usuário está logado.
 * @param {string|string[]} allowedRoles - Tipos de usuário permitidos.
 * @param {ReactNode} children - Conteúdo liberado.
 */
export default function PrivateRoute({
  authenticated,
  allowedRoles = null,
  children,
}) {
  const location = useLocation();

  // 🔒 Não autenticado → volta ao login
  if (!authenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  // 🟦 Busca tipo correto salvo no storage
  const user = JSON.parse(localStorage.getItem("loggedUser"));
  const userType = user?.tipo; // ← AQUI está a correção!

  // 🔐 Controle de roles (RH / candidato)
  if (allowedRoles) {
    const rolesArr = Array.isArray(allowedRoles)
      ? allowedRoles
      : [allowedRoles];

    if (!rolesArr.includes(userType)) {
      return <Navigate to="/login" replace />;
    }
  }

  return children;
}
