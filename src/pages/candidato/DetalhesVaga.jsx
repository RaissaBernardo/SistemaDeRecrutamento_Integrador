import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../../styles/candidato/DetalhesVaga.css";

export default function DetalhesVaga() {
  const navigate = useNavigate();
  const { state: vaga } = useLocation();

  if (!vaga) {
    return (
      <div className="detalhes-vaga-page">
        <p className="erro-msg">Vaga não encontrada.</p>
        <button className="btn ghost" onClick={() => navigate(-1)}>
          Voltar
        </button>
      </div>
    );
  }

  return (
    <div className="detalhes-vaga-page">
      
      {/* VOLTAR */}
      <button className="btn-voltar" onClick={() => navigate(-1)}>
        ◂ Voltar
      </button>

      {/* CABEÇALHO */}
      <header className="dv-header">
        <div>
          <h1>{vaga.titulo}</h1>
          <p className="empresa">{vaga.empresa}</p>
        </div>

        <span className={`badge ${vaga.status?.toLowerCase() || "aberta"}`}>
          {vaga.status || "Aberta"}
        </span>
      </header>

      {/* LOGO */}
      {vaga.logo && (
        <div className="dv-logo-box">
          <img src={vaga.logo} alt="Logo da empresa" />
        </div>
      )}

      {/* DESCRIÇÃO */}
      <section className="dv-card">
        <h2>Descrição da vaga</h2>
        <p>{vaga.descricao || vaga.detalhes?.descricao || "Sem descrição informada."}</p>
      </section>

      {/* REQUISITOS */}
      <section className="dv-card">
        <h2>Requisitos</h2>
        <p>{vaga.requisitos || vaga.detalhes?.requisitos || "Nenhum requisito informado."}</p>
      </section>

      {/* BENEFÍCIOS */}
      <section className="dv-card">
        <h2>Benefícios</h2>

        {!vaga.beneficios || vaga.beneficios.length === 0 ? (
          <p className="muted">Nenhum benefício informado.</p>
        ) : (
          <ul className="dv-list">
            {vaga.beneficios.map((b, i) => (
              <li key={i}>{b}</li>
            ))}
          </ul>
        )}
      </section>

      {/* FORMATO */}
      <section className="dv-card">
        <h2>Formato de trabalho</h2>

        <div className="chips">
          {vaga.formato?.remoto && <span className="chip">Remoto</span>}
          {vaga.formato?.presencial && <span className="chip">Presencial</span>}
          {vaga.formato?.hibrido && <span className="chip">Híbrido</span>}
        </div>
      </section>

      {/* JORNADA */}
      <section className="dv-card">
        <h2>Jornada de trabalho</h2>
        <p>{vaga.jornada || "Não informada"}</p>
      </section>

      {/* LOCALIZAÇÃO */}
      <section className="dv-card">
        <h2>Localização</h2>
        <p>{vaga.localizacao || "Local não informado"}</p>
      </section>

      {/* SALÁRIO */}
      <section className="dv-card">
        <h2>Faixa salarial</h2>
        <p>{vaga.salario || "Não informado"}</p>
      </section>

      {/* PALAVRAS-CHAVE */}
      {vaga.detalhes?.palavrasChave?.length > 0 && (
        <section className="dv-card">
          <h2>Palavras-chave</h2>
          <div className="chips">
            {vaga.detalhes.palavrasChave.map((p, i) => (
              <span key={i} className="chip chip-key">{p}</span>
            ))}
          </div>
        </section>
      )}

      {/* DATA */}
      <section className="dv-card">
        <h2>Publicada em</h2>
        <p>{vaga.dataPublicacao || "Data não informada"}</p>
      </section>
    </div>
  );
}
