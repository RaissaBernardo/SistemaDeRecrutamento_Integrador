import React from "react";
import { useNavigate } from "react-router-dom";
import ModalBase from "../ModalBase";
import { api } from "../../../services/mockApi";
import "./ModalDetalhesCandidatura.css";

export default function ModalDetalhesCandidatura({ candidatura, onClose }) {
  const navigate = useNavigate();

  // puxa a vaga real
  const vaga = api.vagas.getVaga(candidatura.vagaId);

  // formatar data
  function formatarData(iso) {
    if (!iso) return "–";
    return new Date(iso).toLocaleDateString("pt-BR");
  }

  // cor da badge
  const statusClass = {
    Pendente: "pendente",
    Aprovado: "aprovado",
    Reprovado: "reprovado",
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
              <p>{vaga?.modalidade}</p>
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
                  "Ver completos na vaga"}
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
          onClick={() => navigate("/detalhes-vaga-candidato", { state: vaga })}
        >
          Ver vaga completa →
        </button>

      </div>
    </ModalBase>
  );
}
