import React, { useState, useEffect } from "react";
import "./ModalDetalhesEntrevistaRH.css";
import { api } from "../../../services/mockApi";

export default function ModalDetalhesEntrevistaRH({ isOpen, onClose, data }) {
  const [status, setStatus] = useState("");
  const [feedback, setFeedback] = useState("");

  useEffect(() => {
    if (data) {
      setStatus(data.status || "");
      setFeedback(data.feedback || "");
    }
  }, [data]);

  if (!isOpen || !data) return null;

  function salvar() {
    api.entrevistas.updateStatus(data.id, status);

    api.perfis.logs.add({
      tipo: "feedback",
      mensagem: `Feedback registrado para ${data.nomeCandidato}`,
      usuario: data.candidatoEmail,
      dados: { vaga: data.vagaTitulo, status, feedback },
    });

    onClose();
  }

  return (
    <div className="modal-overlay">
      <div className={`modal-container status-${status?.toLowerCase()}`}>

        <div className="modal-header">
          <h2>Detalhes da Entrevista</h2>

          {/* ⭐ BADGE DO STATUS */}
          {status && (
            <span className={`status-badge badge-${status.toLowerCase()}`}>
              {status}
            </span>
          )}

          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        <div className="modal-body">

          <div className="info-group">
            <label>👤 Candidato</label>
            <span className="info-card">{data.nomeCandidato}</span>
          </div>

          <div className="info-group">
            <label>💼 Vaga</label>
            <span className="info-card">{data.vagaTitulo}</span>
          </div>

          {data.empresa && (
            <div className="info-group">
              <label>🏢 Empresa</label>
              <span className="info-card">{data.empresa}</span>
            </div>
          )}

          <div className="info-row">
            <div className="info-group small">
              <label>📅 Data</label>
              <span className="info-card">
                {new Date(data.data).toLocaleDateString("pt-BR")}
              </span>
            </div>

            <div className="info-group small">
              <label>⏰ Horário</label>
              <span className="info-card">{data.horario}</span>
            </div>
          </div>

          <div className="info-group">
            <label>🧑‍💼 Entrevistador</label>
            <span className="info-card">{data.entrevistadorNome}</span>
          </div>

          <div className="info-group">
            <label>📧 Email do entrevistador</label>
            <span className="info-card">{data.entrevistadorEmail}</span>
          </div>

          {data.linkMeet && (
            <div className="info-group">
              <label>🎥 Link Meet</label>
              <a
                href={data.linkMeet}
                target="_blank"
                rel="noreferrer"
                className="info-card link-meet"
              >
                {data.linkMeet}
              </a>
            </div>
          )}

          {data.obs && (
            <div className="info-group">
              <label>📝 Observações</label>
              <span className="info-card">{data.obs}</span>
            </div>
          )}

          <div className="info-group">
            <label>Status do candidato</label>
            <select value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="">Selecione</option>
              <option value="Aprovado">Aprovado</option>
              <option value="Reprovado">Reprovado</option>
            </select>
          </div>

          <div className="info-group">
            <label>Feedback</label>
            <textarea
              placeholder="Escreva um feedback..."
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
            />
          </div>
        </div>

        <div className="modal-actions">
          <button className="btn cancel" onClick={onClose}>Fechar</button>
          <button className="btn confirm" onClick={salvar}>Salvar alterações</button>
        </div>

      </div>
    </div>
  );
}
