import React, { useState, useEffect } from "react";
import ModalBase from "../ModalBase";
import { api } from "../../../services/mockApi";

export default function ModalDetalhesEntrevista({ isOpen, onClose, data }) {
  const [entrevista, setEntrevista] = useState(null);

  const [feedback, setFeedback] = useState("");
  const [status, setStatus] = useState("");

  useEffect(() => {
    if (!data) return;

    // Carrega sempre a versão mais atual do banco
    const todas = api.entrevistas.getAll();
    const encontrada = todas.find((e) => e.id === data.id);

    setEntrevista(encontrada || null);

    if (encontrada) {
      setFeedback(encontrada.feedback || "");
      setStatus(encontrada.status || "");
    }
  }, [data]);

  if (!isOpen) return null;

  if (!entrevista) {
    return (
      <ModalBase title="Detalhes da entrevista" onClose={onClose}>
        <p>Entrevista não encontrada.</p>
      </ModalBase>
    );
  }

  function salvar() {
    // Atualiza status
    api.entrevistas.updateStatus(entrevista.id, status);

    // Atualiza feedback (novo DTO)
    const db = JSON.parse(localStorage.getItem("mock_database"));
    const idx = db.entrevistas.findIndex((e) => e.id === entrevista.id);

    if (idx !== -1) {
      db.entrevistas[idx].feedback = feedback;
      localStorage.setItem("mock_database", JSON.stringify(db));
    }

    onClose();
  }

  return (
    <ModalBase title="Detalhes da entrevista" onClose={onClose}>
      <p><strong>Candidato:</strong> {entrevista.nomeCandidato}</p>
      <p><strong>Vaga:</strong> {entrevista.vagaTitulo}</p>
      <p><strong>Status da entrevista:</strong> {entrevista.status}</p>
      <p><strong>Data e hora:</strong> {entrevista.data} • {entrevista.horario}</p>

      {/* O DTO novo não possui "local", então a linha foi removida */}

      <h3 style={{ marginTop: "20px" }}>Anotações / Feedback</h3>

      <textarea
        className="modal-textarea"
        placeholder="Adicione anotações sobre o desempenho do candidato..."
        value={feedback}
        onChange={(e) => setFeedback(e.target.value)}
      />

      <label className="modal-label">Status final:</label>
      <select
        className="modal-select"
        value={status}
        onChange={(e) => setStatus(e.target.value)}
      >
        <option value="">Selecione...</option>
        <option value="Contratado">Contratado</option>
        <option value="Reprovado">Reprovado</option>
        <option value="Em análise">Em análise</option>
        <option value="Cancelada">Cancelada</option>
      </select>

      <div className="modal-actions">
        <button className="btn ghost" onClick={onClose}>Cancelar</button>

        <button className="btn primary" onClick={salvar}>
          Salvar feedback e status
        </button>
      </div>
    </ModalBase>
  );
}
