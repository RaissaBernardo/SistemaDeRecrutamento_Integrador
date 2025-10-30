import React from "react";
import { Navigate } from "react-router-dom";

export default function PrivateRoute({ authenticated, children }) {
  if (!authenticated) return <Navigate to="/login" replace />;
  return children;
}
