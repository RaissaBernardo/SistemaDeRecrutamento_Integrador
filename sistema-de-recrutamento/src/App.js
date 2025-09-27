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

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/vagas" element={<Vagas />} />
        <Route path="/candidaturas" element={<Candidaturas />} />
        <Route path="/entrevistas" element={<Entrevistas />} />
        <Route path="/relatorios" element={<Relatorios />} />
        <Route path="/beneficios" element={<Beneficios />} />
        <Route path="/demandas" element={<Demandas />} />
        <Route path="/detalhamento" element={<Detalhamento />} />
        <Route path="/empresa" element={<Empresa />} />
      </Routes>
    </Router>
  );
}

export default App;

