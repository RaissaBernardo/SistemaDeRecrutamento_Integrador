import React from "react";
import ModalBase from "../ModalBase";

export default function ModalDetalhesCandidatura({ candidatura, onClose }) {
  
  // 🔧 Formatar data (ISO → dd/mm/aaaa)
  function formatarData(iso) {
    if (!iso) return "–";
    const d = new Date(iso);
    return d.toLocaleDateString("pt-BR");
  }

  return (
    <ModalBase title="Detalhes da candidatura" onClose={onClose}>
      <div className="detalhes-candidatura">
        <p><strong>Vaga:</strong> {candidatura.vagaTitulo}</p>
        <p><strong>Empresa:</strong> {candidatura.empresa}</p>
        <p><strong>Status:</strong> {candidatura.status}</p>
        <p><strong>Data da candidatura:</strong> {formatarData(candidatura.data)}</p>
      </div>

      <div className="modal-actions">
        <button className="btn primary" onClick={onClose}>
          Fechar
        </button>
      </div>
    </ModalBase>
  );
}
