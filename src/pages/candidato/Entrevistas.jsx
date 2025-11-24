import React, { useState, useEffect } from "react";
import "../../styles/rh/Entrevistas.css";

// mockApi
import { api } from "../../services/mockApi";

// Hook de modal
import useModal from "../../hooks/useModal";

// Modal completo (RH)
import ModalDetalhesEntrevista from "../../components/modals/candidato/ModalDetalhesEntrevistaCandidato.jsx";


export default function Entrevistas() {
  const [entrevistas, setEntrevistas] = useState([]);
  const [filtroPeriodo, setFiltroPeriodo] = useState("");
  const [busca, setBusca] = useState("");
  const [loading, setLoading] = useState(true);

  const modal = useModal();

  // ============================================================
  // 🔄 Carregar entrevistas com fallback
  // ============================================================
  useEffect(() => {
    recarregar();
  }, []);

  function recarregar() {
    setLoading(true);

    const list = api.entrevistas?.getAll?.() || [];

    const normalizadas = list.map((e) => ({
      ...e,
      dataLabel: e.data
        ? new Date(e.data).toLocaleDateString("pt-BR", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          })
        : "--/--/----",
    }));

    setEntrevistas(normalizadas);
    setLoading(false);
  }

  // ============================================================
  // 🔎 FILTROS
  // ============================================================
  const hoje = new Date();

  const filtradas = entrevistas.filter((e) => {
    const data = e.data ? new Date(e.data) : hoje;

    let byPeriodo = true;
    if (filtroPeriodo === "todas") {
      byPeriodo = true;
    } else if (filtroPeriodo === "passadas") {
      byPeriodo = data < hoje;
    } else {
      byPeriodo = data >= hoje;
    }

    const txt = busca.toLowerCase();
    const byBusca =
      !busca ||
      e.nomeCandidato?.toLowerCase().includes(txt) ||
      e.vagaTitulo?.toLowerCase().includes(txt) ||
      e.empresa?.toLowerCase().includes(txt);

    return byPeriodo && byBusca;
  });

  // ============================================================
  // 📌 Abrir modal seguro
  // ============================================================
  function abrirDetalhes(ent) {
    if (!ent) return;
    modal.open(ent);
  }

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
                      <td>{e.nomeCandidato || "—"}</td>
                      <td>{e.vagaTitulo || "—"}</td>

                      <td className="date-col">
                        {e.dataLabel}
                        <div className="hour">{e.horario || "--:--"}</div>
                      </td>

                      <td className="format-col">
                        {e.linkMeet ? (
                          <>
                            <span className="format-icon">🎥</span>
                            Online (Meet)
                          </>
                        ) : (
                          <>
                            <span className="format-icon">🏢</span>
                            Presencial
                          </>
                        )}
                      </td>

                      <td>
                        <button
                          className="btn ghost sm"
                          onClick={() => abrirDetalhes(e)}
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

    {/* ================= MODAL DO CANDIDATO ================= */}
    <ModalDetalhesEntrevista
      isOpen={modal.isOpen}
      onClose={() => {
        modal.close();
        recarregar();
      }}
      data={modal.data}
      onCancelar={(id) => {
        api.entrevistas.delete(id);
        recarregar();
        modal.close();
      }}
    />
  </div>
);
}
