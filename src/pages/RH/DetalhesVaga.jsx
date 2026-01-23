import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../../styles/rh/DetalhesVaga.css";
import { getLoggedUser } from "../../services/storageService";

export default function DetalhesVaga() {
  const { state: vaga } = useLocation();
  const navigate = useNavigate();

  const logged = getLoggedUser();
  const isRH = logged?.tipoUsuario === "rh"; // padronizado ao sistema

  // Se o usuário chegou sem state (ex: F5)
  if (!vaga) {
    return (
      <div className="detalhes-container">
        <div className="detalhes-header">
          <h1>Vaga não encontrada</h1>
          <button className="voltar" onClick={() => navigate(-1)}>
            Voltar
          </button>
        </div>
      </div>
    );
  }

  const voltarDestino = isRH ? "/vagas" : "/vagas-disponiveis";

  return (
    <div className="detalhes-container">

      {/* ====================== HEADER ====================== */}
      <header className="detalhes-header">
        <h1>{vaga.titulo}</h1>

        <div className="acoes-topo">
          {isRH && (
            <button
              className="editar-btn"
              onClick={() => navigate("/vaga-form", { state: vaga })}
            >
              Editar vaga
            </button>
          )}

          <button className="voltar" onClick={() => navigate(voltarDestino)}>
            Voltar
          </button>
        </div>
      </header>

      {/* ====================== CONTEÚDO ====================== */}
      <section className="detalhes-body">
        
        {/* ----------- Informações principais ---------- */}
        <div className="info-principal">
          <div className="info-basica">
            <p><strong>Empresa:</strong> {vaga.empresa || "Não informada"}</p>
            <p><strong>Localização:</strong> {vaga.local || "Não informado"}</p>
            <p><strong>Modalidade:</strong> {vaga.modalidade || "Não informada"}</p>
            <p><strong>Salário:</strong> {vaga.salario ? `R$ ${vaga.salario}` : "-"}</p>
            <p><strong>Publicada em:</strong> 
              {vaga.dataCriacao
                ? new Date(vaga.dataCriacao).toLocaleDateString("pt-BR")
                : "-"}
            </p>
          </div>

          {/* Logo (opcional) */}
          {vaga.logo && (
            <div className="logo-wrapper">
              {vaga.logo.startsWith("data:image") ? (
                <img src={vaga.logo} alt="Logo" />
              ) : (
                <p>{vaga.logo}</p>
              )}
            </div>
          )}
        </div>

        {/* ----------- SEÇÕES DETALHADAS ---------- */}
        <div className="info-detalhada">

          {/* Descrição */}
          <section className="bloco">
            <h2>Descrição da vaga</h2>
            <p>{vaga.descricao || vaga.detalhes?.descricao || "Não informada."}</p>
          </section>

          {/* Requisitos */}
          <section className="bloco">
            <h2>Requisitos</h2>
            {vaga.requisitos?.length ? (
              <ul>
                {vaga.requisitos.map((req, i) => (
                  <li key={i}>{req}</li>
                ))}
              </ul>
            ) : (
              <p>Não informado.</p>
            )}
          </section>

          {/* Benefícios */}
          <section className="bloco">
            <h2>Benefícios</h2>
            {vaga.beneficios?.length ? (
              <ul>
                {vaga.beneficios.map((b, i) => (
                  <li key={i}>{b}</li>
                ))}
              </ul>
            ) : (
              <p>Não informado.</p>
            )}
          </section>

          {/* Palavras-chave */}
          <section className="bloco">
            <h2>Palavras-chave</h2>
            {vaga.palavrasChave?.length ? (
              <div className="chips">
                {vaga.palavrasChave.map((p, i) => (
                  <span className="chip" key={i}>{p}</span>
                ))}
              </div>
            ) : (
              <p>Nenhuma palavra-chave cadastrada.</p>
            )}
          </section>

        </div>

      </section>
    </div>
  );
}
