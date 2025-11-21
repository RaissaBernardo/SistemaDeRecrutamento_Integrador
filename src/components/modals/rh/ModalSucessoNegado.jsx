import React from "react";
import ModalBase from "../ModalBase";

export default function ModalSucessoNegado({ isOpen, onClose }) {
  return (
    <ModalBase isOpen={isOpen} onClose={onClose} title="Candidatura recusada">
      <p>A recusa foi registrada com sucesso.</p>

      <div className="modal-actions">
        <button className="btn primary" onClick={onClose}>Fechar</button>
      </div>
    </ModalBase>
  );
}
