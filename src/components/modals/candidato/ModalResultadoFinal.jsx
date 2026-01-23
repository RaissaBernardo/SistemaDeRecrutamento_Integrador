import React from "react";
import "./ModalResultadoFinal.css";

export default function ModalResultadoFinal({ isOpen, onClose, data }) {
  if (!isOpen || !data) return null;

  const statusColor = {
    Aprovado: "#3dbb78",
    Reprovado: "#d64545",
    "Entrevista Agendada": "#0066ff",
    Cancelada: "#999",
  }[data.status] || "#0090c8";

  return (
    <div className="rf-overlay">
      <div className="rf-box">

        <div className="rf-header">
          <h2>Resultado da Entrevista</h2>
          <button className="rf-close" onClick={onClose}>✕</button>
        </div>

        <div className="rf-status" style={{ borderColor: statusColor }}>
          <span className="rf-status-label" style={{ color: statusColor }}>
            {data.status}
          </span>
        </div>

        <div className="rf-content">
          <h3>Feedback do RH</h3>
          <p className="rf-feedback">
            {data.feedback?.trim()
              ? data.feedback
              : "Nenhum feedback foi enviado pelo RH."}
          </p>
        </div>

        <div className="rf-actions">
          <button className="rf-btn" onClick={onClose}>Fechar</button>
        </div>
      </div>
    </div>
  );
}
