import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../../styles/rh/DetalhesVaga.css";
import { getLoggedUser } from "../../services/storageService";

export default function DetalhesVaga() {
  const { state: vaga } = useLocation();
  const navigate = useNavigate();
  const logged = getLoggedUser();
  const isRH = logged?.tipoUsuario === "RH";

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

      <section className="detalhes-body">
        <div className="info-principal">
          <div className="info-basica">
            <p><strong>Empresa:</strong> {vaga.empresa}</p>
            <p><strong>Localização:</strong> {vaga.localizacao}</p>
            <p><strong>Modalidade:</strong> {vaga.modalidade}</p>
            <p><strong>Salário:</strong> {vaga.salario ? `R$ ${vaga.salario}` : "-"}</p>
            <p><strong>Data de publicação:</strong> {vaga.dataPublicacao}</p>
          </div>
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

        <div className="info-detalhada">
          {[
            { titulo: "Descrição da vaga", texto: vaga.detalhes?.descricao },
            { titulo: "Requisitos", texto: vaga.detalhes?.requisitos },
            { titulo: "Benefícios", texto: vaga.detalhes?.beneficios },
          ].map((sec, i) => (
            <section className="bloco" key={i}>
              <h2>{sec.titulo}</h2>
              <p>{sec.texto || "Informação não fornecida."}</p>
            </section>
          ))}

          <section className="bloco">
            <h2>Formato e Jornada</h2>
            <div className="chips">
              {vaga.detalhes?.formatoJornada?.remoto && <span className="chip">Remoto</span>}
              {vaga.detalhes?.formatoJornada?.presencial && <span className="chip">Presencial</span>}
              {vaga.detalhes?.formatoJornada?.hibrido && <span className="chip">Híbrido</span>}
              {vaga.detalhes?.formatoJornada?.periodoIntegral && <span className="chip">Período Integral</span>}
            </div>
          </section>

          <section className="bloco">
            <h2>Palavras-chave</h2>
            {vaga.detalhes?.palavrasChave?.length ? (
              <div className="chips">
                {vaga.detalhes.palavrasChave.map((p, i) => (
                  <span key={i} className="chip">{p}</span>
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
