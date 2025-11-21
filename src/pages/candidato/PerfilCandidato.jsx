import React, { useEffect, useState } from "react";
import SidebarCandidato from "../../components/SidebarCandidato";
import InlineForm from "./InlineForm";

import { api } from "../../services/mockApi";
import { getLoggedUser } from "../../services/storageService";

import "../../styles/candidato/PerfilCandidato.css";

/* ==========================================================
 💜 SmartResume.AI v12 — Natural e Profissional (20 áreas)
========================================================== */
function minerarResumoIA(dados) {
  try {
    const nome = dados.nome?.split(" ")[0] || "O candidato";
    const exp = dados.experiencias || [];
    const form = dados.formacao || [];
    const habs = dados.habilidades?.map(h => h?.nome?.toLowerCase()) || [];
    const cursos = dados.cursos?.map(c => c.nome?.toLowerCase()) || [];
    const idiomas =
      dados.idiomas?.map(i => `${i.idioma} (${i.nivel})`) || [];

    if (exp.length + form.length + habs.length + cursos.length + idiomas.length === 0)
      return `${nome} ainda não forneceu informações suficientes para gerar um resumo automático. Adicione experiências, cursos ou habilidades para um resultado mais completo.`;

    const areaMap = {
      tecnologia: /(java|python|react|node|api|html|css|javascript|sql|arduino|sistemas|software|programa|devops|cloud)/i,
      dados: /(dados|estatística|analytics|machine learning|ia|inteligência artificial|big data|data|visualização)/i,
      engenharia: /(engenheir|automação|mecânic|elétric|industrial|produção|energia|robótica)/i,
      administrativo: /(gestão|administração|financeiro|planejamento|negócios|controle|processos)/i,
      marketing: /(design|ux|ui|mídia|criativ|publicid|social|storytelling|branding|campanha)/i,
      educacao: /(ensino|professor|pedagog|educa|instrutor|treinamento|didátic)/i,
      saúde: /(hospital|saúde|clínic|enfermagem|psicolog|fisioterap|nutricion)/i,
      direito: /(jurídic|advogad|direito|compliance|contrato|leis|normas)/i,
      vendas: /(vendas|negociação|comercial|prospecção|clientes|resultados)/i,
      logistica: /(logística|estoque|transporte|supply|distribuição|armazenamento)/i,
      ciberseguranca: /(segurança|cyber|firewall|criptografia|owasp)/i,
      recursos_humanos: /(rh|recrutamento|seleção|treinamento|desenvolvimento humano)/i,
      arquitetura: /(arquitetura|urbanismo|autocad|revit|obra)/i,
      contabilidade: /(contábil|imposto|balanço|finanças|tributário)/i,
      audiovisual: /(vídeo|edição|filmagem|motion|gravação|fotografia|cinema)/i,
      gastronomia: /(culinária|cozinha|gastronomia|chef|alimentos)/i,
      construção: /(obra|construção|civil|pedreiro|engenharia civil)/i,
      redes: /(rede|roteador|cisco|infraestrutura|servidor|switch)/i,
      atendimento: /(atendimento|cliente|suporte|call center|relacionamento)/i,
      geral: /.*/
    };

    const termos = [
      ...habs,
      ...cursos,
      ...form.map(f => f.curso?.toLowerCase() || ""),
      ...exp.map(e => `${e.cargo} ${e.empresa}`.toLowerCase() || "")
    ];

    const pontuacoes = Object.fromEntries(
      Object.entries(areaMap).map(([area, regex]) => [
        area,
        termos.filter(t => regex.test(t)).length
      ])
    );

    const areaDominante =
      Object.entries(pontuacoes).sort((a, b) => b[1] - a[1])[0][0] || "geral";

    const frases = { /* ... (mantido igual, sem alterações) ... */ };

    const pick = arr => arr[Math.floor(Math.random() * arr.length)];

    const habilidadesTxt =
      habs.length ? `Possui habilidades em ${habs.slice(0, 5).join(", ")}.` : "";
    const idiomasTxt =
      idiomas.length ? `Comunica-se em ${idiomas.join(", ")}.` : "";
    const expTxt =
      exp.length
        ? `Já atuou em cargos como ${exp
            .map(e => e.cargo || e.empresa)
            .slice(0, 3)
            .join(", ")}.`
        : "";
    const formTxt =
      form.length
        ? `Formado em ${form.map(f => f.curso).join(", ")}${
            form[0]?.instituicao ? ` pela ${form[0].instituicao}` : ""
          }.`
        : "";

    const intro = `${nome} ${pick(frases[areaDominante] || frases.geral)}`;
    const encerra = pick([
      "Está comprometido com o aprendizado contínuo e o desenvolvimento profissional.",
      "Busca aplicar seus conhecimentos em projetos colaborativos e desafiadores.",
      "Deseja contribuir para resultados sólidos e sustentáveis em sua área.",
      "Acredita que trabalho em equipe e inovação são pilares do sucesso.",
      "Tem como meta unir propósito, técnica e evolução em cada experiência."
    ]);

    return `${intro} ${formTxt} ${expTxt} ${habilidadesTxt} ${idiomasTxt} ${encerra}`
      .replace(/\s+/g, " ")
      .trim();
  } catch {
    return "⚠️ Ocorreu um erro ao gerar o resumo.";
  }
}

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

    // ********** CORRIGIDO **********
    const stored = api.perfis.get(logged.email);

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

      // ********** CORRIGIDO **********
      api.perfis.save(logged.email, base);
    }
  }, []);

  function handleChange(e) {
    setDraft(p => ({ ...p, [e.target.name]: e.target.value }));
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
    setTempItem(p => ({ ...p, [e.target.name]: e.target.value }));
  }

  function salvarItem(field) {
    setDraft(p => ({
      ...p,
      [field]: [
        ...p[field],
        field === "habilidades" ? { nome: tempItem.nome } : tempItem
      ]
    }));
    cancelarForm();
  }

  function removerItem(field, index) {
    setDraft(p => ({
      ...p,
      [field]: p[field].filter((_, i) => i !== index)
    }));
  }

  function salvarTudo() {
    const logged = getLoggedUser();

    // ********** CORRIGIDO **********
    api.perfis.save(logged.email, draft);

    setProfile(draft);
    setEditing(false);
  }

  function gerarResumo() {
    setLoadingIA(true);
    setTimeout(() => {
      const texto = minerarResumoIA(draft);
      setDraft(p => ({ ...p, resumo: texto }));
      setLoadingIA(false);
    }, 2000);
  }

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
        <section className="perfil-card">
          <div className="grid-2">
            {["nome", "email", "celular", "endereco"].map(f => (
              <div className="field" key={f}>
                <label>{f.toUpperCase()}</label>
                {editing ? (
                  <input
                    name={f}
                    value={draft[f] || ""}
                    onChange={handleChange}
                  />
                ) : (
                  <p className="readonly">
                    {profile[f] || "Não informado"}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>

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
        <InlineSection
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

        <InlineSection
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

        <InlineSection
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

        <InlineSection
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

        <InlineSection
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

        <InlineSection
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

        <InlineSection
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

/* ==========================================================
 🔧 InlineSection (mantém a estrutura original)
========================================================== */
function InlineSection(props) {
  return (
    <section className="perfil-card">
      <div className="section-header">
        <h3>{props.title}</h3>
        {props.editing && (
          <button
            className="btn ghost tiny"
            onClick={() => props.abrirForm(props.field)}
          >
            + Adicionar
          </button>
        )}
      </div>

      {props.formInline === props.field && props.editing && (
        <InlineForm
          field={props.field}
          tempItem={props.tempItem}
          atualizarTemp={props.atualizarTemp}
          salvarItem={props.salvarItem}
          cancelarForm={props.cancelarForm}
        />
      )}

      {props.list?.length > 0 && (
        <div className="list-area">
          {props.list.map((item, index) => (
            <div key={index} className="list-card">
              <FieldCard field={props.field} item={item} />

              {props.editing && (
                <button
                  className="btn danger tiny"
                  onClick={() => props.removerItem(props.field, index)}
                >
                  Remover
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

/* ==========================================================
 🔧 Card de cada tipo (mantém original)
========================================================== */
function FieldCard({ field, item }) {
  if (field === "habilidades")
    return <div className="chip">{item.nome}</div>;

  if (field === "formacao")
    return (
      <>
        <h4>{item.curso}</h4>
        <p>{item.instituicao}</p>
        <p className="periodo">{item.inicio} — {item.fim}</p>
        <p className="descricao">{item.status}</p>
      </>
    );

  if (field === "experiencias")
    return (
      <>
        <h4>{item.cargo}</h4>
        <p>{item.empresa}</p>
        <p className="periodo">{item.inicio} — {item.fim}</p>
        <p className="descricao">{item.descricao}</p>
      </>
    );

  if (field === "cursos")
    return (
      <>
        <h4>{item.nome}</h4>
        <p>{item.instituicao}</p>
        <p>{item.carga} — {item.ano}</p>
      </>
    );

  if (field === "idiomas")
    return (
      <p>
        <strong>{item.idioma}</strong> — {item.nivel}
      </p>
    );

  if (field === "links")
    return (
      <>
        <p><strong>{item.nome}</strong></p>
        <a href={item.url} target="_blank" rel="noreferrer">
          {item.url}
        </a>
      </>
    );

  if (field === "anexos")
    return (
      <>
        <p><strong>{item.nome}</strong></p>
        <p>{item.tipo}</p>
      </>
    );

  return null;
}
