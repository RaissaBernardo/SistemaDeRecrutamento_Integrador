import React from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import Table from "../components/Table";

const Demandas = () => {
  const demandas = [
    ["Desenvolvedor Frontend", "Alta"],
    ["Analista Financeiro", "Média"]
  ];

  return (
    <div className="app-container">
      <Sidebar />
      <div className="main-content">
        <Header title="Demandas" />
        <Table columns={["Título", "Prioridade"]} data={demandas} />
      </div>
    </div>
  );
};

export default Demandas;
