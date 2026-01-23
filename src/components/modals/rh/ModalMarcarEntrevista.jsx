import React, { useEffect, useState } from "react";
import { api } from "../../../services/mockApi";
import "./ModalMarcarEntrevista.css";

export default function ModalMarcarEntrevista({
  isOpen,
  candidatura,
  onClose,
  onSuccess,
}) {
  // =========================
  // STATES
  // =========================
  const [tipo, setTipo] = useState("Online");
  const [data, setData] = useState("");
  const [hora, setHora] = useState("09:00");
  const [local, setLocal] = useState("");
  const [observacoes, setObservacoes] = useState("");

  const [entrevistadorNome, setEntrevistadorNome] = useState("");
  const [entrevistadorEmail, setEntrevistadorEmail] = useState("");

  // =========================
  // EFFECTS
  // =========================
  useEffect(() => {
    // Limpa local ao trocar tipo
    setLocal("");
  }, [tipo]);

  // =========================
  // HELPERS
  // =========================
  function formatarDataBR(dataISO) {
    if (!dataISO) return "";

    const d = new Date(dataISO);
    if (isNaN(d)) return "";

    return d.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  }

  function emailValido(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function confirmar() {
    if (!data || !hora) {
      alert("Informe data e horário da entrevista.");
      return;
    }

    if (!entrevistadorNome.trim() || !emailValido(entrevistadorEmail)) {
      alert("Informe nome e email válido do entrevistador.");
      return;
    }

    if (!local.trim()) {
      alert(
        tipo === "Online"
          ? "Informe o link da chamada."
          : "Informe o endereço da entrevista."
      );
      return;
    }

    api.entrevistas.schedule({
      vagaId: candidatura.vagaId,
      candidatoEmail: candidatura.candidatoEmail,
      nomeCandidato: candidatura.nome,
      vagaTitulo: candidatura.vagaTitulo,
      empresa: candidatura.empresa,

      dataISO: data,
      dataBR: formatarDataBR(data),
      horario: hora,

      tipo,
      linkMeet: tipo === "Online" ? local.trim() : "",
      presencialLocal: tipo === "Presencial" ? local.trim() : "",

      entrevistadorNome: entrevistadorNome.trim(),
      entrevistadorEmail: entrevistadorEmail.trim(),

      observacoes: observacoes.trim(),
    });

    api.candidaturas.updateStatus(candidatura.id, "Entrevista agendada");

    // Notificação
    if ("Notification" in window && Notification.permission === "granted") {
      new Notification("Entrevista agendada", {
        body: `${candidatura.nome} — ${formatarDataBR(data)} às ${hora}`,
        icon: "/favicon.ico",
      });
    }

    if (onSuccess) onSuccess();
    onClose();
  }

  const podeConfirmar =
    data &&
    hora &&
    local.trim() &&
    entrevistadorNome.trim() &&
    emailValido(entrevistadorEmail);

  if (!isOpen || !candidatura) return null;

  // =========================
  // UI
  // =========================
  return (
    <div className="modal-overlay">
      <div className="modal-box entrevista-box">

        <div className="modal-header">
          <h2>Agendar entrevista</h2>
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
              Online (Google Meet / Microsoft Teams)
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
          <label>Data da entrevista</label>
          <input
            type="date"
            value={data}
            onChange={(e) => setData(e.target.value)}
          />
        </div>

        {/* Hora */}
        <div className="form-grupo">
          <label>Horário</label>
          <select value={hora} onChange={(e) => setHora(e.target.value)}>
            <option value="08:00">08:00</option>
            <option value="09:00">09:00</option>
            <option value="10:00">10:00</option>
            <option value="14:00">14:00</option>
            <option value="17:00">17:00</option>
            <option value="19:00">19:00</option>
          </select>
        </div>

        {/* Local / Link */}
        <div className="form-grupo">
          <label>
            {tipo === "Online"
              ? "Link da reunião"
              : "Endereço da entrevista"}
          </label>

          <input
            type="text"
            placeholder={
              tipo === "Online"
                ? "https://meet.google.com/xxx-xxxx-xxx"
                : "Av. Paulista, 1000 - 8º andar"
            }
            value={local}
            onChange={(e) => setLocal(e.target.value)}
          />
        </div>

        {/* Observações */}
        <div className="form-grupo">
          <label>Observações ao candidato</label>
          <textarea
            placeholder="Ex: Trazer currículo impresso, documento com foto, dress code social..."
            value={observacoes}
            onChange={(e) => setObservacoes(e.target.value)}
          ></textarea>
        </div>

        {/* Entrevistador */}
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
