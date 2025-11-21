import React from "react";
import ModalBase from "../ModalBase";
import { api } from "../../../services/mockApi";
import { getLoggedUser } from "../../../services/storageService";

export default function ModalConfirmarCandidatura({ isOpen, vaga, onClose, onSuccess }) {
  
  function confirmar() {
    const user = getLoggedUser();
    if (!user) return;

    api.candidaturas.create({
      vagaId: vaga.id,
      candidatoEmail: user.email,
      nome: user.nome,
      tituloVaga: vaga.titulo,
      empresa: vaga.empresa
    });

    onClose();
    onSuccess?.();
  }

  return (
    <ModalBase isOpen={isOpen} title="Confirmar candidatura" onClose={onClose}>
      <p>
        Deseja realmente se candidatar para a vaga{" "}
        <strong>{vaga.titulo}</strong>?
      </p>

      <div className="modal-actions">
        <button className="btn ghost" onClick={onClose}>
          Cancelar
        </button>

        <button className="btn primary" onClick={confirmar}>
          Confirmar
        </button>
      </div>
    </ModalBase>
  );
}
