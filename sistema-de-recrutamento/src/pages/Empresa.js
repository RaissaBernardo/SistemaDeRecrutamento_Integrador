import React from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import Table from "../components/Table";

const Empresa = () => {
  const empresas = [
    ["Tech Solutions", "TI", "São Paulo"],
    ["Finance Corp", "Financeiro", "Rio de Janeiro"]
  ];

  return (
    <div className="app-container">
      <Sidebar />
      <div className="main-content">
        <Header title="Empresas" />
        <Table columns={["Nome", "Setor", "Local"]} data={empresas} />
      </div>
    </div>
  );
};

export default Empresa;
