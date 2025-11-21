import React from "react";
import ModalBase from "../ModalBase";

export default function ModalSucessoAprovado({ isOpen, onClose }) {
  return (
    <ModalBase isOpen={isOpen} onClose={onClose} title="Candidato aprovado!">
      <p>O candidato foi aprovado com sucesso.</p>

      <div className="modal-actions">
        <button className="btn primary" onClick={onClose}>Fechar</button>
      </div>
    </ModalBase>
  );
}
