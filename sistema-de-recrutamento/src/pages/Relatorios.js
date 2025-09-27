import React from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";

const Relatorios = () => {
  return (
    <div className="app-container">
      <Sidebar />
      <div className="main-content">
        <Header title="Relatórios" />
        <div className="relatorio-cards">
          <div className="card">Relatório de Vagas</div>
          <div className="card">Relatório de Candidaturas</div>
          <div className="card">Relatório de Entrevistas</div>
        </div>
      </div>
    </div>
  );
};

export default Relatorios;
