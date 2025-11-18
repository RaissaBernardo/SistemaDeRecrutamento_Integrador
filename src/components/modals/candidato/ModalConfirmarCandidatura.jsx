import React from "react";
import ModalBase from "../ModalBase";
import { api } from "../../../services/mockApi";

export default function ModalConfirmarCandidatura({ vaga, candidatoEmail, onClose, onSuccess }) {
  function confirmar() {
    api.candidaturas.create({
      candidatoEmail,
      vagaId: vaga.id,
      vagaTitulo: vaga.titulo,
      empresa: vaga.empresa,
      data: new Date().toLocaleDateString(),
      status: "Recebida"
    });

    onClose();
    onSuccess?.(); // para recarregar a página
  }

  return (
    <ModalBase title="Confirmar candidatura" onClose={onClose}>
      <p>Deseja realmente se candidatar para a vaga <strong>{vaga.titulo}</strong>?</p>

      <div className="modal-actions">
        <button className="btn ghost" onClick={onClose}>Cancelar</button>
        <button className="btn primary" onClick={confirmar}>Confirmar</button>
      </div>
    </ModalBase>
  );
}
