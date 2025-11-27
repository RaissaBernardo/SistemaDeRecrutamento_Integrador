import React from "react";
import "./ModalDetalhesEntrevistaCandidato.css";

export default function ModalDetalhesEntrevista({
  isOpen,
  onClose,
  data,
  onCancelar,
}) {
  if (!isOpen || !data) return null;

  // Define se é online ou presencial
  const formato = data.linkMeet ? "Online (Google Meet)" : "Presencial";

  return (
    <div className="modal-overlay">
      <div className="modal-box small">
        <div className="modal-header">
          <h2>Detalhes da entrevista</h2>
          <button className="close-btn" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="modal-content">
          <div className="info-block">
            <div className="info-label">Candidato</div>
            <div className="info-value">{data.nomeCandidato}</div>
          </div>

          <div className="info-block">
            <div className="info-label">Vaga</div>
            <div className="info-value">{data.vagaTitulo}</div>
          </div>

          {data.empresa && (
            <div className="info-block">
              <div className="info-label">Empresa</div>
              <div className="info-value">{data.empresa}</div>
            </div>
          )}

          <div className="info-block">
            <div className="info-label">Data</div>
            <div className="info-value">
              {new Date(data.data).toLocaleDateString("pt-BR")}
            </div>
          </div>

          <div className="info-block">
            <div className="info-label">Horário</div>
            <div className="info-value">{data.horario}</div>
          </div>

          <div className="info-block">
            <div className="info-label">Formato</div>
            <div className="info-value">
              <span className="format-chip">{formato}</span>
            </div>
          </div>

          {/* Link da entrevista (online) */}
          {data.linkMeet && (
            <div className="info-block">
              <div className="info-label">Link da entrevista</div>
              <a
                href={data.linkMeet}
                target="_blank"
                rel="noopener noreferrer"
                className="info-value meet-link"
              >
                {data.linkMeet}
              </a>
            </div>
          )}

          {/* Local presencial (aparece apenas se for presencial) */}
          {!data.linkMeet && data.presencialLocal && (
            <div className="info-block">
              <div className="info-label">Local da entrevista</div>
              <div className="info-value">{data.presencialLocal}</div>
            </div>
          )}

          <div className="info-block">
            <div className="info-label">Entrevistador</div>
            <div className="info-value">{data.entrevistadorNome}</div>
          </div>

          <div className="info-block">
            <div className="info-label">Email do entrevistador</div>
            <div className="info-value">{data.entrevistadorEmail}</div>
          </div>

          {data.observacoes && (
            <div className="info-block">
              <div className="info-label">Observações</div>
              <div className="info-value">{data.observacoes}</div>
            </div>
          )}
        </div>

        <div className="modal-actions">
          <button className="btn ghost" onClick={onClose}>
            Fechar
          </button>

          <button className="btn cancel" onClick={() => onCancelar(data.id)}>
            Cancelar entrevista
          </button>
        </div>
      </div>
    </div>
  );
}
