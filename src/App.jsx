import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import Header from "./components/Header.jsx";
import Sidebar from "./components/Sidebar.jsx";
import PrivateRoute from "./components/PrivateRoute.jsx";

// Páginas base
import Login from "./pages/Login.jsx";
import Cadastro from "./pages/Cadastro.jsx";

// RH
import Dashboard from "./pages/RH/Dashboard.jsx";
import Vagas from "./pages/RH/Vagas.jsx";
import VagaForm from "./pages/RH/VagaForm.jsx";
import DetalhesVaga from "./pages/RH/DetalhesVaga.jsx";
import Candidaturas from "./pages/RH/Candidaturas.jsx";
import Entrevistas from "./pages/RH/Entrevistas.jsx";

// Candidato
import HomeCandidato from "./pages/candidato/HomeCandidato.jsx";
import VagasDisponiveis from "./pages/candidato/VagasDisponiveis.jsx";
import MinhasCandidaturas from "./pages/candidato/MinhasCandidaturas.jsx";
import PerfilCandidato from "./pages/candidato/PerfilCandidato.jsx";
import EntrevistasCandidato from "./pages/candidato/Entrevistas.jsx";

import "./styles/base/App.css";
import { getLoggedUser, clearLoggedUser } from "./services/storageService";

export default function App() {
  const [authenticated, setAuthenticated] = useState(false);
  const [userType, setUserType] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const user = getLoggedUser();
    if (user) {
      setAuthenticated(true);
      setUserType(user.tipoUsuario);
    }
  }, []);

  const handleLogout = () => {
    clearLoggedUser();
    setAuthenticated(false);
    setUserType(null);
  };

  return (
    <Router>
      <div className={`app-root ${sidebarOpen ? "sidebar-open" : ""}`}>
        {authenticated && userType === "rh" && (
          <Sidebar onLogout={handleLogout} onToggle={setSidebarOpen} />
        )}

        <div className={`main-area ${authenticated && userType === "rh" ? "with-sidebar" : ""}`}>
          {authenticated && <Header setAuthenticated={setAuthenticated} />}

          <div className="page-area">
            <Routes>
              {/* PUBLIC */}
              <Route
                path="/login"
                element={
                  authenticated ? (
                    userType === "rh" ? (
                      <Navigate to="/dashboard" />
                    ) : (
                      <Navigate to="/home-candidato" />
                    )
                  ) : (
                    <Login setAuthenticated={setAuthenticated} setUserType={setUserType} />
                  )
                }
              />
              <Route path="/cadastro" element={<Cadastro />} />

              {/* RH */}
              <Route
                path="/dashboard"
                element={
                  <PrivateRoute authenticated={authenticated && userType === "rh"}>
                    <Dashboard />
                  </PrivateRoute>
                }
              />
              <Route
                path="/vagas"
                element={
                  <PrivateRoute authenticated={authenticated && userType === "rh"}>
                    <Vagas />
                  </PrivateRoute>
                }
              />

              {/* 🔹 FORM DE VAGA (NOVA + EDIÇÃO) */}
              <Route
                path="/vaga-form"
                element={
                  <PrivateRoute authenticated={authenticated && userType === "rh"}>
                    <VagaForm />
                  </PrivateRoute>
                }
              />
              <Route
                path="/vaga-form/:id"
                element={
                  <PrivateRoute authenticated={authenticated && userType === "rh"}>
                    <VagaForm />
                  </PrivateRoute>
                }
              />

              <Route
                path="/detalhes-vaga"
                element={
                  <PrivateRoute authenticated={authenticated}>
                    <DetalhesVaga />
                  </PrivateRoute>
                }
              />
              <Route
                path="/candidaturas"
                element={
                  <PrivateRoute authenticated={authenticated && userType === "rh"}>
                    <Candidaturas />
                  </PrivateRoute>
                }
              />
              <Route
                path="/entrevistas"
                element={
                  <PrivateRoute authenticated={authenticated && userType === "rh"}>
                    <Entrevistas />
                  </PrivateRoute>
                }
              />

              {/* CANDIDATO */}
              <Route
                path="/home-candidato"
                element={
                  <PrivateRoute authenticated={authenticated && userType === "candidato"}>
                    <HomeCandidato onLogout={handleLogout} />
                  </PrivateRoute>
                }
              />
              <Route
                path="/vagas-disponiveis"
                element={
                  <PrivateRoute authenticated={authenticated && userType === "candidato"}>
                    <VagasDisponiveis onLogout={handleLogout} />
                  </PrivateRoute>
                }
              />
              <Route
                path="/minhas-candidaturas"
                element={
                  <PrivateRoute authenticated={authenticated && userType === "candidato"}>
                    <MinhasCandidaturas onLogout={handleLogout} />
                  </PrivateRoute>
                }
              />
              <Route
                path="/perfil-candidato"
                element={
                  <PrivateRoute authenticated={authenticated && userType === "candidato"}>
                    <PerfilCandidato onLogout={handleLogout} />
                  </PrivateRoute>
                }
              />
              <Route
                path="/entrevistas-candidato"
                element={
                  <PrivateRoute authenticated={authenticated && userType === "candidato"}>
                    <EntrevistasCandidato onLogout={handleLogout} />
                  </PrivateRoute>
                }
              />

              {/* ROOT */}
              <Route
                path="/"
                element={
                  authenticated ? (
                    userType === "rh" ? (
                      <Navigate to="/dashboard" />
                    ) : (
                      <Navigate to="/home-candidato" />
                    )
                  ) : (
                    <Navigate to="/login" />
                  )
                }
              />
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
}
