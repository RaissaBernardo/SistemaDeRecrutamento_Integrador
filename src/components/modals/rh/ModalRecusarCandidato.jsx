import React, { useState } from "react";
import ModalBase from "../ModalBase";
import { api } from "../../../services/mockApi";

export default function ModalRecusarCandidato({
  isOpen,
  candidatura,
  onClose,
  onSuccess,
}) {
  const [motivo, setMotivo] = useState("");

  if (!isOpen || !candidatura) return null;

  function recusar() {
    const candId = candidatura.id;

    // 1️⃣ Atualizar candidatura
    api.candidaturas.updateStatus(candId, "Reprovado");

    // 2️⃣ Salvar o motivo da recusa como feedback
    const all = api.candidaturas.getAll();
    const idx = all.findIndex((c) => c.id === candId);

    if (idx !== -1) {
      all[idx].feedback = motivo;

      // atualizar no banco
      const db = JSON.parse(localStorage.getItem("mock_database"));
      db.candidaturas = all;
      localStorage.setItem("mock_database", JSON.stringify(db));
    }

    // 3️⃣ Se existir entrevista, atualizar também
    const entrevistas = api.entrevistas.getAll() || [];
    const ent = entrevistas.find(
      (e) =>
        e.vagaId === candidatura.vagaId &&
        e.candidatoEmail === candidatura.candidatoEmail
    );

    if (ent) {
      api.entrevistas.updateStatus(ent.id, "Reprovado");
    }

    // 4️⃣ Notificar parent
    if (onSuccess) onSuccess();

    // 5️⃣ Fechar modal
    onClose();
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
        <button className="btn ghost" onClick={onClose}>
          Cancelar
        </button>

        <button className="btn danger" onClick={recusar}>
          Confirmar recusa
        </button>
      </div>
    </ModalBase>
  );
}
