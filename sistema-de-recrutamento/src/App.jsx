import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Vagas from "./pages/Vagas";
import Candidaturas from "./pages/Candidaturas";
import Entrevistas from "./pages/Entrevistas";
import Relatorios from "./pages/Relatorios";
import Beneficios from "./pages/Beneficios";
import Demandas from "./pages/Demandas";
import Detalhamento from "./pages/Detalhamento";
import Empresa from "./pages/Empresa";
import Login from "./pages/Login";
import PrivateRoute from "./components/PrivateRoute";

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Rotas públicas */}
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />

        {/* Rotas privadas */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/vagas"
          element={
            <PrivateRoute>
              <Vagas />
            </PrivateRoute>
          }
        />
        <Route
          path="/candidaturas"
          element={
            <PrivateRoute>
              <Candidaturas />
            </PrivateRoute>
          }
        />
        <Route
          path="/entrevistas"
          element={
            <PrivateRoute>
              <Entrevistas />
            </PrivateRoute>
          }
        />
        <Route
          path="/relatorios"
          element={
            <PrivateRoute>
              <Relatorios />
            </PrivateRoute>
          }
        />
        <Route
          path="/beneficios"
          element={
            <PrivateRoute>
              <Beneficios />
            </PrivateRoute>
          }
        />
        <Route
          path="/demandas"
          element={
            <PrivateRoute>
              <Demandas />
            </PrivateRoute>
          }
        />
        <Route
          path="/detalhamento"
          element={
            <PrivateRoute>
              <Detalhamento />
            </PrivateRoute>
          }
        />
        <Route
          path="/empresa"
          element={
            <PrivateRoute>
              <Empresa />
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
}
