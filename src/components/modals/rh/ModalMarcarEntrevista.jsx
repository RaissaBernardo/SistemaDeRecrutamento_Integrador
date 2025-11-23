import React, { useState } from "react";
import { api } from "../../../services/mockApi";
import "./ModalMarcarEntrevista.css";

export default function ModalMarcarEntrevista({
  isOpen,
  candidatura,
  onClose,
  onSuccess,
}) {
  // =============================
  // HOOKS
  // =============================
  const [tipo, setTipo] = useState("Online");
  const [data, setData] = useState("");
  const [hora, setHora] = useState("08:00/pm");
  const [local, setLocal] = useState("");
  const [obs, setObs] = useState("");

  // 🟢 CAMPOS DO ENTREVISTADOR
  const [entrevistadorNome, setEntrevistadorNome] = useState("");
  const [entrevistadorEmail, setEntrevistadorEmail] = useState("");

  // Evita erros de render
  if (!isOpen || !candidatura) return null;

  // =============================
  // CONFIRMAR AGENDAMENTO
  // =============================
  function confirmar() {
    // 🔵 Salvar entrevista no mock
    api.entrevistas.schedule({
      vagaId: candidatura.vagaId,
      candidatoEmail: candidatura.candidatoEmail,
      nomeCandidato: candidatura.nome,
      vagaTitulo: candidatura.vagaTitulo,
      empresa: candidatura.empresa,
      data,
      horario: hora,
      linkMeet: local,
      entrevistadorNome,
      entrevistadorEmail,
    });

    // 🔵 Atualizar status
    api.candidaturas.updateStatus(candidatura.id, "Entrevista Agendada");

    // 🔔 Notificação do navegador
    if ("Notification" in window) {
      if (Notification.permission === "granted") {
        new Notification("Entrevista agendada!", {
          body: `Entrevista marcada com ${candidatura.nome} — ${data} às ${hora}.`,
          icon: "/favicon.ico",
        });
      } else if (Notification.permission !== "denied") {
        Notification.requestPermission().then((perm) => {
          if (perm === "granted") {
            new Notification("Entrevista agendada!", {
              body: `Entrevista marcada com ${candidatura.nome} — ${data} às ${hora}.`,
              icon: "/favicon.ico",
            });
          }
        });
      }
    }

    // Recarregar tela pai
    if (onSuccess) onSuccess();

    // Fechar modal
    onClose();
  }

  // Validação
  const podeConfirmar =
    data &&
    hora &&
    entrevistadorNome.trim() !== "" &&
    entrevistadorEmail.trim() !== "";

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
              Online
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

        {/* Local */}
        <div className="form-grupo">
          <label>Localização / Link da chamada</label>
          <input
            type="text"
            placeholder="Ex: https://meet.google.com/abc"
            value={local}
            onChange={(e) => setLocal(e.target.value)}
          />
        </div>

        {/* OBS */}
        <div className="form-grupo">
          <label>Observações para o candidato</label>
          <textarea
            placeholder="Informações adicionais..."
            value={obs}
            onChange={(e) => setObs(e.target.value)}
          ></textarea>
        </div>

        {/* Entrevistador */}
        <div className="form-grupo">
          <label>Nome do entrevistador</label>
          <input
            type="text"
            placeholder="Ex: Dr. José Mendes"
            value={entrevistadorNome}
            onChange={(e) => setEntrevistadorNome(e.target.value)}
          />
        </div>

        <div className="form-grupo">
          <label>Email do entrevistador</label>
          <input
            type="email"
            placeholder="ex: jose.mendes@empresa.com"
            value={entrevistadorEmail}
            onChange={(e) => setEntrevistadorEmail(e.target.value)}
          />
        </div>

        {/* Botões */}
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
