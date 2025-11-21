import React, { useEffect, useState } from "react";
import SidebarCandidato from "../../components/SidebarCandidato";

import { api } from "../../services/mockApi";
import { getLoggedUser } from "../../services/storageService";

import useModal from "../../hooks/useModal";

// ✅ IMPORT CORRETO
import ModalDetalhesEntrevistaCandidato
  from "../../components/modals/candidato/ModalDetalhesEntrevista";

import "../../styles/candidato/Entrevistas.css";


export default function Entrevistas({ onLogout }) {
  const [entrevistas, setEntrevistas] = useState([]);
  const [q, setQ] = useState("");
  const [futuras, setFuturas] = useState(true);
  const [statusFiltro, setStatusFiltro] = useState("");

  // ===== MODAL DE DETALHES =====
  const detalhesModal = useModal();
  const [entrevistaSelecionada, setEntrevistaSelecionada] = useState(null);

  useEffect(() => {
    const logged = getLoggedUser();
    if (!logged) return;

    const all = api.entrevistas.getAll();

    const minhas = all.filter((e) => e.candidatoEmail === logged.email);
    setEntrevistas(minhas);
  }, []);

  const hoje = new Date();

  const filtradas = entrevistas.filter((it) => {
    const data = it.data ? new Date(it.data) : null;

    const byTexto =
      !q ||
      it.vagaTitulo?.toLowerCase().includes(q.toLowerCase()) ||
      it.empresa?.toLowerCase().includes(q.toLowerCase());

    const byTempo = !data ? true : futuras ? data >= hoje : data < hoje;

    const byStatus = !statusFiltro || it.status === statusFiltro;

    return byTexto && byTempo && byStatus;
  });

  // =========================
  // 🔵 ABRIR DETALHES
  // =========================
  function abrirDetalhes(entrevista) {
    setEntrevistaSelecionada(entrevista);
    detalhesModal.open();
  }

  return (
    <div className="app-candidato">
      <SidebarCandidato onLogout={onLogout} />

      <main className="main-content-candidato entrevistas-page">
        <header className="entrevistas-header">
          <h1>Entrevistas</h1>
          <p className="muted">Veja suas entrevistas agendadas e seus detalhes.</p>
        </header>

        {/* ===================== FILTROS ===================== */}
        <div className="filtros">
          <input
            type="text"
            placeholder="Buscar por vaga ou empresa..."
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />

          <select
            value={statusFiltro}
            onChange={(e) => setStatusFiltro(e.target.value)}
          >
            <option value="">Status</option>
            <option value="Agendada">Agendada</option>
            <option value="Concluída">Concluída</option>
            <option value="Cancelada">Cancelada</option>
          </select>

          <button
            className="btn ghost"
            onClick={() => setFuturas((prev) => !prev)}
          >
            {futuras ? "Ver passadas" : "Ver futuras"}
          </button>
        </div>

        {/* ===================== LISTA ===================== */}
        <section className="lista-entrevistas">
          {filtradas.length === 0 ? (
            <p className="empty">Nenhuma entrevista encontrada.</p>
          ) : (
            filtradas.map((it) => (
              <article key={it.id} className="entrevista-card">
                <div className="info">
                  <h2>{it.vagaTitulo}</h2>
                  <p className="empresa">{it.empresa}</p>
                  <p className="data">
                    {it.data} • {it.horario}
                  </p>
                </div>

                <div className="acoes">
                  <div className={`status ${it.status?.toLowerCase()}`}>
                    {it.status}
                  </div>

                  <div className="btns">
                    <button
                      className="btn ghost"
                      onClick={() => abrirDetalhes(it)}
                    >
                      Detalhes
                    </button>

                    <button
                      className="btn primary"
                      onClick={() => window.open(it.linkMeet, "_blank")}
                    >
                      Meet
                    </button>
                  </div>
                </div>
              </article>
            ))
          )}
        </section>
      </main>

      {/* ===================== MODAL DETALHES ===================== */}
      {detalhesModal.isOpen && entrevistaSelecionada && (
        <ModalDetalhesEntrevistaCandidato
          isOpen={detalhesModal.isOpen}
          onClose={detalhesModal.close}
          data={entrevistaSelecionada}
          onCancelar={(id) => {
            api.entrevistas.updateStatus(id, "Cancelada");

            detalhesModal.close();

            // Atualizar lista após cancelar
            const logged = getLoggedUser();
            const all = api.entrevistas.getAll();
            const minhas = all.filter((e) => e.candidatoEmail === logged.email);
            setEntrevistas(minhas);
          }}
        />
      )}
    </div>
  );
}
