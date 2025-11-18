import React from "react";
import ModalBase from "../ModalBase";

export default function ModalDetalhesEntrevista({ entrevista, onClose }) {
  return (
    <ModalBase title="Detalhes da entrevista" onClose={onClose}>
      <p><strong>Vaga:</strong> {entrevista.vagaTitulo}</p>
      <p><strong>Empresa:</strong> {entrevista.empresa}</p>
      <p><strong>Data:</strong> {entrevista.data} às {entrevista.horario}</p>
      <p><strong>Status:</strong> {entrevista.status}</p>
      <p><strong>Link:</strong> {entrevista.linkMeet}</p>

      <div className="modal-actions">
        <button className="btn primary" onClick={onClose}>Fechar</button>
      </div>
    </ModalBase>
  );
}
