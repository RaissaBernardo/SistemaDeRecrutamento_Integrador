import React from "react";
import Table from "../components/Table.jsx";
import "../styles/Pages.css";

export default function Candidaturas() {
  const columns = ["ID", "Candidato", "Vaga", "Status"];
  const data = [
    { id: 1, candidato: "João", vaga: "Estágio TI", status: "Em análise" },
    { id: 2, candidato: "Maria", vaga: "Desenvolvedor Jr", status: "Aprovada" },
  ];
  return (
    <div className="page">
      <h2>Candidaturas</h2>
      <Table columns={columns} data={data} />
    </div>
  );
}
