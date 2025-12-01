import React, { useEffect, useState } from "react";
import "../../styles/candidato/Entrevistas.css";

import { api } from "../../services/mockApi";
import { getLoggedUser } from "../../services/storageService";

import useModal from "../../hooks/useModal";

import ModalDetalhesEntrevista from "../../components/modals/candidato/ModalDetalhesEntrevistaCandidato.jsx";
import ModalResultadoFinal from "../../components/modals/candidato/ModalResultadoFinal.jsx";

export default function EntrevistasCandidato() {
  const [entrevistas, setEntrevistas] = useState([]);

  // Modal de detalhes
  const modalDetalhes = useModal();

  // Modal de Resultado Final (feedback do RH)
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

  /** Classes dos badges de status */
  function badgeStatus(status) {
    if (!status) return "badge";

    const map = {
      "Entrevista agendada": "badge agendada",
      Aprovado: "badge aprovado",
      Reprovado: "badge reprovado",
      Cancelada: "badge cancelada",
    };

    return map[status] || "badge";
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
                  {new Date(e.data).toLocaleDateString("pt-BR")} — {e.horario}
                </span>
              </div>

              <div className="acoes">
                {/* BADGE STATUS */}
                <span className={badgeStatus(e.status)}>
                  {e.status || "Sem status"}
                </span>

                {/* BOTÃO FEEDBACK FINAL — só quando já tem decisão */}
                {["Aprovado", "Reprovado"].includes(e.status) && (
                  <button
                    className="btn-feedback"
                    onClick={() => abrirResultado(e)}
                  >
                    Feedback
                  </button>
                )}

                {/* BOTÃO VER DETALHES */}
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

      {/* MODAL DETALHES */}
      <ModalDetalhesEntrevista
        isOpen={modalDetalhes.isOpen}
        onClose={modalDetalhes.close}
        data={modalDetalhes.data}
        onCancelar={cancelarEntrevista}
      />

      {/* MODAL RESULTADO FINAL */}
      <ModalResultadoFinal
        isOpen={modalResultado.isOpen}
        onClose={modalResultado.close}
        data={modalResultado.data}
      />
    </div>
  );
}
