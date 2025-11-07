import React, { useEffect, useState } from "react";
import SidebarCandidato from "../../components/SidebarCandidato";
import "../../styles/candidato/HomeCandidato.css";
import { getLoggedUser, getProfile } from "../../services/storageService";

export default function HomeCandidato({ onLogout }) {
  const [nome, setNome] = useState("");
  const [resumo, setResumo] = useState("");
  const [area, setArea] = useState("");

  useEffect(() => {
    const logged = getLoggedUser();
    if (!logged) return;
    setNome(logged.nome || "");
    const profile = getProfile(logged.email);
    if (profile) {
      setResumo(profile.resumo || "");
      setArea(profile.area || "");
    }
  }, []);

  return (
    <div className="app-candidato">
      <SidebarCandidato onLogout={onLogout} />
      <main className="main-content-candidato dash-page">
        <section className="dash-top">
          <h1>Olá, {nome || "Candidato"} 👋</h1>
          <p className="muted">Acompanhe aqui suas vagas, candidaturas e entrevistas.</p>
        </section>

        <section className="cards">
          <div className="card small">
            <div>
              <div className="card-title">Minhas candidaturas</div>
              <div className="card-number">--</div>
            </div>
            <span className="card-icon">📄</span>
          </div>

          <div className="card small">
            <div>
              <div className="card-title">Entrevistas agendadas</div>
              <div className="card-number">--</div>
            </div>
            <span className="card-icon">📅</span>
          </div>

          <div className="card small">
            <div>
              <div className="card-title">Vagas recomendadas</div>
              <div className="card-number">--</div>
            </div>
            <span className="card-icon">💼</span>
          </div>
        </section>

        <section className="latest">
          <h2>Status das minhas candidaturas</h2>
          <ul className="last-list">
            <li>
              <span className="meta">Nenhuma candidatura cadastrada ainda</span>
            </li>
          </ul>
        </section>
      </main>
    </div>
  );
}
