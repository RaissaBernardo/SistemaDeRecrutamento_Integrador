import React, { useEffect, useState } from "react";
import SidebarCandidato from "../../components/SidebarCandidato";
import { getEntrevistas, getLoggedUser } from "../../services/storageService";
import "../../styles/candidato/Entrevistas.css";

export default function Entrevistas({ onLogout }) {
  const [entrevistas, setEntrevistas] = useState([]);
  const [q, setQ] = useState("");
  const [futuras, setFuturas] = useState(true);
  const [statusFiltro, setStatusFiltro] = useState("");

  useEffect(() => {
    const logged = getLoggedUser();
    const items = getEntrevistas() || [];
    const minhas = logged ? items.filter((i) => i.candidatoEmail === logged.email) : [];
    setEntrevistas(minhas);
  }, []);

  const hoje = new Date();
  const filtradas = entrevistas.filter((it) => {
    const dataEntrevista = it.data ? new Date(it.data) : null;
    const byTexto = !q || (it.vagaTitulo && it.vagaTitulo.toLowerCase().includes(q.toLowerCase())) || (it.empresa && it.empresa.toLowerCase().includes(q.toLowerCase()));
    const byTempo = !dataEntrevista ? true : (futuras ? dataEntrevista >= hoje : dataEntrevista < hoje);
    const byStatus = !statusFiltro || it.status === statusFiltro;
    return byTexto && byTempo && byStatus;
  });

  return (
    <div className="app-candidato">
      <SidebarCandidato onLogout={onLogout} />
      <main className="main-content-candidato entrevistas-page">
        <header className="entrevistas-header">
          <h1>Entrevistas</h1>
          <p className="muted">Acompanhe entrevistas agendadas e seus status.</p>
        </header>

        <div className="filtros">
          <input type="text" placeholder="Buscar por vaga ou empresa..." value={q} onChange={(e) => setQ(e.target.value)} />
          <select value={statusFiltro} onChange={(e) => setStatusFiltro(e.target.value)}>
            <option value="">Todos os status</option>
            <option value="Agendada">Agendada</option>
            <option value="Concluída">Concluída</option>
            <option value="Cancelada">Cancelada</option>
          </select>
          <button className="btn ghost" onClick={() => setFuturas((prev) => !prev)}>
            {futuras ? "Ver passadas" : "Ver futuras"}
          </button>
        </div>

        <section className="lista-entrevistas">
          {filtradas.length === 0 ? (
            <p className="empty">Nenhuma entrevista encontrada com os filtros atuais.</p>
          ) : (
            filtradas.map((it) => (
              <article key={it.id} className="entrevista-card">
                <div className="info">
                  <h2>{it.vagaTitulo}</h2>
                  <p className="empresa">{it.empresa}</p>
                  <p className="data">{it.data} • {it.horario}</p>
                </div>
                <div className="acoes">
                  <div className={`status ${it.status?.toLowerCase() || ""}`}>{it.status || "Agendada"}</div>
                  <div className="btns">
                    <button className="btn ghost" onClick={() => alert("Abrir detalhes da entrevista")}>Detalhes</button>
                    <button className="btn primary" onClick={() => alert("Abrir link/Meet")}>Meet</button>
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
