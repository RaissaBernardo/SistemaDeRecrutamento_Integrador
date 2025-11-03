import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import Header from "./components/Header.jsx";
import Sidebar from "./components/Sidebar.jsx";
import PrivateRoute from "./components/PrivateRoute.jsx";

import Login from "./pages/Login.jsx";
import CadastrarVaga from "./pages/cadastrarVaga.jsx";
import Cadastro from "./pages/Cadastro.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Vagas from "./pages/Vagas.jsx";
import Candidaturas from "./pages/Candidaturas.jsx";
import Entrevistas from "./pages/Entrevistas.jsx"; 



import "./styles/App.css";

export default function App() {
  // autenticação simples (substituir por backend real depois)
  const [authenticated, setAuthenticated] = useState(false);

  return (
    <Router>
      <div className="app-root">
        {authenticated && <Sidebar onLogout={() => setAuthenticated(false)} />}
        <div className={`main-area ${authenticated ? "with-sidebar" : ""}`}>
          {authenticated && <Header setAuthenticated={setAuthenticated} />}

          <div className="page-area">
            <Routes>
              {/* Public routes */}
              <Route path="/login" element={<Login setAuthenticated={setAuthenticated} />} />
              <Route path="/cadastro" element={<Cadastro />} />

              {/* Redirect root path based on auth */}
              <Route
                path="/"
                element={
                  authenticated ? <Navigate to="/dashboard" /> : <Navigate to="/login" />
                }
              />

              {/* Private routes */}
              <Route
                path="/dashboard"
                element={
                  <PrivateRoute authenticated={authenticated}>
                    <Dashboard />
                  </PrivateRoute>
                }
              />
              <Route
                path="/vagas"
                element={
                  <PrivateRoute authenticated={authenticated}>
                    <Vagas />
                  </PrivateRoute>
                }
              />
              <Route
                path="/cadastrar-vaga"
                element={
                  <PrivateRoute authenticated={authenticated}>
                    <CadastrarVaga />
                  </PrivateRoute>
                }
              />
              <Route
                path="/candidaturas"
                element={
                  <PrivateRoute authenticated={authenticated}>
                    <Candidaturas />
                  </PrivateRoute>
                }
              />
              <Route
                path="/entrevistas"
                element={
                  <PrivateRoute authenticated={authenticated}>
                    <Entrevistas />
                  </PrivateRoute>
                }
              />
    
              {/* Fallback */}
              <Route
                path="*"
                element={<Navigate to={authenticated ? "/dashboard" : "/login"} />}
              />
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
}
