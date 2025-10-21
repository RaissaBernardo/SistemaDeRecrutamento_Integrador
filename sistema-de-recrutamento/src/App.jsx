import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import Header from "./components/Header.jsx";
import Sidebar from "./components/Sidebar.jsx";
import PrivateRoute from "./components/PrivateRoute.jsx";

import Login from "./pages/Login.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Vagas from "./pages/Vagas.jsx";
import Candidaturas from "./pages/Candidaturas.jsx";
import Entrevistas from "./pages/Entrevistas.jsx";
import Relatorios from "./pages/Relatorios.jsx";
import Beneficios from "./pages/Beneficios.jsx";
import Demandas from "./pages/Demandas.jsx";
import Detalhamento from "./pages/Detalhamento.jsx";
import Empresa from "./pages/Empresa.jsx";

import "./styles/App.css";

export default function App() {
  // autenticação simples (substituir por backend real depois)
  const [authenticated, setAuthenticated] = useState(false);

  return (
    <Router>
      <div className="app-root">
        {authenticated && <Sidebar />}
        <div className={`main-area ${authenticated ? "with-sidebar" : ""}`}>
          {authenticated && <Header setAuthenticated={setAuthenticated} />}

          <div className="page-area">
            <Routes>
              {/* Public */}
              <Route path="/login" element={<Login setAuthenticated={setAuthenticated} />} />
              <Route path="/"
                element={authenticated ? <Navigate to="/dashboard" /> : <Navigate to="/login" />} />

              {/* Private */}
              <Route path="/dashboard" element={<PrivateRoute authenticated={authenticated}><Dashboard /></PrivateRoute>} />
              <Route path="/vagas" element={<PrivateRoute authenticated={authenticated}><Vagas /></PrivateRoute>} />
              <Route path="/candidaturas" element={<PrivateRoute authenticated={authenticated}><Candidaturas /></PrivateRoute>} />
              <Route path="/entrevistas" element={<PrivateRoute authenticated={authenticated}><Entrevistas /></PrivateRoute>} />
              <Route path="/relatorios" element={<PrivateRoute authenticated={authenticated}><Relatorios /></PrivateRoute>} />
              <Route path="/beneficios" element={<PrivateRoute authenticated={authenticated}><Beneficios /></PrivateRoute>} />
              <Route path="/demandas" element={<PrivateRoute authenticated={authenticated}><Demandas /></PrivateRoute>} />
              <Route path="/detalhamento" element={<PrivateRoute authenticated={authenticated}><Detalhamento /></PrivateRoute>} />
              <Route path="/empresa" element={<PrivateRoute authenticated={authenticated}><Empresa /></PrivateRoute>} />

              <Route path="*" element={<Navigate to={authenticated ? "/dashboard" : "/login"} />} />
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
}
