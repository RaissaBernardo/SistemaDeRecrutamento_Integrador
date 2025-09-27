import React from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import Table from "../components/Table";

const Candidaturas = () => {
  const candidaturas = [
    ["João Silva", "Desenvolvedor Frontend", "Em Análise"],
    ["Maria Souza", "Analista Financeiro", "Aprovado"],
    ["Carlos Lima", "RH Generalista", "Reprovado"]
  ];

  return (
    <div className="app-container">
      <Sidebar />
      <div className="main-content">
        <Header title="Candidaturas" />
        <Table columns={["Nome", "Vaga", "Status"]} data={candidaturas} />
      </div>
    </div>
  );
};

export default Candidaturas;
