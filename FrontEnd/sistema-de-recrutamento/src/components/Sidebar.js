// src/components/Sidebar.js
import React from "react";
import { Link } from "react-router-dom";
import "./Sidebar.css";

function Sidebar() {
  return (
    <div className="sidebar">
      <h2>Recrutamento Ágil</h2>
      <ul>
        <li><Link to="/demandas">📌 Demandas da Indústria</Link></li>
        <li><Link to="/beneficios">✨ Benefícios Esperados</Link></li>
        <li><Link to="/detalhamento">📖 Detalhamento</Link></li>
        <li><Link to="/empresa">🏢 Empresa</Link></li>
      </ul>
    </div>
  );
}

export default Sidebar;
