import React from "react";
import Table from "../components/Table.jsx";
import "../styles/Pages.css";

export default function Vagas() {
  const columns = ["ID", "Título", "Localização", "Data"];
  const data = [
    { id: 1, título: "Desenvolvedor Frontend", localização: "São Paulo", data: "10/10/2025" },
    { id: 2, título: "Analista de Dados", localização: "Remoto", data: "05/10/2025" },
  ];

  // Note: Table lowercases column names to match object keys
  return (
    <div className="page">
      <h2>Vagas</h2>
      <Table columns={columns} data={data} />
    </div>
  );
}
