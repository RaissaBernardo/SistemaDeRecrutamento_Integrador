import React from "react";
import ModalBase from "../ModalBase";

export default function ModalSucessoMarcada({ onClose }) {
  return (
    <ModalBase title="Entrevista marcada!" onClose={onClose}>
      <p>A entrevista foi agendada com sucesso.</p>

      <div className="modal-actions">
        <button className="btn primary" onClick={onClose}>OK</button>
      </div>
    </ModalBase>
  );
}
