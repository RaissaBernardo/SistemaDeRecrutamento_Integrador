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
    const habs = dados.habilidades?.map((h) => h?.nome?.toLowerCase()) || [];
    const cursos = dados.cursos?.map((c) => c.nome?.toLowerCase()) || [];
    const idiomas = dados.idiomas?.map((i) => `${i.idioma} (${i.nivel})`) || [];

    if (
      exp.length + form.length + habs.length + cursos.length + idiomas.length ===
      0
    )
      return `${nome} ainda não forneceu informações suficientes para gerar um resumo automático. Adicione experiências, cursos ou habilidades para um resultado mais completo.`;

    const areaMap = {
      tecnologia:
        /(java|python|react|node|api|html|css|javascript|sql|arduino|sistemas|software|programa|devops|cloud)/i,
      dados:
        /(dados|estatística|analytics|machine learning|ia|inteligência artificial|big data|data|visualização)/i,
      engenharia:
        /(engenheir|automação|mecânic|elétric|industrial|produção|energia|robótica)/i,
      administrativo:
        /(gestão|administração|financeiro|planejamento|negócios|controle|processos)/i,
      marketing:
        /(design|ux|ui|mídia|criativ|publicid|social|storytelling|branding|campanha)/i,
      educacao:
        /(ensino|professor|pedagog|educa|instrutor|treinamento|didátic)/i,
      saúde:
        /(hospital|saúde|clínic|enfermagem|psicolog|fisioterap|nutricion)/i,
      direito:
        /(jurídic|advogad|direito|compliance|contrato|leis|normas)/i,
      vendas:
        /(vendas|negociação|comercial|prospecção|clientes|resultados)/i,
      logistica:
        /(logística|estoque|transporte|supply|distribuição|armazenamento)/i,
      ciberseguranca: /(segurança|cyber|firewall|criptografia|owasp)/i,
      recursos_humanos:
        /(rh|recrutamento|seleção|treinamento|desenvolvimento humano)/i,
      arquitetura: /(arquitetura|urbanismo|autocad|revit|obra)/i,
      contabilidade: /(contábil|imposto|balanço|finanças|tributário)/i,
      audiovisual:
        /(vídeo|edição|filmagem|motion|gravação|fotografia|cinema)/i,
      gastronomia: /(culinária|cozinha|gastronomia|chef|alimentos)/i,
      construção: /(obra|construção|civil|pedreiro|engenharia civil)/i,
      redes: /(rede|roteador|cisco|infraestrutura|servidor|switch)/i,
      atendimento: /(atendimento|cliente|suporte|call center|relacionamento)/i,
      geral: /.*/,
    };

    const termos = [
      ...habs,
      ...cursos,
      ...form.map((f) => f.curso?.toLowerCase() || ""),
      ...exp.map((e) => `${e.cargo} ${e.empresa}`.toLowerCase() || ""),
    ];

    const pontuacoes = Object.fromEntries(
      Object.entries(areaMap).map(([area, regex]) => [
        area,
        termos.filter((t) => regex.test(t)).length,
      ])
    );

    const areaDominante =
      Object.entries(pontuacoes).sort((a, b) => b[1] - a[1])[0][0] || "geral";

    const frases = {
      tecnologia: [
        "atua com desenvolvimento e inovação digital, sempre buscando aprimorar suas habilidades técnicas.",
        "tem paixão por resolver problemas através da tecnologia e criar soluções práticas.",
        "demonstra facilidade em aprender novas linguagens e frameworks modernos.",
      ],
      dados: [
        "atua na coleta e análise de dados para apoiar decisões estratégicas.",
        "transforma informações em insights que contribuem para o crescimento das empresas.",
        "tem perfil analítico e domínio de ferramentas de análise e visualização.",
      ],
      engenharia: [
        "atua na engenharia aplicada, com foco em eficiência e precisão técnica.",
        "demonstra raciocínio lógico e habilidade para otimizar processos.",
        "integra inovação e segurança em ambientes industriais e produtivos.",
      ],
      administrativo: [
        "atua com gestão e organização de processos internos.",
        "demonstra responsabilidade e boa comunicação em ambientes corporativos.",
        "integra planejamento e execução para melhorar resultados.",
      ],
      marketing: [
        "atua com comunicação e design estratégico, unindo criatividade e propósito.",
        "possui olhar voltado para o público e domínio de mídias sociais.",
        "cria campanhas que conectam pessoas e marcas de forma autêntica.",
      ],
      educacao: [
        "atua na formação de pessoas, com empatia e clareza na comunicação.",
        "preza pela disseminação de conhecimento e desenvolvimento humano.",
        "demonstra compromisso com o ensino de qualidade.",
      ],
      saúde: [
        "atua com empatia e ética no cuidado com as pessoas.",
        "demonstra dedicação ao bem-estar e à qualidade de vida.",
        "possui habilidades humanas essenciais no atendimento e suporte.",
      ],
      direito: [
        "atua com integridade e responsabilidade em contextos jurídicos.",
        "demonstra raciocínio lógico e atenção a detalhes legais.",
        "valoriza a justiça e o cumprimento das normas e leis.",
      ],
      vendas: [
        "atua com foco em resultados e relacionamento com clientes.",
        "tem perfil comunicativo e capacidade de negociação.",
        "busca superar metas e criar experiências positivas para o cliente.",
      ],
      logistica: [
        "atua na gestão de estoques e otimização de processos logísticos.",
        "demonstra perfil analítico e habilidade com fluxos de distribuição.",
        "busca eficiência e controle em operações de transporte e armazenamento.",
      ],
      ciberseguranca: [
        "atua na proteção de dados e segurança digital.",
        "tem compromisso com a privacidade e integridade das informações.",
        "busca constantemente se atualizar sobre ameaças e boas práticas.",
      ],
      recursos_humanos: [
        "atua com foco em pessoas e desenvolvimento organizacional.",
        "valoriza a empatia, escuta ativa e liderança colaborativa.",
        "busca aprimorar o ambiente de trabalho por meio de práticas humanas.",
      ],
      arquitetura: [
        "atua com planejamento de espaços e design funcional.",
        "demonstra senso estético e atenção a detalhes técnicos.",
        "integra criatividade e sustentabilidade em seus projetos.",
      ],
      contabilidade: [
        "atua com responsabilidade em rotinas contábeis e financeiras.",
        "demonstra precisão e comprometimento na gestão de números.",
        "valoriza a transparência e a ética nos processos econômicos.",
      ],
      audiovisual: [
        "atua na produção e edição de conteúdo visual e sonoro.",
        "possui sensibilidade artística e domínio de ferramentas criativas.",
        "busca contar histórias com estética e impacto emocional.",
      ],
      gastronomia: [
        "atua na criação e preparo de pratos com técnica e paixão.",
        "possui atenção aos detalhes e senso de sabor refinado.",
        "valoriza qualidade, higiene e experiência gastronômica.",
      ],
      construção: [
        "atua em obras e projetos estruturais com foco em segurança e precisão.",
        "possui domínio de técnicas construtivas e trabalho em equipe.",
        "busca soluções eficientes para execução e acabamento.",
      ],
      redes: [
        "atua com infraestrutura e manutenção de redes corporativas.",
        "demonstra domínio em conectividade, roteadores e segurança de rede.",
        "busca estabilidade e desempenho em ambientes de TI.",
      ],
      atendimento: [
        "atua com excelência no atendimento ao público e suporte técnico.",
        "demonstra paciência, empatia e comunicação clara.",
        "busca oferecer soluções rápidas e eficazes ao cliente.",
      ],
      geral: [
        "atua de forma versátil, com facilidade de adaptação e aprendizado.",
        "possui espírito colaborativo e foco em crescimento contínuo.",
        "busca novos desafios para evoluir pessoal e profissionalmente.",
      ],
    };

    const habilidadesTxt =
      habs.length > 0
        ? `Possui habilidades em ${habs.slice(0, 5).join(", ")}.`
        : "";
    const idiomasTxt =
      idiomas.length > 0
        ? `Comunica-se em ${idiomas.join(", ")}.`
        : "";
    const expTxt =
      exp.length > 0
        ? `Já atuou em cargos como ${exp
            .map((e) => e.cargo || e.empresa)
            .slice(0, 3)
            .join(", ")}.`
        : "";
    const formTxt =
      form.length > 0
        ? `Formado em ${form.map((f) => f.curso).join(", ")}${
            form[0].instituicao ? ` pela ${form[0].instituicao}` : ""
          }.`
        : "";

    const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
    const intro = `${nome} ${pick(frases[areaDominante] || frases.geral)}`;
    const encerra = pick([
      "Está comprometido com o aprendizado contínuo e o desenvolvimento profissional.",
      "Busca aplicar seus conhecimentos em projetos colaborativos e desafiadores.",
      "Deseja contribuir para resultados sólidos e sustentáveis em sua área.",
      "Acredita que trabalho em equipe e inovação são pilares do sucesso.",
      "Tem como meta unir propósito, técnica e evolução em cada experiência.",
    ]);

    return `${intro} ${formTxt} ${expTxt} ${habilidadesTxt} ${idiomasTxt} ${encerra}`
      .replace(/\s+/g, " ")
      .trim();
  } catch (err) {
    console.error(err);
    return "⚠️ Ocorreu um erro ao gerar o resumo. Revise suas informações e tente novamente.";
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
