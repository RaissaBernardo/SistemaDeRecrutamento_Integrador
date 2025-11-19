import React, { useEffect, useState } from "react";
import SidebarCandidato from "../../components/SidebarCandidato";
import InlineForm from "./InlineForm";

import { api } from "../../services/mockApi";
import { getLoggedUser } from "../../services/storageService";

import "../../styles/candidato/PerfilCandidato.css";

/* ==========================================================
 💜 SmartResume.AI — Classificador com 20 áreas
========================================================== */
function minerarResumoIA(dados) {
  try {
    const nome = dados.nome?.split(" ")[0] || "O candidato";
    const exp = dados.experiencias || [];
    const form = dados.formacao || [];
    const habs = dados.habilidades?.map((h) => h?.nome?.toLowerCase()) || [];
    const cursos = dados.cursos?.map((c) => c.nome?.toLowerCase()) || [];
    const idiomas = dados.idiomas?.map((i) => `${i.idioma} (${i.nivel})`) || [];

    const nenhum =
      exp.length +
        form.length +
        habs.length +
        cursos.length +
        idiomas.length ===
      0;
    if (nenhum)
      return `${nome} ainda não forneceu informações suficientes para gerar um resumo.`;

    const areaMap = {
      tecnologia:
        /(java|python|react|node|html|css|javascript|sql|api|spring|devops|cloud|docker)/i,
      dados:
        /(data|dados|estatística|analytics|machine learning|ia|etl|big data)/i,
      ciberseguranca: /(segurança|cyber|pentest|firewall|owasp)/i,
      redes: /(rede|network|cisco|switch|roteador)/i,
      engenharia: /(engenheir|automação|mecânica|produção|elétrica)/i,
      logistica: /(logística|estoque|transporte|supply)/i,
      administrativo: /(gestão|administração|financeiro|processos)/i,
      marketing: /(marketing|design|ux|ui|social|branding)/i,
      vendas: /(comercial|vendas|negociação|cliente)/i,
      atendimento: /(atendimento|call center|suporte)/i,
      saúde: /(hospital|saúde|clínica|enfermagem)/i,
      educacao: /(professor|ensino|pedagogia)/i,
      direito: /(jurídico|advogado|contrato|leis)/i,
      recursos_humanos: /(rh|recrutamento|seleção|treinamento)/i,
      arquitetura: /(arquitetura|urbanismo|autocad|revit)/i,
      contabilidade: /(contabilidade|imposto|balanço)/i,
      gastronomia: /(cozinha|gastronomia|chef)/i,
      construção: /(obra|construção|civil)/i,
      audiovisual: /(vídeo|edição|filmagem|motion)/i,
      geral: /.*/
    };

    const termos = [
      ...habs,
      ...cursos,
      ...form.map((f) => f.curso?.toLowerCase()),
      ...exp.map((e) => e.cargo?.toLowerCase())
    ];

    const pontuacoes = Object.fromEntries(
      Object.entries(areaMap).map(([area, regex]) => [
        area,
        termos.filter((t) => regex.test(t)).length
      ])
    );

    const areaDominante = Object.entries(pontuacoes).sort((a, b) => b[1] - a[1])[0][0];

    const frases = {
      tecnologia: [
        "atua com desenvolvimento moderno.",
        "tem domínio em fundamentos de software.",
        "busca criar soluções escaláveis e seguras."
      ],
      dados: [
        "atua com análise e modelagem de dados.",
        "possui visão analítica forte.",
        "transforma dados em insights."
      ],
      geral: [
        "atua com versatilidade.",
        "possui aprendizado rápido.",
        "é dedicado e comprometido."
      ]
    };

    const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

    return `${nome} ${pick(frases[areaDominante] || frases.geral)}`.trim();
  } catch {
    return "⚠️ Não foi possível gerar o resumo.";
  }
}

/* ==========================================================
        SECTION — AGORA FORA E OTIMIZADO (SEM BUG)
========================================================== */

const Section = React.memo(function Section({
  title,
  field,
  list,
  children,
  editing,
  abrirForm,
  formInline,
  tempItem,
  atualizarTemp,
  salvarItem,
  cancelarForm,
  removerItem
}) {
  return (
    <section className="perfil-card">
      <div className="section-header">
        <h3>{title}</h3>
        {editing && field && (
          <button className="btn ghost tiny" onClick={() => abrirForm(field)}>
            + Adicionar
          </button>
        )}
      </div>

      {children}

      {formInline === field && editing && (
        <InlineForm
          field={field}
          tempItem={tempItem}
          atualizarTemp={atualizarTemp}
          salvarItem={salvarItem}
          cancelarForm={cancelarForm}
        />
      )}

      {list && list.length > 0 && (
        <div className="list-area">
          {field === "habilidades" ? (
            <div className="chips">
              {list.map((hab, i) => (
                <div key={i} className="chip">
                  {hab.nome}
                  {editing && (
                    <button onClick={() => removerItem("habilidades", i)}>×</button>
                  )}
                </div>
              ))}
            </div>
          ) : (
            list.map((item, i) => (
              <div key={i} className="list-card">
                {field === "formacao" && (
                  <>
                    <h4>{item.curso}</h4>
                    <p>{item.instituicao}</p>
                    <p className="periodo">
                      {item.inicio} — {item.fim}
                    </p>
                    <p className="descricao">{item.status}</p>
                  </>
                )}

                {field === "experiencias" && (
                  <>
                    <h4>{item.cargo}</h4>
                    <p>{item.empresa}</p>
                    <p className="periodo">
                      {item.inicio} — {item.fim}
                    </p>
                    <p className="descricao">{item.descricao}</p>
                  </>
                )}

                {field === "cursos" && (
                  <>
                    <h4>{item.nome}</h4>
                    <p>{item.instituicao}</p>
                    <p>
                      {item.carga} — {item.ano}
                    </p>
                  </>
                )}

                {field === "idiomas" && (
                  <p>
                    <strong>{item.idioma}</strong> — {item.nivel}
                  </p>
                )}

                {field === "links" && (
                  <>
                    <p>
                      <strong>{item.nome}</strong>
                    </p>
                    <a href={item.url} target="_blank" rel="noreferrer">
                      {item.url}
                    </a>
                  </>
                )}

                {field === "anexos" && (
                  <>
                    <p>
                      <strong>{item.nome}</strong>
                    </p>
                    <p>{item.tipo}</p>
                  </>
                )}

                {editing && (
                  <button
                    className="btn danger tiny"
                    onClick={() => removerItem(field, i)}
                  >
                    Remover
                  </button>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </section>
  );
});

/* ==========================================================
                 COMPONENTE PRINCIPAL
========================================================== */
export default function PerfilCandidato({ onLogout }) {
  const [profile, setProfile] = useState({});
  const [draft, setDraft] = useState({});
  const [editing, setEditing] = useState(false);
  const [loadingIA, setLoadingIA] = useState(false);

  const [formInline, setFormInline] = useState(null);
  const [tempItem, setTempItem] = useState({});

  useEffect(() => {
    const logged = getLoggedUser();
    if (!logged) return;

    const stored = api.getProfile(logged.email);
    if (stored) {
      setProfile(stored);
      setDraft(stored);
    } else {
      const base = {
        nome: logged.nome,
        email: logged.email,
        celular: "",
        endereco: "",
        resumo: "",
        formacao: [],
        experiencias: [],
        cursos: [],
        idiomas: [],
        habilidades: [],
        links: [],
        anexos: []
      };
      setProfile(base);
      setDraft(base);
      api.saveProfile(logged.email, base);
    }
  }, []);

  function handleChange(e) {
    setDraft((p) => ({ ...p, [e.target.name]: e.target.value }));
  }

  function abrirForm(field) {
    setFormInline(field);
    setTempItem({});
  }

  function cancelarForm() {
    setFormInline(null);
    setTempItem({});
  }

  function atualizarTemp(e) {
    setTempItem((p) => ({ ...p, [e.target.name]: e.target.value }));
  }

  function salvarItem(field) {
    setDraft((p) => ({
      ...p,
      [field]: [
        ...p[field],
        field === "habilidades" ? { nome: tempItem.nome } : tempItem
      ]
    }));
    cancelarForm();
  }

  function removerItem(field, index) {
    setDraft((p) => ({
      ...p,
      [field]: p[field].filter((_, i) => i !== index)
    }));
  }

  function salvarTudo() {
    const logged = getLoggedUser();
    api.saveProfile(logged.email, draft);
    setProfile(draft);
    setEditing(false);
  }

  function gerarResumo() {
    setLoadingIA(true);
    setTimeout(() => {
      const texto = minerarResumoIA(draft);
      setDraft((p) => ({ ...p, resumo: texto }));
      setLoadingIA(false);
    }, 2000);
  }

  /* ====================== RENDER ====================== */

  return (
    <div className="perfil-root">
      <SidebarCandidato onLogout={onLogout} />

      <main className="perfil-wrapper">
        <header className="perfil-header">
          <h1>Meu Perfil</h1>

          {!editing ? (
            <button className="btn primary" onClick={() => setEditing(true)}>
              Editar
            </button>
          ) : (
            <div className="perfil-actions">
              <button
                className="btn ghost"
                onClick={() => {
                  setDraft(profile);
                  setEditing(false);
                }}
              >
                Cancelar
              </button>

              <button className="btn primary" onClick={salvarTudo}>
                Salvar
              </button>
            </div>
          )}
        </header>

        {/* DADOS PESSOAIS */}
        <Section title="Dados Pessoais">
          <div className="grid-2">
            {["nome", "email", "celular", "endereco"].map((f) => (
              <div className="field" key={f}>
                <label>{f.toUpperCase()}</label>
                {editing ? (
                  <input
                    name={f}
                    value={draft[f] || ""}
                    onChange={handleChange}
                  />
                ) : (
                  <p className="readonly">{profile[f] || "Não informado"}</p>
                )}
              </div>
            ))}
          </div>
        </Section>

        {/* RESUMO */}
        <section className="perfil-card">
          <div className="section-header resumo-header">
            <h3>Resumo Profissional</h3>

            {editing && (
              <button
                className={`btn ai-btn ${loadingIA ? "loading" : ""}`}
                disabled={loadingIA}
                onClick={gerarResumo}
              >
                {loadingIA ? (
                  <span className="spinner-purple"></span>
                ) : (
                  "⚡ Gerar com IA"
                )}
              </button>
            )}
          </div>

          {editing ? (
            <textarea
              name="resumo"
              value={draft.resumo || ""}
              onChange={handleChange}
              placeholder="Escreva ou gere automaticamente um resumo..."
            />
          ) : (
            <p className="readonly">
              {profile.resumo || "Ainda não há resumo cadastrado."}
            </p>
          )}
        </section>

        {/* LISTAS */}
        <Section
          title="Formação"
          field="formacao"
          list={draft.formacao}
          editing={editing}
          abrirForm={abrirForm}
          formInline={formInline}
          tempItem={tempItem}
          atualizarTemp={atualizarTemp}
          salvarItem={salvarItem}
          cancelarForm={cancelarForm}
          removerItem={removerItem}
        />

        <Section
          title="Experiências"
          field="experiencias"
          list={draft.experiencias}
          editing={editing}
          abrirForm={abrirForm}
          formInline={formInline}
          tempItem={tempItem}
          atualizarTemp={atualizarTemp}
          salvarItem={salvarItem}
          cancelarForm={cancelarForm}
          removerItem={removerItem}
        />

        <Section
          title="Cursos e Certificações"
          field="cursos"
          list={draft.cursos}
          editing={editing}
          abrirForm={abrirForm}
          formInline={formInline}
          tempItem={tempItem}
          atualizarTemp={atualizarTemp}
          salvarItem={salvarItem}
          cancelarForm={cancelarForm}
          removerItem={removerItem}
        />

        <Section
          title="Idiomas"
          field="idiomas"
          list={draft.idiomas}
          editing={editing}
          abrirForm={abrirForm}
          formInline={formInline}
          tempItem={tempItem}
          atualizarTemp={atualizarTemp}
          salvarItem={salvarItem}
          cancelarForm={cancelarForm}
          removerItem={removerItem}
        />

        <Section
          title="Habilidades"
          field="habilidades"
          list={draft.habilidades}
          editing={editing}
          abrirForm={abrirForm}
          formInline={formInline}
          tempItem={tempItem}
          atualizarTemp={atualizarTemp}
          salvarItem={salvarItem}
          cancelarForm={cancelarForm}
          removerItem={removerItem}
        />

        <Section
          title="Links"
          field="links"
          list={draft.links}
          editing={editing}
          abrirForm={abrirForm}
          formInline={formInline}
          tempItem={tempItem}
          atualizarTemp={atualizarTemp}
          salvarItem={salvarItem}
          cancelarForm={cancelarForm}
          removerItem={removerItem}
        />

        <Section
          title="Anexos"
          field="anexos"
          list={draft.anexos}
          editing={editing}
          abrirForm={abrirForm}
          formInline={formInline}
          tempItem={tempItem}
          atualizarTemp={atualizarTemp}
          salvarItem={salvarItem}
          cancelarForm={cancelarForm}
          removerItem={removerItem}
        />
      </main>
    </div>
  );
}
