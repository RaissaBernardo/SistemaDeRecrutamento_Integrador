import React, { useState } from "react";
import ModalBase from "../ModalBase";
import { api } from "../../../services/mockApi";

export default function ModalMarcarEntrevista({ candidatura, onClose, onSuccess }) {
  const [data, setData] = useState("");
  const [horario, setHorario] = useState("");
  const [linkMeet, setLinkMeet] = useState("");

  function marcar() {
    api.entrevistas.create({
      candidatoEmail: candidatura.candidatoEmail,
      vagaTitulo: candidatura.vagaTitulo,
      empresa: candidatura.empresa,
      data,
      horario,
      linkMeet,
      status: "Agendada"
    });

    api.candidaturas.updateStatus(candidatura.id, "Entrevista agendada");

    onClose();
    onSuccess?.();
  }

  return (
    <ModalBase title="Marcar entrevista" onClose={onClose}>
      <label>Data</label>
      <input type="date" value={data} onChange={e => setData(e.target.value)} />

      <label>Horário</label>
      <input type="time" value={horario} onChange={e => setHorario(e.target.value)} />

      <label>Link do Meet</label>
      <input type="text" value={linkMeet} onChange={e => setLinkMeet(e.target.value)} />

      <div className="modal-actions">
        <button className="btn ghost" onClick={onClose}>Cancelar</button>
        <button className="btn primary" onClick={marcar}>Confirmar</button>
      </div>
    </ModalBase>
  );
}
