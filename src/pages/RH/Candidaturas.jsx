import React, { useEffect, useState } from "react";
import "../../styles/rh/Candidaturas.css";
// import { fetchCandidaturas } from "../../services/storageService"; // 🔹 futuro uso com back

export default function Candidaturas() {
  const [candidaturas, setCandidaturas] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔹 Quando o backend estiver pronto:
  /*
  useEffect(() => {
    async function loadCandidaturas() {
      try {
        setLoading(true);
        const data = await fetchCandidaturas(); // virá do Spring Boot
        setCandidaturas(data);
      } catch (err) {
        console.error("Erro ao carregar candidaturas:", err);
      } finally {
        setLoading(false);
      }
    }
    loadCandidaturas();
  }, []);
  */

  // 🔹 Temporário (enquanto o back não está ativo)
  useEffect(() => {
    // placeholder vazio
    setCandidaturas([]);
    setLoading(false);
  }, []);

  return (
    <div className="main-content page-candidaturas">
      <div className="candidaturas-container">
        <h1>Candidaturas</h1>

        {/* Filtros */}
        <div className="filters">
          <select defaultValue="">
            <option value="">Vaga</option>
          </select>
          <select defaultValue="">
            <option value="">Status</option>
          </select>
          <select defaultValue="">
            <option value="">Período</option>
          </select>
        </div>

        {/* Tabela */}
        <div className="table-wrapper">
          {loading ? (
            <p className="loading">Carregando...</p>
          ) : (
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
                        <span className={`badge ${c.status?.toLowerCase() || ""}`}>
                          {c.status}
                        </span>
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
