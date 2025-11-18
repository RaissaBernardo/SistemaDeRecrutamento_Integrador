import React, { useEffect, useState } from "react";
import SidebarCandidato from "../../components/SidebarCandidato";

// ✔ Importa o mockApi corretamente
import { api } from "../../services/mockApi";

import { getLoggedUser } from "../../services/storageService";

import "../../styles/candidato/HomeCandidato.css";

export default function HomeCandidato({ onLogout }) {
  const [nome, setNome] = useState("");
  const [perfil, setPerfil] = useState({});
  const [candidaturas, setCandidaturas] = useState([]);
  const [entrevistas, setEntrevistas] = useState([]);
  const [vagasRecomendadas, setVagasRecomendadas] = useState([]);

  useEffect(() => {
    const logged = getLoggedUser();
    if (!logged) return;

    setNome(logged.nome);

    // 1 — Perfil do candidato
    const p = api.getProfile(logged.email);
    setPerfil(p || {});

    // 2 — Candidaturas dele
    const allCands = api.getCandidaturas();
    const minhas = allCands.filter(c => c.candidatoEmail === logged.email);
    setCandidaturas(minhas);

    // 3 — Entrevistas dele
    const allEnts = api.getEntrevistas();
    const minhasEnts = allEnts.filter(e => e.candidatoEmail === logged.email);
    setEntrevistas(minhasEnts);

    // 4 — Vagas recomendadas pela área do perfil
    const vagas = api.getVagas();

    const recomendadas =
      p?.area
        ? vagas.filter(v => v.area?.toLowerCase() === p.area.toLowerCase())
        : vagas.slice(0, 3); // fallback caso não haja área

    setVagasRecomendadas(recomendadas);
  }, []);

  return (
    <div className="app-candidato">
      <SidebarCandidato onLogout={onLogout} />

      <main className="main-content-candidato dash-page">
        
        {/* HEADER */}
        <section className="dash-top">
          <h1>Olá, {nome || "Candidato"} 👋</h1>
          <p className="muted">
            Acompanhe suas vagas, candidaturas e entrevistas.
          </p>
        </section>

        {/* CARDS */}
        <section className="cards">
          <div className="card small">
            <div>
              <div className="card-title">Minhas candidaturas</div>
              <div className="card-number">{candidaturas.length}</div>
            </div>
            <span className="card-icon">📄</span>
          </div>

          <div className="card small">
            <div>
              <div className="card-title">Entrevistas agendadas</div>
              <div className="card-number">{entrevistas.length}</div>
            </div>
            <span className="card-icon">📅</span>
          </div>

          <div className="card small">
            <div>
              <div className="card-title">Vagas recomendadas</div>
              <div className="card-number">{vagasRecomendadas.length}</div>
            </div>
            <span className="card-icon">💼</span>
          </div>
        </section>

        {/* VAGAS RECOMENDADAS */}
        <section className="latest">
          <h2>Vagas recomendadas</h2>

          {vagasRecomendadas.length === 0 ? (
            <p className="muted">Nenhuma recomendação no momento.</p>
          ) : (
            <ul className="last-list">
              {vagasRecomendadas.slice(0, 5).map(v => (
                <li key={v.id}>
                  <strong>{v.titulo}</strong>
                  <span className="meta">{v.empresa}</span>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* STATUS DAS CANDIDATURAS */}
        <section className="latest">
          <h2>Status das minhas candidaturas</h2>

          {candidaturas.length === 0 ? (
            <p className="muted">Nenhuma candidatura cadastrada ainda.</p>
          ) : (
            <ul className="last-list">
              {candidaturas.slice(0, 5).map(c => (
                <li key={c.id}>
                  <strong>{c.vagaTitulo}</strong>
                  <span className="meta">Status: {c.status}</span>
                </li>
              ))}
            </ul>
          )}
        </section>

      </main>
    </div>
  );
}
