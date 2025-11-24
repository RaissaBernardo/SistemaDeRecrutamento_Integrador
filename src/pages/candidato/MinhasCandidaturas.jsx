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

  // 🔧 Normalizar status para casar com o CSS
  function normalizarStatus(status) {
    if (!status) return "";
    return status
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace("agendada", "entrevista-agendada"); 
  }

  // ======================================================
  // 🔄 CARREGAR CANDIDATURAS + DETECTAR ENTREVISTAS
  // ======================================================
  function carregar() {
    const logged = getLoggedUser();
    if (!logged) return;

    const todas = api.candidaturas.getAll() || [];
    const minhas = todas.filter((c) => c.candidatoEmail === logged.email);

    const entrevistas = api.entrevistas.getAll() || [];

    const ajustadas = minhas.map((c) => {
      const temEntrevista = entrevistas.some(
        (e) => e.vagaId === c.vagaId && e.candidatoEmail === c.candidatoEmail
      );

      return {
        ...c,
        status: temEntrevista ? "Entrevista Agendada" : c.status,
      };
    });

    setCandidaturas(ajustadas);
  }

  useEffect(() => {
    carregar();
  }, []);

  // ❌ CANCELAR
  function cancelar(id) {
    if (!window.confirm("Tem certeza que deseja cancelar esta candidatura?"))
      return;
    api.candidaturas.delete(id);
    setCandidaturas((prev) => prev.filter((c) => c.id !== id));
  }

  // 🔍 DETALHES
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
                <li
                  key={c.id}
                  className={`item-candidatura ${classeStatus}`}
                >
                  <span className={`status-badge status-${classeStatus}`}>
                    {c.status}
                  </span>

                  <div className="left" onClick={() => abrirDetalhes(c)}>
                    <strong>{c.vagaTitulo}</strong>
                    <div className="meta">
                      {c.empresa} •{" "}
                      {new Date(c.data).toLocaleDateString("pt-BR")}
                    </div>
                  </div>

                  <div className="right">
                    <button
                      className="btn small ghost"
                      onClick={() => abrirDetalhes(c)}
                    >
                      Detalhes
                    </button>

                    <button
                      className="btn small ghost danger"
                      onClick={() => cancelar(c.id)}
                    >
                      Cancelar
                    </button>
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
          onClose={detalhesModal.close}
          candidatura={candidaturaSelecionada}
        />
      )}
    </div>
  );
}
