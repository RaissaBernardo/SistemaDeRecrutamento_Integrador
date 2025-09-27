import React from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import Table from "../components/Table";

const Entrevistas = () => {
  const entrevistas = [
    ["João Silva", "Desenvolvedor Frontend", "28/09/2025"],
    ["Maria Souza", "Analista Financeiro", "30/09/2025"]
  ];

  return (
    <div className="app-container">
      <Sidebar />
      <div className="main-content">
        <Header title="Entrevistas" />
        <Table columns={["Candidato", "Vaga", "Data"]} data={entrevistas} />
      </div>
    </div>
  );
};

export default Entrevistas;
