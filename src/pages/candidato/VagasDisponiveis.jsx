import React, { useEffect, useState } from "react";
import SidebarCandidato from "../../components/SidebarCandidato";
import { api } from "../../services/mockApi"; // 🔥 MOCK API PROFISSIONAL
import "../../styles/candidato/VagasDisponiveis.css";
import { useNavigate } from "react-router-dom";
import { getLoggedUser } from "../../services/storageService";

export default function VagasDisponiveis({ onLogout }) {
  const [vagas, setVagas] = useState([]);
  const [busca, setBusca] = useState("");
  const [statusFiltro, setStatusFiltro] = useState("");
  const [menuAberto, setMenuAberto] = useState(null);

  const navigate = useNavigate();

  /* ============================================================
     🔄 CARREGAR TODAS AS VAGAS DO mockApi
  ============================================================ */
  useEffect(() => {
    const lista = api.getVagas(); // ← agora CERTINHO
    setVagas(lista || []);
  }, []);

  /* ============================================================
     🔎 FILTROS — busca + status
  ============================================================ */
  const vagasFiltradas = vagas.filter((v) => {
    const byBusca =
      !busca ||
      v.titulo?.toLowerCase().includes(busca.toLowerCase()) ||
      v.empresa?.toLowerCase().includes(busca.toLowerCase());

    const byStatus = !statusFiltro || v.status === statusFiltro;

    return byBusca && byStatus;
  });

  /* ============================================================
     📌 CANDIDATAR-SE
  ============================================================ */
  function candidatar(vaga) {
    const logged = getLoggedUser();

    if (!logged) {
      navigate("/login");
      return;
    }

    api.createCandidatura({
      vagaId: vaga.id,
      candidatoEmail: logged.email,
      nome: logged.nome,
      tituloVaga: vaga.titulo,
      empresa: vaga.empresa,
    });

    alert("Candidatura enviada com sucesso!");
  }

  return (
    <div className="app-candidato">
      <SidebarCandidato onLogout={onLogout} />

      <main className="main-content-candidato vagas-page">

        {/* ===================== HEADER ===================== */}
        <header className="vagas-header">
          <div>
            <h1>Vagas disponíveis</h1>
            <p className="muted">
              Veja oportunidades abertas e candidate-se.
            </p>
          </div>
        </header>

        {/* ===================== FILTROS ===================== */}
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

        {/* ===================== LISTA DE VAGAS ===================== */}
        <section className="vagas-lista">
          {vagasFiltradas.length === 0 ? (
            <p className="empty">Nenhuma vaga encontrada.</p>
          ) : (
            vagasFiltradas.map((v, i) => (
              <article
                key={v.id}
                className="vaga-card"
                onClick={() => navigate("/detalhes-vaga", { state: v })}
              >
                <div className="vaga-header">
                  <div className="vaga-info">
                    <h2>{v.titulo || "Título da vaga"}</h2>
                    <p className="empresa">{v.empresa}</p>
                  </div>

                  <span className={`badge ${v.status?.toLowerCase() || "aberta"}`}>
                    {v.status || "Aberta"}
                  </span>
                </div>

                <p className="descricao">
                  {v.descricao?.slice(0, 140) ||
                    "Descrição breve da vaga. (Aguardando dados completos)"}
                </p>

                <div className="vaga-footer">
                  <span className="local">
                    {v.local || "Local não informado"} •{" "}
                    {v.modalidade || "Modalidade indefinida"}
                  </span>

                  {/* Menu de ações */}
                  <div style={{ position: "relative" }}>
                    <button
                      className="acao-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        setMenuAberto(menuAberto === i ? null : i);
                      }}
                    >
                      ⋮
                    </button>

                    {menuAberto === i && (
                      <div
                        className="menu-acoes"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <button
                          onClick={() => {
                            navigate("/detalhes-vaga", { state: v });
                            setMenuAberto(null);
                          }}
                        >
                          Ver detalhes
                        </button>

                        <button
                          onClick={() => {
                            candidatar(v);
                            setMenuAberto(null);
                          }}
                        >
                          Candidatar-se
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </article>
            ))
          )}
        </section>
      </main>
    </div>
  );
}
