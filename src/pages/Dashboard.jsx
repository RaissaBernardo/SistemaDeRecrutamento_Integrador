import React, { useState } from "react";
import "../styles/Pages.css";
import "../styles/Dashboard.css";

export default function DashboardRh() {
  const [filtro, setFiltro] = useState("todas");

  return (
    <div className="pagina">
      <div className="topo">
        <h2>📊 Dashboard</h2>
      </div>

      {/* Filtro */}
      <div className="filtro-container">
        <label>Filtrar por:</label>
        <select
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
          className="select"
        >
          <option value="todas">Todas as vagas</option>
          <option value="abertas">Abertas</option>
          <option value="fechadas">Fechadas</option>
        </select>
      </div>

      {/* Cards superiores */}
      <div className="cards-superiores">
        <div className="card">
          <span className="icone">📁</span>
          <p>Vagas em aberto</p>
          <h1>—</h1>
        </div>

        <div className="card">
          <span className="icone">👤</span>
          <p>Candidaturas recebidas</p>
          <h1>—</h1>
        </div>

        <div className="card">
          <span className="icone">🗓️</span>
          <p>Entrevistas agendadas</p>
          <h1>—</h1>
        </div>

        <div className="card">
          <span className="icone">🌟</span>
          <p>Contratações</p>
          <h1>—</h1>
        </div>
      </div>

      {/* Conteúdo central */}
      <div className="dashboard-container">

        {/* Gráfico placeholder */}
        <div className="box-grafico">
          <h4>Candidaturas por mês</h4>
          <div className="grafico-placeholder">
            <p>(gráfico aqui)</p>
          </div>
        </div>

        {/* Últimas candidaturas */}
        <div className="box-candidaturas">
          <h4>Últimas candidaturas</h4>

          <div className="linha-candidatura">
            <span className="nome">—</span>
            <small>Hoje</small>
          </div>

          <div className="linha-candidatura">
            <span className="nome">—</span>
            <small>Ontem</small>
          </div>

          <div className="linha-candidatura">
            <span className="nome">—</span>
            <small>—</small>
          </div>

          <div className="linha-candidatura">
            <span className="nome">—</span>
            <small>—</small>
          </div>

        </div>

      </div>
    </div>
  );
}