import React from "react";
import "../../styles/rh/Candidaturas.css";

export default function Candidaturas() {
  // quando o backend chegar, isso vira useEffect + fetch
  const candidaturas = [];

  return (
    <div className="page-candidaturas">
      <div className="candidaturas-container">
        <h1>Candidaturas</h1>

        {/* Filtros placeholders */}
        <div className="filters">
          <select>
            <option value="">Vaga</option>
          </select>

          <select>
            <option value="">Status</option>
          </select>

          <select>
            <option value="">Período</option>
          </select>
        </div>

        {/* Card / tabela */}
        <div className="table-wrapper">
          <table className="candidaturas-table">
            <thead>
              <tr>
                <th>Nome</th>
                <th>Vaga</th>
                <th>Candidatura</th>
                <th>Status</th>
                <th>Ações</th>
              </tr>
            </thead>

            <tbody>
              {candidaturas.length === 0 ? (
                <tr>
                  <td colSpan="5" className="empty">
                    Nenhuma candidatura encontrada.
                  </td>
                </tr>
              ) : (
                candidaturas.map((c) => (
                  <tr key={c.id}>
                    <td>{c.nome}</td>
                    <td>{c.vaga}</td>
                    <td>{c.dataCandidatura}</td>
                    <td>
                      <span className={`badge ${c.statusClass}`}>{c.status}</span>
                    </td>
                    <td>
                      <button className="btn ghost sm">Detalhes</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Paginação placeholder */}
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
