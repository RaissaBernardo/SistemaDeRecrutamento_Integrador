import React from "react";
import Table from "../components/Table.jsx";
import "../styles/Pages.css";

export default function Entrevistas() {
  const columns = ["ID", "Candidato", "Vaga", "Data"];
  const data = [
    { id: 1, candidato: "Lucas", vaga: "Frontend", data: "22/10/2025" },
  ];
  return (
    <div className="page">
      <h2>Entrevistas</h2>
      <Table columns={columns} data={data} />
    </div>
  );
}
