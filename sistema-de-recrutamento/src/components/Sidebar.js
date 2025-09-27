import React from "react";
import "./Sidebar.css";
import { Link } from "react-router-dom";

const Sidebar = () => {
  return (
    <div className="sidebar">
      <h2>Portal Oportunidades</h2>
      <nav>
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/vagas">Vagas</Link>
        <Link to="/candidaturas">Candidaturas</Link>
        <Link to="/entrevistas">Entrevistas</Link>
        <Link to="/relatorios">Relatórios</Link>
        <Link to="/beneficios">Benefícios</Link>
        <Link to="/demandas">Demandas</Link>
        <Link to="/detalhamento">Detalhamento</Link>
        <Link to="/empresa">Empresas</Link>
      </nav>
    </div>
  );
};

export default Sidebar;
