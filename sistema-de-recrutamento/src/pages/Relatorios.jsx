import React from "react";
import "../styles/Pages.css";

export default function Relatorios() {
  return (
    <div className="page">
      <h2>Relatórios</h2>
      <div className="rel-grid">
        <div className="rel-card">Relatório de Vagas</div>
        <div className="rel-card">Relatório de Candidaturas</div>
        <div className="rel-card">Relatório de Entrevistas</div>
      </div>
    </div>
  );
}
