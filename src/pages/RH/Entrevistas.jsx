import React, { useState, useEffect } from "react";
import "../../styles/rh/Entrevistas.css";

// 🔄 mockApi (novo padrão Banco Único)
import { api } from "../../services/mockApi";


export default function Entrevistas() {
  const [entrevistas, setEntrevistas] = useState([]);
  const [filtroPeriodo, setFiltroPeriodo] = useState("");
  const [busca, setBusca] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);

      // carrega TODAS as entrevistas do mock
      const list = api.entrevistas.getEntrevistas();

      // converte data ISO → label amigável
      const normalizadas = list.map((e) => ({
        ...e,
        dataLabel: new Date(e.data).toLocaleDateString("pt-BR", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }),
      }));

      setEntrevistas(normalizadas);
      setLoading(false);
    }

    load();
  }, []);

  // ======== FILTROS ========
  const hoje = new Date();

  const filtradas = entrevistas.filter((e) => {
    const d = new Date(e.data);

    const byPeriodo =
      !filtroPeriodo
        ? d >= hoje // padrão: só hoje/futuras
        : true;

    const txt = busca.toLowerCase();
    const byBusca =
      !busca ||
      e.nomeCandidato?.toLowerCase().includes(txt) ||
      e.vagaTitulo?.toLowerCase().includes(txt) ||
      e.empresa?.toLowerCase().includes(txt);

    return byPeriodo && byBusca;
  });

  return (
    <div className="main-content page-entrevistas">
      <div className="entrevistas-container">
        <h1>Entrevistas</h1>

        {/* ================= FILTROS ================= */}
        <div className="filters">
          <select
            value={filtroPeriodo}
            onChange={(e) => setFiltroPeriodo(e.target.value)}
          >
            <option value="">Hoje e futuras</option>
            <option value="todas">Todas</option>
            <option value="passadas">Somente passadas</option>
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

        {/* ================= TABELA ================= */}
        <div className="table-wrapper">
          {loading ? (
            <p className="loading">Carregando...</p>
          ) : (
            <table className="entrevistas-table">
              <thead>
                <tr>
                  <th>Candidato</th>
                  <th>Vaga</th>
                  <th>Data</th>
                  <th>Formato</th>
                  <th>Ações</th>
                </tr>
              </thead>

              <tbody>
                {filtradas.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="empty">
                      Nenhuma entrevista encontrada.
                    </td>
                  </tr>
                ) : (
                  filtradas.map((e) => (
                    <tr key={e.id}>
                      <td>{e.nomeCandidato}</td>
                      <td>{e.vagaTitulo}</td>
                      <td className="date-col">
                        {e.dataLabel}
                        <div className="hour">{e.horario}</div>
                      </td>

                      <td className="format-col">
                        <span className="format-icon">🎥</span>
                        Online (Meet)
                      </td>

                      <td>
                        <button className="btn ghost sm">
                          Detalhes
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>

        {/* ================= PAGINAÇÃO ================= */}
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
