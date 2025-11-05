import React from "react";
import "../../styles/rh/Vagas.css";
import { useNavigate } from "react-router-dom";

export default function Vagas() {
  const navigate = useNavigate();

  // Valores placeholders até o backend alimentar
  const vagasAbertas = 0;
  const vagasEncerradas = 0;

  // Lista vazia aguardando o backend
  const vagas = [];

  return (
    <div className="page-vagas">
      <div className="vagas-container">
        <h1>Vagas</h1>

        <div className="vagas-top">
          <div className="counts">
            <span>Vagas abertas: {vagasAbertas}</span>
            <span className="divider">|</span>
            <span>Vagas encerradas: {vagasEncerradas}</span>
          </div>

          <button
            className="btn primary new-vaga-btn"
            onClick={() => navigate("/vagas/nova")}
          >
            Cadastrar nova Vaga +
          </button>
        </div>

        <div className="table-wrapper">
          <table className="vagas-table">
            <thead>
              <tr>
                <th>Título</th>
                <th>Localização</th>
                <th>Data de Publicação</th>
                <th>Ações</th>
              </tr>
            </thead>

            <tbody>
              {vagas.length === 0 ? (
                <tr>
                  <td colSpan="4" className="empty">
                    Nenhuma vaga encontrada.
                  </td>
                </tr>
              ) : (
                vagas.map((vaga) => (
                  <tr key={vaga.id}>
                    <td>{vaga.titulo}</td>
                    <td>{vaga.localizacao}</td>
                    <td>{vaga.data}</td>
                    <td>
                      <button className="btn ghost sm">Editar</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Paginação (placeholder até vir do back) */}
        <div className="pagination">
          <button disabled>{"<"}</button>
          <button className="active">1</button>
          <button>2</button>
          <button>3</button>
          <button>{">"}</button>
          <span className="next-btn">Próximo ▸</span>
        </div>
      </div>
    </div>
  );
}
