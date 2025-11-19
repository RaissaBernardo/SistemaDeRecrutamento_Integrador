import React, { useEffect, useState } from "react";
import SidebarCandidato from "../../components/SidebarCandidato";

import useModal from "../../hooks/useModal";
import ModalDetalhesCandidatura from "../../components/modals/candidato/ModalDetalhesCandidatura";

import { api } from "../../services/mockApi";
import { getLoggedUser } from "../../services/storageService";

import "../../styles/candidato/MinhasCandidaturas.css";

export default function MinhasCandidaturas({ onLogout }) {
  const [candidaturas, setCandidaturas] = useState([]);
  const [candidaturaSelecionada, setCandidaturaSelecionada] = useState(null);

  // controller do modal
  const detalhesModal = useModal();

  /* ============================================================
     🔄 CARREGAR CANDIDATURAS DO USUÁRIO
  ============================================================ */
  useEffect(() => {
    const logged = getLoggedUser();
    if (!logged) return;

    const todas = api.getCandidaturas() || [];
    const minhas = todas.filter(c => c.candidatoEmail === logged.email);

    setCandidaturas(minhas);
  }, []);

  /* ============================================================
     ❌ CANCELAR CANDIDATURA
  ============================================================ */
  function cancelar(id) {
    if (!window.confirm("Tem certeza que deseja cancelar esta candidatura?")) return;

    api.deleteCandidatura(id);

    setCandidaturas(prev => prev.filter(c => c.id !== id));
  }

  /* ============================================================
     🔍 ABRIR MODAL DE DETALHES
  ============================================================ */
  function abrirDetalhes(c) {
    setCandidaturaSelecionada(c);
    detalhesModal.open();
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

                <div className="left" onClick={() => abrirDetalhes(c)}>
                  <strong>{c.vagaTitulo}</strong>

                  <div className="meta">
                    {c.empresa} • {new Date(c.data).toLocaleDateString("pt-BR")}
                  </div>
                </div>

                <div className="right">
                  <span className={`badge ${c.status?.toLowerCase()}`}>
                    {c.status}
                  </span>

                  <button
                    className="btn small ghost danger"
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

      {/* ============================================================
         🟦 MODAL DE DETALHES — SÓ RENDERIZA QUANDO TEM DADOS
      ============================================================ */}
      {detalhesModal.isOpen && candidaturaSelecionada && (
        <ModalDetalhesCandidatura
          isOpen={detalhesModal.isOpen}
          onClose={detalhesModal.close}
          candidatura={candidaturaSelecionada}
        />
      )}

    </div>
  );
}
