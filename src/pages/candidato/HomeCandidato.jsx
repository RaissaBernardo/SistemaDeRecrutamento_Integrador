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
      <main className="main-content-candidato home-page">
        <section className="welcome-section">
          <h1>Bem-vindo, {nome || "Candidato"}</h1>
          <p className="muted">Aqui você acompanha suas vagas, candidaturas e entrevistas.</p>
        </section>
      </main>
    </div>
  );
}
