import React, { useEffect, useState } from "react";
import { api } from "../../services/mockApi";
import "../../styles/candidato/VagasDisponiveis.css";
import { useNavigate } from "react-router-dom";
import { getLoggedUser } from "../../services/storageService";

import ModalConfirmarCandidatura from "../../components/modals/candidato/ModalConfirmarCandidatura";
import useModal from "../../hooks/useModal";

export default function VagasDisponiveis() {
  const [vagas, setVagas] = useState([]);
  const [busca, setBusca] = useState("");
  const [statusFiltro, setStatusFiltro] = useState("");

  const [vagaSelecionada, setVagaSelecionada] = useState(null);
  const navigate = useNavigate();
  const modalConfirm = useModal();

  // ============================================================
  // 🔄 CARREGAR VAGAS
  // ============================================================
  useEffect(() => {
    const lista = api.vagas.getAll();
    setVagas(lista || []);
  }, []);

  // ============================================================
  // 🔄 VERIFICAR QUAIS O CANDIDATO JÁ APLICOU
  // ============================================================
  const logged = getLoggedUser();
  const minhasCandidaturas = api.candidaturas
    .getAll()
    ?.filter((c) => c.candidatoEmail === logged?.email)
    .map((c) => c.vagaId) || [];

  // ============================================================
  // 🔎 FILTRAGEM
  // ============================================================
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

  // ============================================================
  // 📌 BLOQUEAR CANDIDATURA DUPLICADA
  // ============================================================
  function abrirModalCandidatura(vaga) {
    const logged = getLoggedUser();

    if (!logged) {
      navigate("/login");
      return;
    }

    const jaExiste = minhasCandidaturas.includes(vaga.id);

    if (jaExiste) {
      alert("⚠ Você já se candidatou para esta vaga!");
      return;
    }

    setVagaSelecionada(vaga);
    modalConfirm.open();
  }

  return (
    <div className="main-content">  {/* 🔥 NÃO MEXI EM NADA */}

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
            vagasFiltradas.map((v) => {
              const aplicada = minhasCandidaturas.includes(v.id);

              return (
                <article
                  key={v.id}
                  className={`vaga-card ${aplicada ? "aplicada-card" : ""}`}
                >
                  <div className="vaga-header">
                    <div className="vaga-info">
                      <h2>{v.titulo}</h2>
                      <p className="empresa">{v.empresa}</p>
                    </div>

                    <span
                      className={`badge ${
                        aplicada ? "aplicada" : v.status?.toLowerCase() || "aberta"
                      }`}
                    >
                      {aplicada ? "Aplicada" : v.status || "Aberta"}
                    </span>
                  </div>

                  <p className="descricao">
                    {v.descricao?.slice(0, 140) || "Descrição breve da vaga."}
                  </p>

                  <div className="vaga-footer">
                    <span className="local">
                      {v.localizacao || "Local indefinido"} • {v.modalidade}
                    </span>

                    <div className="botoes-card">

                      <button
                        className="btn ghost sm"
                        onClick={() =>
                          navigate("/detalhes-vaga-candidato", { state: v })
                        }
                      >
                        Detalhes
                      </button>

                      <button
                        className={`btn primary sm ${
                          aplicada ? "disabled-btn" : ""
                        }`}
                        disabled={aplicada}
                        onClick={() => abrirModalCandidatura(v)}
                      >
                        {aplicada ? "Já aplicada" : "Candidatar-se"}
                      </button>

                    </div>
                  </div>
                </article>
              );
            })
          )}
        </section>

        {/* ===== MODAL CONFIRMAR ===== */}
        {modalConfirm.isOpen && vagaSelecionada && (
          <ModalConfirmarCandidatura
            isOpen={modalConfirm.isOpen}
            vaga={vagaSelecionada}
            onClose={modalConfirm.close}
            onSuccess={() => {
              modalConfirm.close();
              setVagas(api.vagas.getAll());
            }}
          />
        )}
      </main>

    </div>
  );
}
