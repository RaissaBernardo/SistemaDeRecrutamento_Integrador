import React from "react";
import ModalBase from "../ModalBase";

export default function ModalSucessoAprovado({ onClose }) {
  return (
    <ModalBase title="Candidato aprovado!" onClose={onClose}>
      <p>O candidato foi aprovado com sucesso.</p>

      <div className="modal-actions">
        <button className="btn primary" onClick={onClose}>Fechar</button>
      </div>
    </ModalBase>
  );
}
