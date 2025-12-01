import React from "react";
import { useNavigate } from "react-router-dom";
import ModalBase from "../ModalBase";
import { api } from "../../../services/mockApi";
import "./ModalDetalhesCandidatura.css";

export default function ModalDetalhesCandidatura({ candidatura, onClose }) {
  const navigate = useNavigate();

  // Puxa a vaga real a partir do ID salvo na candidatura
  const vaga = api.vagas.getVaga(candidatura.vagaId);

  // Formatar data (ISO -> dd/mm/aaaa)
  function formatarData(iso) {
    if (!iso) return "–";
    return new Date(iso).toLocaleDateString("pt-BR");
  }

  // Classe da cor do status (badge)
  const statusClass =
    {
      Pendente: "pendente",
      Aprovado: "aprovado",
      Reprovado: "reprovado",
      "Entrevista Agendada": "agendada",
      Contratado: "contratado",
      Recusada: "recusada",
    }[candidatura.status] || "pendente";

  return (
    <ModalBase isOpen={true} onClose={onClose} title="Detalhes da Candidatura">
      <div className="candidatura-modal">
        {/* 🟦 Cabeçalho */}
        <div className="header">
          <div className="empresa-info">
            {vaga?.logo && (
              <img src={vaga.logo} alt="logo" className="empresa-logo" />
            )}

            <div>
              <h2>{vaga?.titulo}</h2>
              <p className="empresa-nome">{vaga?.empresa}</p>
            </div>
          </div>

          {/* Badge de status com cor respectiva */}
          <span className={`badge-status ${statusClass}`}>
            {candidatura.status}
          </span>
        </div>

        {/* ⭐ 5 infos principais */}
        <div className="infos-grid">
          <div className="info-item">
            <span className="icon">📍</span>
            <div>
              <label>Localização</label>
              <p>{vaga?.localizacao || "Não informado"}</p>
            </div>
          </div>

          <div className="info-item">
            <span className="icon">💼</span>
            <div>
              <label>Modalidade</label>
              <p>{vaga?.modalidade || "Não informado"}</p>
            </div>
          </div>

          <div className="info-item">
            <span className="icon">🕒</span>
            <div>
              <label>Data da Candidatura</label>
              <p>{formatarData(candidatura.data)}</p>
            </div>
          </div>

          <div className="info-item">
            <span className="icon">🎯</span>
            <div>
              <label>Requisitos Principais</label>
              <p>
                {(vaga?.requisitos || "").split("\n")[0] ||
                  "Ver requisitos completos na vaga"}
              </p>
            </div>
          </div>

          <div className="info-item">
            <span className="icon">⭐</span>
            <div>
              <label>Benefícios</label>
              <p>
                {vaga?.beneficios?.[0] ||
                  "Benefícios detalhados na página da vaga"}
              </p>
            </div>
          </div>
        </div>

        {/* 🔵 Botão: ver vaga completa */}
        <button
          className="btn-ver-vaga"
          onClick={() =>
            navigate("/detalhes-vaga-candidato", { state: vaga })
          }
        >
          Ver vaga completa →
        </button>
      </div>
    </ModalBase>
  );
}
