import React, { useState } from "react";
import { api } from "../../../services/mockApi";
import "./ModalMarcarEntrevista.css";

export default function ModalMarcarEntrevista({
  isOpen,
  candidatura,
  onClose,
  onSuccess,
}) {
  // =====================================================
  // HOOKS – sempre no topo, antes de qualquer condição!
  // =====================================================
  const [tipo, setTipo] = useState("Online");
  const [data, setData] = useState("");
  const [hora, setHora] = useState("08:00/pm");
  const [local, setLocal] = useState("");
  const [obs, setObs] = useState("");

  // Entrevistador
  const [entrevistadorNome, setEntrevistadorNome] = useState("");
  const [entrevistadorEmail, setEntrevistadorEmail] = useState("");

  // =====================================================
  // RETURN CONDICIONAL — sempre DEPOIS dos hooks
  // =====================================================
  if (!isOpen || !candidatura) return null;

  // =====================================================
  // CONFIRMAR AGENDAMENTO
  // =====================================================
  function confirmar() {
    api.entrevistas.schedule({
      vagaId: candidatura.vagaId,
      candidatoEmail: candidatura.candidatoEmail,
      nomeCandidato: candidatura.nome,
      vagaTitulo: candidatura.vagaTitulo,
      empresa: candidatura.empresa,
      data,
      horario: hora,
      linkMeet: tipo === "Online" ? local : "",
      entrevistadorNome,
      entrevistadorEmail,
      presencialLocal: tipo === "Presencial" ? local : "",
      observacoes: obs,
    });

    api.candidaturas.updateStatus(candidatura.id, "Entrevista agendada");

    // Notificação
    if ("Notification" in window) {
      if (Notification.permission === "granted") {
        new Notification("Entrevista agendada!", {
          body: `Entrevista com ${candidatura.nome} — ${data} às ${hora}.`,
          icon: "/favicon.ico",
        });
      } else {
        Notification.requestPermission();
      }
    }

    if (onSuccess) onSuccess();
    onClose();
  }

  const podeConfirmar =
    data &&
    hora &&
    entrevistadorNome.trim() !== "" &&
    entrevistadorEmail.trim() !== "";

  // =====================================================
  // UI
  // =====================================================
  return (
    <div className="modal-overlay">
      <div className="modal-box entrevista-box">

        <div className="modal-header">
          <h2>Marcar entrevista</h2>
          <button className="close-btn" onClick={onClose}>✖</button>
        </div>

        {/* Tipo */}
        <div className="form-grupo">
          <label>Tipo de entrevista</label>

          <div className="radio-row">
            <label className="radio">
              <input
                type="radio"
                checked={tipo === "Online"}
                onChange={() => setTipo("Online")}
              />
              Online (Meet / Teams)
            </label>

            <label className="radio">
              <input
                type="radio"
                checked={tipo === "Presencial"}
                onChange={() => setTipo("Presencial")}
              />
              Presencial
            </label>
          </div>
        </div>

        {/* Data */}
        <div className="form-grupo">
          <label>Data</label>
          <input
            type="date"
            value={data}
            onChange={(e) => setData(e.target.value)}
          />
        </div>

        {/* Hora */}
        <div className="form-grupo">
          <label>Hora</label>
          <select value={hora} onChange={(e) => setHora(e.target.value)}>
            <option>08:00/pm</option>
            <option>09:00/am</option>
            <option>10:00/am</option>
            <option>14:00/pm</option>
            <option>17:00/pm</option>
            <option>19:00/pm</option>
          </select>
        </div>

        {/* Local / Link */}
        <div className="form-grupo">
          <label>
            {tipo === "Online"
              ? "Link da chamada (Meet / Teams)"
              : "Endereço presencial da entrevista"}
          </label>

          <input
            type="text"
            placeholder={
              tipo === "Online"
                ? "https://meet.google.com/abc-123"
                : "Av. Paulista, 1000 - 8º andar"
            }
            value={local}
            onChange={(e) => setLocal(e.target.value)}
          />
        </div>

        {/* Observações */}
        <div className="form-grupo">
          <label>Observações para o candidato</label>
          <textarea
            placeholder="Recomendações, documentos, dress code..."
            value={obs}
            onChange={(e) => setObs(e.target.value)}
          ></textarea>
        </div>

        {/* Dados do entrevistador */}
        <div className="form-grupo">
          <label>Nome do entrevistador</label>
          <input
            type="text"
            placeholder="Ex: João Mendes"
            value={entrevistadorNome}
            onChange={(e) => setEntrevistadorNome(e.target.value)}
          />
        </div>

        <div className="form-grupo">
          <label>Email do entrevistador</label>
          <input
            type="email"
            placeholder="Ex: joao.mendes@empresa.com"
            value={entrevistadorEmail}
            onChange={(e) => setEntrevistadorEmail(e.target.value)}
          />
        </div>

        <div className="modal-botoes">
          <button className="btn cancel" onClick={onClose}>
            Cancelar
          </button>

          <button
            className="btn confirmar"
            disabled={!podeConfirmar}
            onClick={confirmar}
          >
            Confirmar agendamento
          </button>
        </div>

      </div>
    </div>
  );
}
