import React, { useEffect, useState } from "react";
import SidebarCandidato from "../../components/SidebarCandidato";
import { api } from "../../services/mockApi";
import "../../styles/candidato/VagasDisponiveis.css";
import { useNavigate } from "react-router-dom";
import { getLoggedUser } from "../../services/storageService";

// Modal
import ModalConfirmarCandidatura from "../../components/modals/candidato/ModalConfirmarCandidatura";

import useModal from "../../hooks/useModal";

export default function VagasDisponiveis({ onLogout }) {
  const [vagas, setVagas] = useState([]);
  const [busca, setBusca] = useState("");
  const [statusFiltro, setStatusFiltro] = useState("");

  const [vagaSelecionada, setVagaSelecionada] = useState(null);

  const navigate = useNavigate();
  const modalConfirm = useModal();

  /* ============================================================
     🔄 CARREGAR TODAS AS VAGAS
  ============================================================ */
  useEffect(() => {
    const lista = api.vagas.getAll();
    setVagas(lista || []);
  }, []);

  /* ============================================================
     🔎 FILTROS
  ============================================================ */
  const vagasFiltradas = vagas.filter((v) => {
    const txt = busca.toLowerCase();

    const byBusca =
      !busca ||
      v.titulo?.toLowerCase().includes(txt) ||
      v.empresa?.toLowerCase().includes(txt);

    const byStatus =
      !statusFiltro || (v.status || "Aberta") === statusFiltro;

    return byBusca && byStatus;
  });

  /* ============================================================
     📌 ABRIR MODAL DE CANDIDATURA
  ============================================================ */
  function abrirModalCandidatura(vaga) {
    const logged = getLoggedUser();
    if (!logged) {
      navigate("/login");
      return;
    }

    setVagaSelecionada(vaga);
    modalConfirm.open();
  }

  return (
    <div className="app-candidato">
      <SidebarCandidato onLogout={onLogout} />

      <main className="main-content-candidato vagas-page">
        
        {/* ===== HEADER ===== */}
        <header className="vagas-header">
          <h1>Vagas disponíveis</h1>
          <p className="muted">Veja oportunidades abertas e candidate-se.</p>
        </header>

        {/* ===== FILTROS ===== */}
        <div className="vagas-filtros">
          <div className="campo-busca">
            <span className="icon">🔍</span>
            <input
              type="text"
              placeholder="Pesquisar por título ou empresa..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
            />
          </div>

          <select
            className="select-filtro"
            value={statusFiltro}
            onChange={(e) => setStatusFiltro(e.target.value)}
          >
            <option value="">Todas</option>
            <option value="Aberta">Abertas</option>
            <option value="Encerrada">Encerradas</option>
          </select>
        </div>

        {/* ===== LISTA ===== */}
        <section className="vagas-lista">
          {vagasFiltradas.length === 0 ? (
            <p className="empty">Nenhuma vaga encontrada.</p>
          ) : (
            vagasFiltradas.map((v) => (
              <article
                key={v.id}
                className="vaga-card"
              >
                {/* CABEÇALHO */}
                <div className="vaga-header">
                  <div className="vaga-info">
                    <h2>{v.titulo}</h2>
                    <p className="empresa">{v.empresa}</p>
                  </div>

                  <span className={`badge ${v.status?.toLowerCase() || "aberta"}`}>
                    {v.status || "Aberta"}
                  </span>
                </div>

                {/* DESCRIÇÃO */}
                <p className="descricao">
                  {v.descricao?.slice(0, 140) || "Descrição breve da vaga."}
                </p>

                {/* RODAPÉ */}
                <div className="vaga-footer">
                  <span className="local">
                    {v.localizacao || "Local indefinido"} • {v.modalidade}
                  </span>

                  <div className="botoes-card">
                    <button
                      className="btn ghost sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate("/detalhes-vaga", { state: v });
                      }}
                    >
                      Detalhes
                    </button>

                    <button
                      className="btn primary sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        abrirModalCandidatura(v);
                      }}
                    >
                      Candidatar-se
                    </button>
                  </div>
                </div>
              </article>
            ))
          )}
        </section>

        {/* ===== MODAL CONFIRMAR ===== */}
        {modalConfirm.isOpen && vagaSelecionada && (
          <ModalConfirmarCandidatura
            isOpen={modalConfirm.isOpen}   // ✔ AGORA PASSA isOpen
            vaga={vagaSelecionada}
            onClose={modalConfirm.close}
            onSuccess={() => {
              modalConfirm.close();
              alert("Candidatura enviada!");
              setVagas(api.vagas.getAll());
            }}
          />
        )}
      </main>
    </div>
  );
}
