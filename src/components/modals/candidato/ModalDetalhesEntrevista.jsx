import React from "react";
import "./ModalDetalhesEntrevistaCandidato.css";

export default function ModalDetalhesEntrevista({ isOpen, onClose, data, onCancelar }) {
  if (!isOpen || !data) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-box small">

        <div className="modal-header">
          <h2>Detalhes da entrevista</h2>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        <div className="modal-content">

          <p>
            <strong>Candidato:</strong> {data.nomeCandidato}
          </p>

          <p>
            <strong>Vaga:</strong> {data.vagaTitulo}
          </p>

          <p>
            <strong>Data:</strong>{" "}
            {new Date(data.data).toLocaleDateString("pt-BR")}
          </p>

          <p className="format-row">
            <strong>Formato:</strong>
            <span className="format-chip">
              📅 Meet
            </span>
          </p>
        </div>

        <div className="modal-actions">
          <button className="btn ghost" onClick={onClose}>Fechar</button>

          <button
            className="btn cancel"
            onClick={() => onCancelar(data.id)}
          >
            Cancelar entrevista
          </button>
        </div>

        <button className="footer-close" onClick={onClose}>
          Fechar
        </button>

      </div>
    </div>
  );
}
