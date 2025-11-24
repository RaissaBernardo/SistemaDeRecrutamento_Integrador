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

    // 🔐 FILTRA APENAS AS ENTREVISTAS DO USUÁRIO LOGADO
    const minhas = all.filter(
      (e) => e.candidatoEmail === user.email
    );

    setEntrevistas(minhas);
  }, []);

  function abrirDetalhes(ent) {
    modal.open(ent);
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

              <button className="btn detalhes" onClick={() => abrirDetalhes(e)}>
                Ver detalhes
              </button>
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

          // Atualiza lista depois de deletar
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
