import React from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";

const Detalhamento = () => {
  const detalhes = {
    titulo: "Desenvolvedor Frontend",
    descricao: "Responsável por criar interfaces e integrar com APIs.",
    requisitos: "React, CSS, APIs REST",
    salario: "R$ 6.000,00",
    local: "Remoto"
  };

  return (
    <div className="app-container">
      <Sidebar />
      <div className="main-content">
        <Header title="Detalhamento da Vaga" />
        <div className="card">
          <h2>{detalhes.titulo}</h2>
          <p><strong>Descrição:</strong> {detalhes.descricao}</p>
          <p><strong>Requisitos:</strong> {detalhes.requisitos}</p>
          <p><strong>Salário:</strong> {detalhes.salario}</p>
          <p><strong>Local:</strong> {detalhes.local}</p>
        </div>
      </div>
    </div>
  );
};

export default Detalhamento;
