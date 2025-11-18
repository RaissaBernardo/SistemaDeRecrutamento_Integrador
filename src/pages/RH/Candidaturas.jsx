import React, { useEffect, useState } from "react";
import { api } from "../../services/mockApi";
import "../../styles/rh/Candidaturas.css";

export default function Candidaturas() {
  const [candidaturas, setCandidaturas] = useState([]);
  const [vagas, setVagas] = useState([]);

  const [loading, setLoading] = useState(true);

  // Filtros
  const [filtroVaga, setFiltroVaga] = useState("");
  const [filtroStatus, setFiltroStatus] = useState("");
  const [filtroPeriodo, setFiltroPeriodo] = useState("");

  useEffect(() => {
    setLoading(true);

    const cands = api.getCandidaturas();
    const vgs = api.getVagas();

    setCandidaturas(cands);
    setVagas(vgs);
    setLoading(false);
  }, []);

  // ================================
  // FILTROS
  // ================================
  const filtradas = candidaturas.filter((c) => {
    const byVaga = !filtroVaga || c.vagaId === Number(filtroVaga);
    const byStatus = !filtroStatus || c.status === filtroStatus;

    let byPeriodo = true;
    if (filtroPeriodo === "ultimos7") {
      const dif = (Date.now() - new Date(c.data).getTime()) / (1000 * 3600 * 24);
      byPeriodo = dif <= 7;
    } else if (filtroPeriodo === "ultimos30") {
      const dif = (Date.now() - new Date(c.data).getTime()) / (1000 * 3600 * 24);
      byPeriodo = dif <= 30;
    }

    return byVaga && byStatus && byPeriodo;
  });

  return (
    <div className="main-content page-candidaturas">

      <div className="candidaturas-container">
        <h1>Candidaturas</h1>

        {/* ====================== FILTROS ====================== */}
        <div className="filters">
          {/* Filtro por vaga */}
          <select value={filtroVaga} onChange={(e) => setFiltroVaga(e.target.value)}>
            <option value="">Todas as vagas</option>
            {vagas.map((v) => (
              <option key={v.id} value={v.id}>
                {v.titulo}
              </option>
            ))}
          </select>

          {/* Filtro por status */}
          <select value={filtroStatus} onChange={(e) => setFiltroStatus(e.target.value)}>
            <option value="">Status</option>
            <option value="Pendente">Pendente</option>
            <option value="Recebida">Recebida</option>
            <option value="Aprovado">Aprovado</option>
            <option value="Recusado">Recusado</option>
          </select>

          {/* Filtro por período */}
          <select value={filtroPeriodo} onChange={(e) => setFiltroPeriodo(e.target.value)}>
            <option value="">Período</option>
            <option value="ultimos7">Últimos 7 dias</option>
            <option value="ultimos30">Últimos 30 dias</option>
          </select>
        </div>

        {/* ====================== TABELA ====================== */}
        <div className="table-wrapper">
          {loading ? (
            <p className="loading">Carregando...</p>
          ) : (
            <table className="candidaturas-table">
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>Vaga</th>
                  <th>Data</th>
                  <th>Status</th>
                  <th>Ações</th>
                </tr>
              </thead>

              <tbody>
                {filtradas.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="empty">
                      Nenhuma candidatura encontrada.
                    </td>
                  </tr>
                ) : (
                  filtradas.map((c) => (
                    <tr key={c.id}>
                      <td>{c.nome}</td>
                      <td>{c.vagaTitulo}</td>
                      <td>{new Date(c.data).toLocaleDateString("pt-BR")}</td>
                      <td>
                        <span className={`badge ${c.status?.toLowerCase()}`}>
                          {c.status}
                        </span>
                      </td>
                      <td>
                        <button
                          className="btn ghost sm"
                          onClick={() => alert("Abrir detalhes da candidatura")}
                        >
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

        {/* PAGINAÇÃO — (placeholder igual Figma) */}
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
