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
  const logged = getLoggedUser();

  // 🔄 Carregar vagas + perfis de empresas
  const carregarVagas = () => {
    const dbVagas = api.vagas.getAll() || [];
    const perfis = api.perfis.getAll() || [];

    // Adiciona verificado na vaga
    const vagasComVerificado = dbVagas.map((v) => {
      const perfilEmpresa = perfis.find((p) => p.email === v.empresaEmail);
      return {
        ...v,
        empresaVerificada: perfilEmpresa?.verificado || false,
      };
    });

    setVagas(vagasComVerificado);
  };

  useEffect(() => {
    carregarVagas();
  }, []);

  // 🔄 Vagas que o usuário já aplicou
  const minhasCandidaturas = api.candidaturas
    .getAll()
    .filter((c) => c.candidatoEmail === logged?.email)
    .map((c) => c.vagaId);

  // 🔎 Filtragem
  const vagasFiltradas = vagas.filter((v) => {
    const txt = busca.toLowerCase();
    const byBusca =
      !busca ||
      v.titulo?.toLowerCase().includes(txt) ||
      v.empresa?.toLowerCase().includes(txt);
    const byStatus = !statusFiltro || (v.status || "Aberta") === statusFiltro;
    return byBusca && byStatus;
  });

  // 🟢 Abrir modal de candidatura
  function abrirModalCandidatura(vaga) {
    if (!logged) {
      navigate("/login");
      return;
    }

    if (minhasCandidaturas.includes(vaga.id)) {
      alert("⚠ Você já se candidatou para esta vaga!");
      return;
    }

    setVagaSelecionada(vaga);
    modalConfirm.open();
  }

  return (
    <div className="main-content">
      <main className="main-content-candidato vagas-page">
        {/* ===== Header ===== */}
        <header className="vagas-header">
          <h1>Vagas disponíveis</h1>
          <p className="muted">Veja oportunidades abertas e candidate-se.</p>
        </header>

        {/* ===== Filtros ===== */}
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

        {/* ===== Lista de vagas ===== */}
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
                      <p className="empresa">
                        {v.empresa}
                        {v.empresaVerificada && (
                          <span className="verified-badge">
                            <svg
                              width="14"
                              height="14"
                              viewBox="0 0 24 24"
                              fill="white"
                              xmlns="http://www.w3.org/2000/svg"
                              className="verified-icon"
                            >
                              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
                            </svg>
                            Empresa verificada
                          </span>
                        )}
                      </p>
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

        {/* ===== Modal Confirmar Candidatura ===== */}
        {modalConfirm.isOpen && vagaSelecionada && (
          <ModalConfirmarCandidatura
            isOpen={modalConfirm.isOpen}
            vaga={vagaSelecionada}
            onClose={modalConfirm.close}
            onSuccess={() => {
              modalConfirm.close();
              carregarVagas(); // recarrega vagas com selo atualizado
            }}
          />
        )}
      </main>
    </div>
  );
}
