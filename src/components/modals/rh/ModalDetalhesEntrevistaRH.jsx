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

  // ===========================================
  // Encontrar candidatura correspondente
  // ===========================================
  function getCandidatura() {
    const db = api.candidaturas.getAll();
    return db.find(
      (c) =>
        c.vagaId === data.vagaId &&
        c.candidatoEmail === data.candidatoEmail
    );
  }

  // ===========================================
  // SALVAR RESULTADO + FEEDBACK
  // ===========================================
  function salvar(novoStatus) {
    setStatus(novoStatus);

    // 1️⃣ Atualiza ENTREVISTA
    const entrevistas = api.entrevistas.getAll();
    const idxEnt = entrevistas.findIndex((e) => e.id === data.id);

    if (idxEnt !== -1) {
      entrevistas[idxEnt].status = novoStatus;
      entrevistas[idxEnt].feedback = feedback;

      const db = JSON.parse(localStorage.getItem("mock_database"));
      db.entrevistas = entrevistas;
      localStorage.setItem("mock_database", JSON.stringify(db));
    }

    // 2️⃣ Atualiza CANDIDATURA
    const cand = getCandidatura();
    if (cand) {
      api.candidaturas.updateStatus(cand.id, novoStatus);

      const all = api.candidaturas.getAll();
      const idx = all.findIndex((x) => x.id === cand.id);

      if (idx !== -1) {
        all[idx].feedback = feedback;

        const db = JSON.parse(localStorage.getItem("mock_database"));
        db.candidaturas = all;
        localStorage.setItem("mock_database", JSON.stringify(db));
      }
    }

    // 3️⃣ Log
    api.perfis.logs.add({
      tipo: "feedback",
      mensagem: `Candidato ${novoStatus} após entrevista`,
      usuario: data.candidatoEmail,
      dados: {
        vaga: data.vagaTitulo,
        candidato: data.nomeCandidato,
        status: novoStatus,
        feedback,
      },
    });

    // 4️⃣ Notificação
    if ("Notification" in window) {
      const show = () =>
        new Notification("Status atualizado!", {
          body: `${data.nomeCandidato} foi marcado como: ${novoStatus}`,
          icon: "/favicon.ico",
        });

      if (Notification.permission === "granted") show();
      else if (Notification.permission !== "denied") {
        Notification.requestPermission().then((perm) => {
          if (perm === "granted") show();
        });
      }
    }

    onClose();
  }

  const statusClass = status ? status.toLowerCase().replace(/\s+/g, "-") : "";

  return (
    <div className="modal-overlay">
      <div className={`modal-container ${statusClass ? `status-${statusClass}` : ""}`}>

        <div className="modal-header">
          <h2>Detalhes da Entrevista</h2>

          {status && (
            <span className={`status-badge badge-${statusClass}`}>
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

          <div className="info-group">
            <label>📅 Data da entrevista</label>
            <span className="info-card">
              {new Date(data.data).toLocaleDateString("pt-BR")}
            </span>
          </div>

          <div className="info-group">
            <label>⏰ Horário</label>
            <span className="info-card">{data.horario}</span>
          </div>

          <div className="info-group">
            <label>🧑‍💼 Entrevistador</label>
            <span className="info-card">{data.entrevistadorNome}</span>
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

          <button className="btn danger" onClick={() => salvar("Reprovado")}>
            Reprovar
          </button>

          <button className="btn confirm" onClick={() => salvar("Aprovado")}>
            Aprovar
          </button>
        </div>
      </div>
    </div>
  );
}
