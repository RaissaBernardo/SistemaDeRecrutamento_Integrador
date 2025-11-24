import React, { useEffect, useState } from "react";
import useModal from "../../hooks/useModal";
import ModalDetalhesCandidatura from "../../components/modals/candidato/ModalDetalhesCandidatura";

import { api } from "../../services/mockApi";
import { getLoggedUser } from "../../services/storageService";

import "../../styles/candidato/MinhasCandidaturas.css";

export default function MinhasCandidaturas() {
  const [candidaturas, setCandidaturas] = useState([]);
  const [candidaturaSelecionada, setCandidaturaSelecionada] = useState(null);

  const detalhesModal = useModal();

  // =======================================
  // Normalizar nome -> classe CSS
  // =======================================
  function normalizarStatus(status) {
    if (!status) return "";

    return status
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace("entrevista-agendada", "entrevista-agendada")
      .replace("em-analise", "em-análise");
  }

  // =======================================
  // Carregar candidaturas SEM alterar status
  // =======================================
  function carregar() {
    const logged = getLoggedUser();
    if (!logged) return;

    const todas = api.candidaturas.getAll() || [];
    const minhas = todas.filter((c) => c.candidatoEmail === logged.email);

    setCandidaturas(minhas);
  }

  useEffect(() => {
    carregar();
  }, []);

  // =======================================
  // CANCELAR
  // =======================================
  function cancelar(id) {
    if (!window.confirm("Tem certeza que deseja cancelar esta candidatura?")) return;

    const ok = api.candidaturas.delete(id);

    if (!ok) {
      alert("Você não pode cancelar uma candidatura que já está em análise ou foi processada.");
      return;
    }

    setCandidaturas((prev) => prev.filter((c) => c.id !== id));
  }

  // =======================================
  // ABRIR DETALHES
  // =======================================
  function abrirDetalhes(c) {
    setCandidaturaSelecionada(c);
    detalhesModal.open();
  }

  return (
    <div className="main-content">
      <main className="main-content-candidato candidaturas-page">
        <h1>Minhas candidaturas</h1>

        {candidaturas.length === 0 ? (
          <p className="empty">Você ainda não se candidatou a nenhuma vaga.</p>
        ) : (
          <ul className="lista-candidaturas">
            {candidaturas.map((c) => {
              const classeStatus = normalizarStatus(c.status);

              return (
                <li key={c.id} className={`item-candidatura ${classeStatus}`}>
                  <span className={`status-badge status-${classeStatus}`}>
                    {c.status}
                  </span>

                  <div className="left" onClick={() => abrirDetalhes(c)}>
                    <strong>{c.vagaTitulo}</strong>

                    <div className="meta">
                      {c.empresa} • {new Date(c.data).toLocaleDateString("pt-BR")}
                    </div>
                  </div>

                  <div className="right">
                    <button
                      className="btn small ghost"
                      onClick={() => abrirDetalhes(c)}
                    >
                      Detalhes
                    </button>

                    {/* 🚫 Só mostra o botão cancelar se o status for Pendente */}
                    {c.status === "Pendente" && (
                      <button
                        className="btn small ghost danger"
                        onClick={() => cancelar(c.id)}
                      >
                        Cancelar
                      </button>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </main>

      {detalhesModal.isOpen && candidaturaSelecionada && (
        <ModalDetalhesCandidatura
          isOpen={detalhesModal.isOpen}
          onClose={() => {
            detalhesModal.close();
            carregar();
          }}
          candidatura={candidaturaSelecionada}
        />
      )}
    </div>
  );
}
