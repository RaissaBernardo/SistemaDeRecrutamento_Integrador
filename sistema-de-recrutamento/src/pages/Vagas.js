import React from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import Table from "../components/Table";

const Vagas = () => {
  const vagas = [
    ["Desenvolvedor Frontend", "Remoto", "01/10/2025"],
    ["Analista Financeiro", "São Paulo", "15/09/2025"],
    ["RH Generalista", "Curitiba", "20/09/2025"]
  ];

  return (
    <div className="app-container">
      <Sidebar />
      <div className="main-content">
        <Header title="Vagas" />
        <Table columns={["Título", "Localização", "Data de Publicação"]} data={vagas} />
      </div>
    </div>
  );
};

export default Vagas;
