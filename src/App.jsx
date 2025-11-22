import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

// 🆕 Página nova
import DetalhesCandidato from "./pages/RH/DetalhesCandidato.jsx";

// 🧩 Componentes globais
import Header from "./components/Header.jsx";
import Sidebar from "./components/Sidebar.jsx";
import SidebarCandidato from "./components/SidebarCandidato.jsx";
import PrivateRoute from "./components/PrivateRoute.jsx";

// 🔐 Páginas públicas
import Login from "./pages/Login.jsx";
import Cadastro from "./pages/Cadastro.jsx";

// 🏢 RH
import Dashboard from "./pages/RH/Dashboard.jsx";
import Vagas from "./pages/RH/Vagas.jsx";
import VagaForm from "./pages/RH/VagaForm.jsx";
import DetalhesVaga from "./pages/RH/DetalhesVaga.jsx";
import Candidaturas from "./pages/RH/Candidaturas.jsx";
import Entrevistas from "./pages/RH/Entrevistas.jsx";

// 👤 Candidato
import HomeCandidato from "./pages/candidato/HomeCandidato.jsx";
import VagasDisponiveis from "./pages/candidato/VagasDisponiveis.jsx";
import MinhasCandidaturas from "./pages/candidato/MinhasCandidaturas.jsx";
import PerfilCandidato from "./pages/candidato/PerfilCandidato.jsx";
import EntrevistasCandidato from "./pages/candidato/Entrevistas.jsx";

// 🆕 IMPORT NECESSÁRIO PARA FUNCIONAR A PÁGINA DE DETALHES
import DetalhesVagaCandidato from "./pages/candidato/DetalhesVaga.jsx";

// 🎨 Estilos
import "./styles/base/App.css";

// 💾 Storage
import { getLoggedUser, clearLoggedUser } from "./services/storageService";

export default function App() {
  const [authenticated, setAuthenticated] = useState(false);
  const [userType, setUserType] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Recupera login salvo
  useEffect(() => {
    const user = getLoggedUser();
    if (user) {
      setAuthenticated(true);
      setUserType(user.tipoUsuario);
    }
  }, []);

  // Logout global
  const handleLogout = () => {
    clearLoggedUser();
    setAuthenticated(false);
    setUserType(null);
  };

  return (
    <Router>
      <div className={`app-root ${sidebarOpen ? "sidebar-open" : ""}`}>

        {/* Sidebar dinâmica */}
        {authenticated && userType === "rh" && (
          <Sidebar onLogout={handleLogout} onToggle={setSidebarOpen} />
        )}

        {authenticated && userType === "candidato" && (
          <SidebarCandidato onLogout={handleLogout} onToggle={setSidebarOpen} />
        )}

        {/* Área principal */}
        <div className={`main-area ${authenticated ? "with-sidebar" : ""}`}>
          
          {authenticated && <Header setAuthenticated={setAuthenticated} />}

          <div className="page-area">
            <Routes>

              {/* ROTAS PÚBLICAS */}
              <Route
                path="/login"
                element={
                  authenticated ? (
                    <Navigate to={userType === "rh" ? "/dashboard" : "/home-candidato"} />
                  ) : (
                    <Login setAuthenticated={setAuthenticated} setUserType={setUserType} />
                  )
                }
              />

              <Route path="/cadastro" element={<Cadastro />} />

              {/* ROTAS RH */}
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
                  <PrivateRoute authenticated={authenticated && userType === "rh"}>
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

              {/* 🆕 ROTA NOVA — Tela Detalhes do Candidato */}
              <Route
                path="/candidaturas/:id"
                element={
                  <PrivateRoute authenticated={authenticated && userType === "rh"}>
                    <DetalhesCandidato />
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

              {/* ROTAS CANDIDATO */}
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

              {/* 🆕 ROTA ADICIONADA PARA O DETALHES DA VAGA DO CANDIDATO */}
              <Route
                path="/detalhes-vaga-candidato"
                element={
                  <PrivateRoute authenticated={authenticated && userType === "candidato"}>
                    <DetalhesVagaCandidato />
                  </PrivateRoute>
                }
              />

              {/* ROOT */}
              <Route
                path="/"
                element={
                  authenticated ? (
                    <Navigate to={userType === "rh" ? "/dashboard" : "/home-candidato"} />
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
