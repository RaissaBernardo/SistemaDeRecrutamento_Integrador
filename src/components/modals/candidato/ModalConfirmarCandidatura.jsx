import React from "react";
import ModalBase from "../ModalBase";
import { api } from "../../../services/mockApi";
import { getLoggedUser } from "../../../services/storageService";

export default function ModalConfirmarCandidatura({ isOpen, vaga, onClose, onSuccess }) {

  function confirmar() {
    const user = getLoggedUser();
    if (!user) return;

    const todas = api.candidaturas.getAll() || [];

    // 🚫 BLOQUEAR CANDIDATURA DUPLICADA (FILTRO DEFINITIVO)
    const jaExiste = todas.some(
      (c) =>
        c.candidatoEmail === user.email &&
        c.vagaId === vaga.id
    );

    if (jaExiste) {
      alert(`⚠ Você já se candidatou à vaga "${vaga.titulo}" anteriormente.`);
      onClose();
      return; // PARA TUDO
    }

    // 🟢 CRIA A CANDIDATURA
    const created = api.candidaturas.create({
      vagaId: vaga.id,
      candidatoEmail: user.email,
      nome: user.nome,
      tituloVaga: vaga.titulo,
      empresa: vaga.empresa
    });

    // 🔔 Notificação do navegador (se criado com sucesso)
    if (created) {
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
