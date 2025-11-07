import React, { useState } from "react";
import "../../styles/rh/Entrevistas.css";

export default function Entrevistas() {
  // Lista vazia – quando o backend chegar, você popula aqui
  const entrevistas = [];

  const [filtroPeriodo, setFiltroPeriodo] = useState("");
  const [busca, setBusca] = useState("");

  return (
    <div className="main-content page-entrevistas">
      <div className="entrevistas-container">
        <h1>Entrevistas</h1>

        {/* Filtros */}
        <div className="filters">
          <select value={filtroPeriodo} onChange={(e) => setFiltroPeriodo(e.target.value)}>
            <option value="">Hoje e futuras</option>
          </select>

          <div className="search-bar">
            <input
              type="text"
              placeholder="Pesquisar..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
            />
            <span className="search-icon">🔍</span>
          </div>
        </div>

        {/* Tabela */}
        <div className="table-wrapper">
          <table className="entrevistas-table">
            <thead>
              <tr>
                <th>Nome</th>
                <th>Vaga</th>
                <th>Data</th>
                <th>Formato</th>
                <th>Ações</th>
              </tr>
            </thead>

            <tbody>
              {entrevistas.length === 0 ? (
                <tr>
                  <td colSpan="5" className="empty">
                    Nenhuma entrevista agendada.
                  </td>
                </tr>
              ) : (
                entrevistas.map((e) => (
                  <tr key={e.id}>
                    <td>{e.nome}</td>
                    <td>{e.vaga}</td>
                    <td className="date-col">
                      {e.dataLabel}
                      <div className="hour">{e.hora}</div>
                    </td>
                    <td className="format-col">
                      <span className="format-icon">{e.icone}</span> {e.formato}
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

        {/* Paginação */}
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
