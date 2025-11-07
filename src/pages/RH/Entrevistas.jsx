import React, { useState, useEffect } from "react";
import "../../styles/rh/Entrevistas.css";
// import { getEntrevistas } from "../../services/storageService"; // futuro uso

export default function Entrevistas() {
  const [entrevistas, setEntrevistas] = useState([]);
  const [filtroPeriodo, setFiltroPeriodo] = useState("");
  const [busca, setBusca] = useState("");
  const [loading, setLoading] = useState(true);

  // 🔹 quando o backend chegar:
  /*
  useEffect(() => {
    async function load() {
      const data = await getEntrevistas();
      setEntrevistas(data);
      setLoading(false);
    }
    load();
  }, []);
  */

  useEffect(() => {
    setEntrevistas([]); // temporário
    setLoading(false);
  }, []);

  return (
    <div className="main-content page-entrevistas">
      <div className="entrevistas-container">
        <h1>Entrevistas</h1>

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

        <div className="table-wrapper">
          {loading ? (
            <p className="loading">Carregando...</p>
          ) : (
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
          )}
        </div>

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
