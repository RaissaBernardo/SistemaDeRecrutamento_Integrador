// src/App.js
import React from "react";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Demandas from "./pages/Demandas";
import Beneficios from "./pages/Beneficios";
import Detalhamento from "./pages/Detalhamento";
import Empresa from "./pages/Empresa";

// Página inicial simples
function Home() {
  return (
    <div>
      <h1>Bem-vindo ao Sistema de Recrutamento</h1>
      <p>Use o menu lateral para navegar entre as páginas.</p>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Sidebar />
      <div style={{ marginLeft: "220px", padding: "20px" }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/demandas" element={<Demandas />} />
          <Route path="/beneficios" element={<Beneficios />} />
          <Route path="/detalhamento" element={<Detalhamento />} />
          <Route path="/empresa" element={<Empresa />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
