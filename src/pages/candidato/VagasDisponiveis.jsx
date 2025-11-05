import React, { useEffect, useState } from "react";
import SidebarCandidato from "../../components/SidebarCandidato";
import { getVagas, getCandidaturas, saveCandidaturas, getLoggedUser } from "../../services/storageService";
import "../../styles/candidato/VagasDisponiveis.css";


import { useNavigate } from "react-router-dom";

export default function VagasDisponiveis({ onLogout }) {
  const [vagas, setVagas] = useState([]);
  const [busca, setBusca] = useState("");
  const [statusFiltro, setStatusFiltro] = useState("");
  const [menuAberto, setMenuAberto] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    setVagas(getVagas() || []);
  }, []);

  const vagasFiltradas = vagas.filter((v) => {
    const byBusca =
      !busca ||
      v.titulo?.toLowerCase().includes(busca.toLowerCase()) ||
      v.empresa?.toLowerCase().includes(busca.toLowerCase());
    const byStatus = !statusFiltro || v.status === statusFiltro;
    return byBusca && byStatus;
  });

  function candidatar(vaga) {
    const logged = getLoggedUser();
    if (!logged) {
      navigate("/login");
      return;
    }
    const lista = getCandidaturas() || [];
    const now = new Date();
    const nova = {
      id: Date.now(),
      candidatoEmail: logged.email,
      vagaId: vaga.id,
      vagaTitulo: vaga.titulo,
      empresa: vaga.empresa,
      data: now.toLocaleDateString(),
      dataAtualizacao: now.toLocaleDateString(),
      status: "Recebida",
    };
    saveCandidaturas([nova, ...lista]);
    alert("Candidatura enviada!");
  }

  return (
    <div className="app-candidato">
      <SidebarCandidato onLogout={onLogout} />
      <main className="main-content-candidato vagas-page">
        <div className="vagas-header">
          <h1>Vagas disponíveis</h1>
          <p className="muted">Encontre oportunidades alinhadas ao seu perfil.</p>
        </div>

        <div className="vagas-filtros">
          <input
            type="text"
            placeholder="Pesquisar por título ou empresa..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
          />
          <select value={statusFiltro} onChange={(e) => setStatusFiltro(e.target.value)}>
            <option value="">Todas</option>
            <option value="Aberta">Aberta</option>
            <option value="Encerrada">Encerrada</option>
          </select>
        </div>

        <div className="vagas-lista">
          {vagasFiltradas.length === 0 ? (
            <p className="empty">Nenhuma vaga encontrada.</p>
          ) : (
            vagasFiltradas.map((v, i) => (
              <article key={v.id || i} className="vaga-card" onClick={() => navigate("/detalhes-vaga", { state: v })}>
                <div className="vaga-header">
                  <div>
                    <h2>{v.titulo}</h2>
                    <p className="empresa">{v.empresa}</p>
                  </div>
                  <span className={`badge ${v.status?.toLowerCase() || ""}`}>{v.status || "Aberta"}</span>
                </div>

                <p className="descricao">{v.detalhes?.descricao?.slice(0, 140) || "Descrição não informada."}</p>

                <div className="vaga-footer">
                  <span className="local">{v.localizacao} • {v.modalidade}</span>

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
                      <div className="menu-acoes" onClick={(e)=>e.stopPropagation()}>
                        <button onClick={() => { navigate("/detalhes-vaga", { state: v }); setMenuAberto(null); }}>
                          Ver detalhes
                        </button>
                        <button onClick={() => { candidatar(v); setMenuAberto(null); }}>
                          Candidatar-se
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </article>
            ))
          )}
        </div>
      </main>
    </div>
  );
}
