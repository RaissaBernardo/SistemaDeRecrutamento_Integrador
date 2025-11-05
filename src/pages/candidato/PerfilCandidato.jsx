import React, { useEffect, useState } from "react";
import SidebarCandidato from "../../components/SidebarCandidato";
import "../../styles/candidato/PerfilCandidato.css";
import { getProfile, saveProfile, getLoggedUser } from "../../services/storageService";

export default function PerfilCandidato({ onLogout }) {
  const [profile, setProfile] = useState({
    nome: "",
    email: "",
    celular: "",
    endereco: "",
    resumo: "",
    experiencias: [],
    formacao: [],
    habilidades: [],
    links: [],
    anexos: [],
  });

  const [draft, setDraft] = useState(profile);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    const logged = getLoggedUser();
    if (!logged) return;

    const stored = getProfile(logged.email);
    if (stored) {
      setProfile(stored);
      setDraft(stored);
    } else {
      const base = {
        ...profile,
        nome: logged.nome || "",
        email: logged.email || "",
      };
      setProfile(base);
      setDraft(base);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleChange(e) {
    const { name, value } = e.target;
    setDraft((p) => ({ ...p, [name]: value }));
  }

  function addArrayItem(field, value) {
    if (!value) return;
    setDraft((p) => ({ ...p, [field]: [...(p[field] || []), value] }));
  }

  function removeArrayItem(field, index) {
    setDraft((p) => ({
      ...p,
      [field]: (p[field] || []).filter((_, i) => i !== index),
    }));
  }

  function save() {
    const logged = getLoggedUser();
    if (!logged) return;

    saveProfile(logged.email, draft);
    setProfile(draft);
    setEditing(false);
  }

  return (
    <div className="app-candidato">
      <SidebarCandidato onLogout={onLogout} />
      <main className="main-content-candidato perfil-page">
        <header className="perfil-header">
          <h1>Meu perfil</h1>
          {!editing ? (
            <button className="btn primary" onClick={() => setEditing(true)}>
              Editar
            </button>
          ) : (
            <div className="perfil-actions">
              <button className="btn ghost" onClick={() => { setDraft(profile); setEditing(false); }}>
                Cancelar
              </button>
              <button className="btn primary" onClick={save}>
                Salvar
              </button>
            </div>
          )}
        </header>

        <section className="perfil-section">
          <h2>Dados pessoais</h2>
          <div className="grid-2">
            <div className="field">
              <label>Nome completo</label>
              {editing ? (
                <input
                  name="nome"
                  value={draft.nome}
                  onChange={handleChange}
                />
              ) : (
                <p>{profile.nome}</p>
              )}
            </div>

            <div className="field">
              <label>E-mail</label>
              {editing ? (
                <input
                  name="email"
                  value={draft.email}
                  onChange={handleChange}
                />
              ) : (
                <p>{profile.email}</p>
              )}
            </div>

            <div className="field">
              <label>Celular</label>
              {editing ? (
                <input
                  name="celular"
                  value={draft.celular}
                  onChange={handleChange}
                />
              ) : (
                <p>{profile.celular || "Não informado"}</p>
              )}
            </div>

            <div className="field">
              <label>Endereço</label>
              {editing ? (
                <input
                  name="endereco"
                  value={draft.endereco}
                  onChange={handleChange}
                />
              ) : (
                <p>{profile.endereco || "Não informado"}</p>
              )}
            </div>
          </div>
        </section>

        <section className="perfil-section">
          <h2>Resumo profissional</h2>
          {editing ? (
            <textarea
              name="resumo"
              value={draft.resumo}
              onChange={handleChange}
            />
          ) : (
            <p>{profile.resumo || "Você ainda não preencheu seu resumo."}</p>
          )}
        </section>

        {/* Experiências, formação, habilidades, links, anexos – mantêm mesma lógica */}
        {/* Aqui você pode manter a mesma estrutura que já usava, agora baseada em draft/profile */}

        {/* Exemplo para habilidades */}
        <section className="perfil-section">
          <h2>Habilidades</h2>
          <ul className="list">
            {(editing ? draft.habilidades : profile.habilidades || []).map(
              (h, i) => (
                <li key={i} className="list-item">
                  <span>{h}</span>
                  {editing && (
                    <button
                      className="btn tiny danger"
                      onClick={() => removeArrayItem("habilidades", i)}
                    >
                      Remover
                    </button>
                  )}
                </li>
              )
            )}
            {(!profile.habilidades || profile.habilidades.length === 0) &&
              !editing && <li className="empty">Nenhuma habilidade adicionada.</li>}
          </ul>
        </section>
      </main>
    </div>
  );
}
