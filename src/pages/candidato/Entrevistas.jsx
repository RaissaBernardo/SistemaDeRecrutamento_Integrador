import React, { useEffect, useState } from "react";
import "../../styles/candidato/Entrevistas.css";

import { api } from "../../services/mockApi";
import { getLoggedUser } from "../../services/storageService";

import useModal from "../../hooks/useModal";
import ModalDetalhesEntrevista from "../../components/modals/candidato/ModalDetalhesEntrevistaCandidato.jsx";

export default function EntrevistasCandidato() {
  const [entrevistas, setEntrevistas] = useState([]);
  const modal = useModal();

  useEffect(() => {
    const user = getLoggedUser();
    if (!user) return;

    const all = api.entrevistas.getAll() || [];

    const minhas = all.filter(
      (e) => e.candidatoEmail === user.email
    );

    setEntrevistas(minhas);
  }, []);

  function abrirDetalhes(ent) {
    modal.open(ent);
  }

  function badgeStatus(status) {
    if (!status) return "";

    const map = {
      "Entrevista agendada": "badge agendada",
      Aprovado: "badge aprovado",
      Reprovado: "badge reprovado",
    };

    return map[status] || "badge";
  }

  return (
    <div className="main-content page-entrevistas-candidato">
      <h1>Minhas entrevistas</h1>

      {entrevistas.length === 0 ? (
        <p className="muted">Você não possui entrevistas agendadas no momento.</p>
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
                {/* Badge do status */}
                <span className={badgeStatus(e.status)}>
                  {e.status}
                </span>

                {/* Botão */}
                <button className="btn detalhes" onClick={() => abrirDetalhes(e)}>
                  Ver detalhes
                </button>
              </div>

            </li>
          ))}
        </ul>
      )}

      <ModalDetalhesEntrevista
        isOpen={modal.isOpen}
        onClose={modal.close}
        data={modal.data}
        onCancelar={(id) => {
          api.entrevistas.delete(id);

          const user = getLoggedUser();
          const restantes = api.entrevistas
            .getAll()
            .filter((e) => e.candidatoEmail === user.email);

          setEntrevistas(restantes);
          modal.close();
        }}
      />
    </div>
  );
}
