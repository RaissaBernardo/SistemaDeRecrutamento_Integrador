import React, { useEffect, useState } from "react";
import SidebarCandidato from "../../components/SidebarCandidato";

// ✔ Agora usamos o mockApi correto
import { api } from "../../services/mockApi";

import { getLoggedUser } from "../../services/storageService";

import "../../styles/candidato/MinhasCandidaturas.css";

export default function MinhasCandidaturas({ onLogout }) {
  const [candidaturas, setCandidaturas] = useState([]);

  useEffect(() => {
    const logged = getLoggedUser();
    if (!logged) return;

    // pega TODAS as candidaturas do mock
    const all = api.getCandidaturas();

    // filtra só as do usuário logado
    const minhas = all.filter(c => c.candidatoEmail === logged.email);

    setCandidaturas(minhas);
  }, []);

  // ✔ Cancelar candidatura
  function cancelar(id) {
    if (!window.confirm("Tem certeza que deseja cancelar esta candidatura?")) return;

    api.deleteCandidatura(id); // remove do mockApi corretamente

    setCandidaturas(prev => prev.filter(c => c.id !== id));
  }

  return (
    <div className="app-candidato">
      <SidebarCandidato onLogout={onLogout} />

      <main className="main-content-candidato candidaturas-page">

        <h1>Minhas candidaturas</h1>

        {candidaturas.length === 0 ? (
          <p className="empty">Você ainda não se candidatou a nenhuma vaga.</p>
        ) : (
          <ul className="lista-candidaturas">

            {candidaturas.map((c) => (
              <li key={c.id} className="item-candidatura">

                <div className="left">
                  <strong>{c.vagaTitulo}</strong>

                  <div className="meta">
                    {c.empresa} • {c.data}
                  </div>
                </div>

                <div className="right">

                  <span className={`badge ${c.status?.toLowerCase()}`}>
                    {c.status}
                  </span>

                  <button
                    className="btn small ghost"
                    onClick={() => cancelar(c.id)}
                  >
                    Cancelar
                  </button>

                </div>

              </li>
            ))}

          </ul>
        )}

      </main>
    </div>
  );
}
