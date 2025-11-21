import React, { useState } from "react";
import ModalBase from "../ModalBase";
import { api } from "../../../services/mockApi";

export default function ModalRecusarCandidato({ isOpen, candidatura, onClose, onSuccess }) {
  const [motivo, setMotivo] = useState("");

  if (!candidatura) return null;

  function recusar() {
    api.candidaturas.updateStatus(candidatura.id, "Recusado", motivo);

    onClose();
    onSuccess?.();
  }

  return (
    <ModalBase isOpen={isOpen} onClose={onClose} title="Recusar candidato">
      <label>Motivo da recusa</label>
      <textarea
        value={motivo}
        onChange={(e) => setMotivo(e.target.value)}
        placeholder="Descreva o motivo..."
      />

      <div className="modal-actions">
        <button className="btn ghost" onClick={onClose}>Cancelar</button>
        <button className="btn danger" onClick={recusar}>Confirmar recusa</button>
      </div>
    </ModalBase>
  );
}
