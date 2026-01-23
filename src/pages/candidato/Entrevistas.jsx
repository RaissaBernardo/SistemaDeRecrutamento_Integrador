import React, { useEffect, useState } from "react";
import "../../styles/candidato/Entrevistas.css";

import { api } from "../../services/mockApi";
import { getLoggedUser } from "../../services/storageService";

import useModal from "../../hooks/useModal";

import ModalDetalhesEntrevista from "../../components/modals/candidato/ModalDetalhesEntrevistaCandidato.jsx";
import ModalResultadoFinal from "../../components/modals/candidato/ModalResultadoFinal.jsx";

export default function EntrevistasCandidato() {
  const [entrevistas, setEntrevistas] = useState([]);

  const modalDetalhes = useModal();
  const modalResultado = useModal();

  useEffect(() => {
    const user = getLoggedUser();
    if (!user) return;

    const all = api.entrevistas.getAll() || [];
    const minhas = all.filter((e) => e.candidatoEmail === user.email);

    setEntrevistas(minhas);
  }, []);

  function abrirDetalhes(ent) {
    modalDetalhes.open(ent);
  }

  function abrirResultado(ent) {
    modalResultado.open(ent);
  }

  function cancelarEntrevista(id) {
    api.entrevistas.delete(id);

    const user = getLoggedUser();
    const restantes = api.entrevistas
      .getAll()
      .filter((e) => e.candidatoEmail === user.email);

    setEntrevistas(restantes);
    modalDetalhes.close();
  }

  // ============================
  // BADGES — PADRÃO OFICIAL
  // ============================
  function badgeStatus(status) {
    if (!status) return "badge pendente";

    const map = {
      Pendente: "badge pendente",
      "Em análise": "badge em-analise",
      "Entrevista agendada": "badge entrevista-agendada",
      Aprovado: "badge aprovado",
      Reprovado: "badge reprovado",
      Cancelado: "badge cancelado",
      Cancelada: "badge cancelado",
    };

    return map[status] || "badge pendente";
  }

  return (
    <div className="main-content page-entrevistas-candidato">
      <h1>Minhas entrevistas</h1>

      {entrevistas.length === 0 ? (
        <p className="muted">
          Você não possui entrevistas agendadas no momento.
        </p>
      ) : (
        <ul className="lista-entrevistas">
          {entrevistas.map((e) => (
            <li key={e.id} className="item-entrevista">
              <div className="info">
                <strong>{e.vagaTitulo}</strong>
                <span>{e.empresa}</span>
                <span className="data">
                  {new Date(e.data).toLocaleDateString("pt-BR")} —{" "}
                  {e.horario || "--:--"}
                </span>
              </div>

              <div className="acoes">
                {/* BADGE STATUS */}
                <span className={badgeStatus(e.status)}>
                  {e.status || "Pendente"}
                </span>

                {/* FEEDBACK FINAL */}
                {["Aprovado", "Reprovado"].includes(e.status) && (
                  <button
                    className="btn-feedback"
                    onClick={() => abrirResultado(e)}
                  >
                    Feedback
                  </button>
                )}

                {/* VER DETALHES */}
                <button
                  className="btn detalhes"
                  onClick={() => abrirDetalhes(e)}
                >
                  Ver detalhes
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <ModalDetalhesEntrevista
        isOpen={modalDetalhes.isOpen}
        onClose={modalDetalhes.close}
        data={modalDetalhes.data}
        onCancelar={cancelarEntrevista}
      />

      <ModalResultadoFinal
        isOpen={modalResultado.isOpen}
        onClose={modalResultado.close}
        data={modalResultado.data}
      />
    </div>
  );
}
