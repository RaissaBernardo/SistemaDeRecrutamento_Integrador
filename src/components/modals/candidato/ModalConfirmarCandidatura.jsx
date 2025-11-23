import React from "react";
import ModalBase from "../ModalBase";
import { api } from "../../../services/mockApi";
import { getLoggedUser } from "../../../services/storageService";

export default function ModalConfirmarCandidatura({ isOpen, vaga, onClose, onSuccess }) {
  
  function confirmar() {
    const user = getLoggedUser();
    if (!user) return;

    const created = api.candidaturas.create({
      vagaId: vaga.id,
      candidatoEmail: user.email,
      nome: user.nome,
      tituloVaga: vaga.titulo,
      empresa: vaga.empresa
    });

    // Apenas dispara notificação se realmente criou (evita duplicadas)
    if (created) {
      // 🟢 NOTIFICAÇÃO DO NAVEGADOR
      if ("Notification" in window) {
        if (Notification.permission === "granted") {
          new Notification("Candidatura enviada!", {
            body: `Você se candidatou à vaga ${vaga.titulo} — ${vaga.empresa}.`,
            icon: "/favicon.ico"
          });
        } else if (Notification.permission !== "denied") {
          Notification.requestPermission().then((perm) => {
            if (perm === "granted") {
              new Notification("Candidatura enviada!", {
                body: `Você se candidatou à vaga ${vaga.titulo} — ${vaga.empresa}.`,
                icon: "/favicon.ico"
              });
            }
          });
        }
      }
    }

    onClose();
    onSuccess?.();
  }

  return (
    <ModalBase isOpen={isOpen} title="Confirmar candidatura" onClose={onClose}>
      <p>
        Deseja realmente se candidatar para a vaga{" "}
        <strong>{vaga.titulo}</strong>?
      </p>

      <div className="modal-actions">
        <button className="btn ghost" onClick={onClose}>
          Cancelar
        </button>

        <button className="btn primary" onClick={confirmar}>
          Confirmar
        </button>
      </div>
    </ModalBase>
  );
}
