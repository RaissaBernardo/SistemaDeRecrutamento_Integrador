import React from "react";
import "./ModalBase.css";

export default function ModalBase({ isOpen, onClose, title, children }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        {title && <h2 className="modal-title">{title}</h2>}

        <div className="modal-content">{children}</div>

        <div className="modal-footer">
          <button className="modal-close-btn" onClick={onClose}>
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}
