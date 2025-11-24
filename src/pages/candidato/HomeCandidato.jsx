import React, { useEffect, useState } from "react";
import { api } from "../../services/mockApi";
import { getLoggedUser } from "../../services/storageService";

import "../../styles/candidato/HomeCandidato.css";

export default function HomeCandidato() {
  const [nome, setNome] = useState("");
  const [perfil, setPerfil] = useState({});
  const [candidaturas, setCandidaturas] = useState([]);
  const [entrevistas, setEntrevistas] = useState([]);
  const [vagasRecomendadas, setVagasRecomendadas] = useState([]);

  useEffect(() => {
    const logged = getLoggedUser();
    if (!logged) return;

    setNome(logged.nome);

    const p = api.perfis.get(logged.email);
    setPerfil(p || {});

    const allCands = api.candidaturas.getAll() || [];
    setCandidaturas(allCands.filter(c => c.candidatoEmail === logged.email));

    const allEnts = api.entrevistas.getAll() || [];
    setEntrevistas(allEnts.filter(e => e.candidatoEmail === logged.email));

    const vagas = api.vagas.getAll() || [];

    const recomendadas =
      p?.area && vagas.some(v => v.area)
        ? vagas.filter(v => v.area?.toLowerCase() === p.area?.toLowerCase())
        : vagas.slice(0, 3);

    setVagasRecomendadas(recomendadas);
  }, []);

  return (
    <div className="main-content">
      <main className="dash-page">

        {/* Header */}
        <section className="dash-top">
          <h1>Olá, {nome || "Candidato"} 👋</h1>
          <p className="muted">Aqui está um resumo do seu progresso.</p>
        </section>

        {/* Cards */}
        <section className="cards">
          <div className="card small">
            <div>
              <div className="card-title">Minhas candidaturas</div>
              <div className="card-number">{candidaturas.length}</div>
            </div>
            <span className="card-icon">📝</span>
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

        {/* Recomendações */}
        <section className="box">
          <h2>Vagas recomendadas</h2>

          {vagasRecomendadas.length === 0 ? (
            <p className="muted">Nenhuma recomendação disponível.</p>
          ) : (
            <ul className="modern-list">
              {vagasRecomendadas.slice(0, 5).map((v) => (
                <li key={v.id}>
                  <div className="left-zone">
                    <strong>{v.titulo}</strong>
                    <span className="meta">{v.empresa}</span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* Status das candidaturas */}
        <section className="box">
          <h2>Status das minhas candidaturas</h2>

          {candidaturas.length === 0 ? (
            <p className="muted">Você ainda não se candidatou.</p>
          ) : (
            <ul className="modern-list">
              {candidaturas.slice(0, 5).map((c) => (
                <li key={c.id}>
                  <div className="left-zone">
                    <strong>{c.vagaTitulo}</strong>
                    <span className="meta">Empresa: {c.empresa}</span>
                  </div>

                  <span className={`status-chip status-${c.status.toLowerCase().replace(/\s+/g, "-")}`}>
                    {c.status}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>

      </main>
    </div>
  );
}
