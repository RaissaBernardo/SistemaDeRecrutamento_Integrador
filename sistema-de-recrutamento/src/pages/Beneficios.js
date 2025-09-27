import React from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import Table from "../components/Table";

const Beneficios = () => {
  const beneficios = [
    ["Vale Transporte", "Ativo"],
    ["Plano de Saúde", "Ativo"],
    ["Vale Refeição", "Inativo"]
  ];

  return (
    <div className="app-container">
      <Sidebar />
      <div className="main-content">
        <Header title="Benefícios" />
        <Table columns={["Benefício", "Status"]} data={beneficios} />
      </div>
    </div>
  );
};

export default Beneficios;
