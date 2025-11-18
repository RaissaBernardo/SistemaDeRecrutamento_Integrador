import React from "react";
import ModalBase from "../ModalBase";

export default function ModalDetalhesCandidatura({ candidatura, onClose }) {
  return (
    <ModalBase title="Detalhes da candidatura" onClose={onClose}>
      <p><strong>Vaga:</strong> {candidatura.vagaTitulo}</p>
      <p><strong>Empresa:</strong> {candidatura.empresa}</p>
      <p><strong>Status:</strong> {candidatura.status}</p>
      <p><strong>Data:</strong> {candidatura.data}</p>

      <div className="modal-actions">
        <button className="btn primary" onClick={onClose}>Fechar</button>
      </div>
    </ModalBase>
  );
}
