import React, { useState } from "react";
import ModalBase from "../ModalBase";
import { api } from "../../../services/mockApi";

export default function ModalMarcarEntrevista({ candidatura, onClose, onSuccess }) {
  const [data, setData] = useState("");
  const [horario, setHorario] = useState("");

  const [formato, setFormato] = useState("meet");  
  const [endereco, setEndereco] = useState("");
  const [linkMeet, setLinkMeet] = useState("");

  function marcar() {
    api.entrevistas.schedule({
      vagaId: candidatura.vagaId,
      candidatoEmail: candidatura.candidatoEmail,
      nomeCandidato: candidatura.nome,
      vagaTitulo: candidatura.vagaTitulo,
      empresa: candidatura.empresa,

      data,
      horario,
      formato,
      endereco,
      linkMeet,
    });

    api.candidaturas.updateStatus(candidatura.id, "Entrevista agendada");

    onClose();
    onSuccess?.();
  }

  return (
    <ModalBase title="Marcar entrevista" onClose={onClose}>
      <label>Data</label>
      <input type="date" value={data} onChange={(e) => setData(e.target.value)} />

      <label>Horário</label>
      <input type="time" value={horario} onChange={(e) => setHorario(e.target.value)} />

      <label>Formato da entrevista</label>
      <select value={formato} onChange={(e) => setFormato(e.target.value)}>
        <option value="meet">Meet (online)</option>
        <option value="presencial">Presencial</option>
        <option value="hibrido">Híbrido</option>
      </select>

      {formato === "meet" && (
        <>
          <label>Link do Meet</label>
          <input
            type="text"
            value={linkMeet}
            onChange={(e) => setLinkMeet(e.target.value)}
            placeholder="https://meet.google.com/..."
          />
        </>
      )}

      {(formato === "presencial" || formato === "hibrido") && (
        <>
          <label>Endereço</label>
          <input
            type="text"
            value={endereco}
            onChange={(e) => setEndereco(e.target.value)}
            placeholder="Rua, número, bairro..."
          />
        </>
      )}

      <div className="modal-actions">
        <button className="btn ghost" onClick={onClose}>Cancelar</button>
        <button className="btn primary" onClick={marcar}>Confirmar</button>
      </div>
    </ModalBase>
  );
}
