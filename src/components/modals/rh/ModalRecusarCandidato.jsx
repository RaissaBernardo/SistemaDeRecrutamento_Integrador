import React, { useState } from "react";
import ModalBase from "../ModalBase";
import { api } from "../../../services/mockApi";

export default function ModalRecusarCandidato({ candidatura, onClose, onSuccess }) {
  const [motivo, setMotivo] = useState("");

  function recusar() {
    api.candidaturas.updateStatus(candidatura.id, "Recusado", motivo);

    onClose();
    onSuccess?.();
  }

  return (
    <ModalBase title="Recusar candidato" onClose={onClose}>
      <label>Motivo da recusa</label>
      <textarea
        value={motivo}
        onChange={e => setMotivo(e.target.value)}
        placeholder="Descreva o motivo..."
      />

      <div className="modal-actions">
        <button className="btn ghost" onClick={onClose}>Cancelar</button>
        <button className="btn delete" onClick={recusar}>Recusar</button>
      </div>
    </ModalBase>
  );
}
