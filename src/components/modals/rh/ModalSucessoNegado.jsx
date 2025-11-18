import React from "react";
import ModalBase from "../ModalBase";

export default function ModalSucessoNegado({ onClose }) {
  return (
    <ModalBase title="Candidatura recusada" onClose={onClose}>
      <p>A recusa foi registrada com sucesso.</p>

      <div className="modal-actions">
        <button className="btn primary" onClick={onClose}>Fechar</button>
      </div>
    </ModalBase>
  );
}
