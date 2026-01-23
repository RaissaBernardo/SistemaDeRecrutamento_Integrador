import React, { useEffect, useState } from "react";
import "../../styles/rh/Entrevistas.css";

import { api } from "../../services/mockApi";
import useModal from "../../hooks/useModal";

import ModalDetalhesEntrevistaRH from "../../components/modals/rh/ModalDetalhesEntrevistaRH.jsx";

export default function Entrevistas() {
  const [entrevistas, setEntrevistas] = useState([]);
  const [filtroPeriodo, setFiltroPeriodo] = useState("");
  const [busca, setBusca] = useState("");
  const [loading, setLoading] = useState(true);

  const modal = useModal();

  useEffect(() => {
    recarregar();
  }, []);

  function recarregar() {
    setLoading(true);

    const list = api.entrevistas.getAll() || [];

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

  const hoje = new Date();

  const filtradas = entrevistas.filter((e) => {
    const data = e.data ? new Date(e.data) : hoje;

    let byPeriodo = true;
    if (filtroPeriodo === "todas") byPeriodo = true;
    else if (filtroPeriodo === "passadas") byPeriodo = data < hoje;
    else byPeriodo = data >= hoje;

    const txt = busca.toLowerCase();
    const byBusca =
      !busca ||
      e.nomeCandidato?.toLowerCase().includes(txt) ||
      e.vagaTitulo?.toLowerCase().includes(txt) ||
      e.empresa?.toLowerCase().includes(txt) ||
      e.status?.toLowerCase().includes(txt);

    return byPeriodo && byBusca;
  });

  function abrirDetalhes(ent) {
    if (!ent) return;
    modal.open(ent);
  }

  // ============================
  // BADGES — PADRÃO OFICIAL
  // ============================
  function badgeStatus(status) {
    if (!status) return "badge pendente";

    const map = {
      Pendente: "badge pendente",
      "Em análise": "badge em-analise",
      "Entrevista agendada": "badge entrevista-agendada",
      Aprovado: "badge aprovado",
      Reprovado: "badge reprovado",
      Cancelado: "badge cancelado",
      Cancelada: "badge cancelado",
    };

    return map[status] || "badge pendente";
  }

  return (
    <div className="main-content page-entrevistas">
      <div className="entrevistas-container">
        <h1>Entrevistas</h1>

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
                  <th>Status</th>
                  <th>Ações</th>
                </tr>
              </thead>

              <tbody>
                {filtradas.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="empty">
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
                        {e.linkMeet ? "🎥 Online" : "🏢 Presencial"}
                      </td>

                      <td>
                        <span className={badgeStatus(e.status)}>
                          {e.status || "Pendente"}
                        </span>
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

        <div className="pagination">
          <button disabled>{"<"}</button>
          <button className="active">1</button>
          <button>2</button>
          <button>3</button>
          <button>{">"}</button>
          <span className="next-btn">Próximo ▸</span>
        </div>
      </div>

      <ModalDetalhesEntrevistaRH
        isOpen={modal.isOpen}
        onClose={() => {
          modal.close();
          recarregar();
        }}
        data={modal.data}
      />
    </div>
  );
}
