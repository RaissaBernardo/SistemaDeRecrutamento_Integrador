import React, { useEffect, useState } from "react";
import { getCandidaturas, getEntrevistas, getVagas } from "../../services/storageService";
import "../../styles/rh/Dashboard.css";

export default function Dashboard() {
  const [candidaturas, setCandidaturas] = useState([]);
  const [vagas, setVagas] = useState([]);
  const [entrevistas, setEntrevistas] = useState([]);

  useEffect(() => {
    setCandidaturas(getCandidaturas() || []);
    setVagas(getVagas() || []);
    setEntrevistas(getEntrevistas() || []);
  }, []);

  return (
    <div className="app-container">
      <main className="main-content dash-page">
        <div className="dash-top">
          <h1>Painel do RH</h1>
          <p className="muted">Visão geral dos seus processos seletivos</p>
        </div>

        <section className="cards-superiores">
          <div className="card"><div className="card-label">Vagas ativas</div><div className="card-number">{vagas.length}</div></div>
          <div className="card"><div className="card-label">Candidaturas</div><div className="card-number">{candidaturas.length}</div></div>
          <div className="card"><div className="card-label">Entrevistas</div><div className="card-number">{entrevistas.length}</div></div>
        </section>
      </main>
    </div>
  );
}
