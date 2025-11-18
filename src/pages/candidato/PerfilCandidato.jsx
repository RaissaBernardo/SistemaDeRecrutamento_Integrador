import React, { useEffect, useState } from "react";
import SidebarCandidato from "../../components/SidebarCandidato";

// 🔄 mockApi MODELO 1 (banco único)
import { api } from "../../services/mockApi";

// 🔐 login continua vindo do storageService
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

    const naoTemNada =
      exp.length + form.length + habs.length + cursos.length + idiomas.length === 0;

    if (naoTemNada) {
      return `${nome} ainda não forneceu informações suficientes para gerar um resumo automático.`;
    }

    /* ==========================================================
       20 ÁREAS — classificação
    =========================================================== */
    const areaMap = {
      tecnologia: /(java|python|react|node|html|css|javascript|sql|api|spring|devops|cloud|docker)/i,
      dados: /(data|dados|estatística|analytics|machine learning|ia|etl|big data)/i,
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

    const areaDominante =
      Object.entries(pontuacoes).sort((a, b) => b[1] - a[1])[0][0];

    /* ==========================================================
       descrição final
    =========================================================== */
    const descricoes = {
      tecnologia: [
        "atua com desenvolvimento de sistemas modernos e escaláveis.",
        "possui domínio em fundamentos de programação e arquitetura de software.",
        "busca sempre criar soluções eficientes e seguras."
      ],
      dados: [
        "atua com análise, modelagem e interpretação de dados.",
        "possui forte raciocínio analítico e visão estratégica.",
        "transforma grandes volumes de dados em insights valiosos."
      ],
      ciberseguranca: [
        "atua com defesa de sistemas e ambientes digitais.",
        "realiza análise de vulnerabilidades e mitiga riscos.",
        "protege informações contra ataques e incidentes."
      ],
      redes: [
        "atua na configuração e manutenção de redes.",
        "possui experiência com protocolos e infraestrutura.",
        "garante estabilidade e performance nos ambientes conectados."
      ],
      engenharia: [
        "atua com soluções estruturais e técnicas.",
        "analisa processos e garante eficiência.",
        "desenvolve projetos com precisão e qualidade."
      ],
      logistica: [
        "atua na gestão de estoques e suprimentos.",
        "otimiza fluxos e reduz custos operacionais.",
        "garante eficiência no transporte e armazenagem."
      ],
      administrativo: [
        "atua no suporte à gestão e rotinas internas.",
        "organiza processos e relatórios.",
        "contribui para a eficiência administrativa."
      ],
      marketing: [
        "atua com estratégias de marca e comunicação.",
        "cria campanhas e conteúdos atrativos.",
        "entende comportamentos e tendências do consumidor."
      ],
      vendas: [
        "atua com relacionamento com o cliente.",
        "possui forte habilidade de negociação.",
        "garante resultados e fechamento de oportunidades."
      ],
      atendimento: [
        "atua oferecendo suporte e orientação.",
        "possui empatia e comunicação clara.",
        "garante boa experiência ao cliente."
      ],
      saúde: [
        "atua no cuidado e assistência a pacientes.",
        "possui responsabilidade e atenção técnica.",
        "age com empatia e profissionalismo."
      ],
      educacao: [
        "atua no ensino e orientação.",
        "possui didática e comunicação eficiente.",
        "promove aprendizado contínuo."
      ],
      direito: [
        "atua com análise legal e contratos.",
        "possui precisão jurídica e interpretação normativa.",
        "garante conformidade e segurança legal."
      ],
      recursos_humanos: [
        "atua com seleção, treinamento e desenvolvimento.",
        "possui olhar atento para talentos.",
        "contribui para cultura e clima organizacional."
      ],
      arquitetura: [
        "atua criando ambientes funcionais e estéticos.",
        "domina softwares e normas técnicas.",
        "desenvolve projetos modernos e eficientes."
      ],
      contabilidade: [
        "atua com finanças e escrituração.",
        "possui precisão analítica.",
        "garante conformidade fiscal e contábil."
      ],
      gastronomia: [
        "atua com preparo de alimentos e técnicas culinárias.",
        "possui organização e criatividade.",
        "preza por sabor e apresentação."
      ],
      construção: [
        "atua na execução e supervisão de obras.",
        "domina processos construtivos.",
        "entrega resultados com segurança e qualidade."
      ],
      audiovisual: [
        "atua com edição e produção de conteúdo.",
        "domina narrativa visual.",
        "transforma ideias em projetos impactantes."
      ],
      geral: [
        "atua com versatilidade e responsabilidade.",
        "possui aprendizado rápido.",
        "tem foco em crescimento e evolução."
      ]
    };

    const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

    return `
${nome} ${pick(descricoes[areaDominante])}
Possui histórico relevante e habilidades importantes.
${pick([
      "Busca novos desafios.",
      "Tem foco em crescimento.",
      "É dedicado e comprometido."
    ])}
    `.replace(/\s+/g, " ").trim();

  } catch {
    return "⚠️ Não foi possível gerar o resumo automaticamente.";
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

    // ✔ PERFIL AGORA VEM DA MOCKAPI
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

      // já cria o perfil no banco mockado
      api.saveProfile(logged.email, base);
    }
  }, []);

  /* INPUTS */
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
    api.saveProfile(logged.email, draft); // ✔ AGORA SALVA NO MOCKAPI
    setProfile(draft);
    setEditing(false);
  }

  function gerarResumo() {
    setLoadingIA(true);
    setTimeout(() => {
      const texto = minerarResumoIA(draft);
      setDraft((p) => ({ ...p, resumo: texto }));
      setLoadingIA(false);
    }, 3000);
  }

  /* ======================= SECTION COMPONENT ======================= */
  function Section({ title, field, list, children }) {
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

        {/* FORMULÁRIO INLINE */}
        {formInline === field && editing && (
          <div className="inline-form">

            {field === "formacao" && (
              <>
                <input name="curso" placeholder="Curso" onChange={atualizarTemp} />
                <input name="instituicao" placeholder="Instituição" onChange={atualizarTemp} />
                <label>Início</label>
                <input type="month" name="inicio" onChange={atualizarTemp} />
                <label>Fim</label>
                <input type="month" name="fim" onChange={atualizarTemp} />
                <input name="status" placeholder="Status" onChange={atualizarTemp} />
              </>
            )}

            {field === "experiencias" && (
              <>
                <input name="cargo" placeholder="Cargo" onChange={atualizarTemp} />
                <input name="empresa" placeholder="Empresa" onChange={atualizarTemp} />
                <label>Início</label>
                <input type="month" name="inicio" onChange={atualizarTemp} />
                <label>Fim</label>
                <input type="month" name="fim" onChange={atualizarTemp} />
                <textarea name="descricao" placeholder="Descrição" onChange={atualizarTemp} />
              </>
            )}

            {field === "cursos" && (
              <>
                <input name="nome" placeholder="Nome do curso" onChange={atualizarTemp} />
                <input name="instituicao" placeholder="Instituição" onChange={atualizarTemp} />
                <input name="carga" placeholder="Carga horária" onChange={atualizarTemp} />
                <input name="ano" placeholder="Ano" onChange={atualizarTemp} />
              </>
            )}

            {field === "idiomas" && (
              <>
                <input name="idioma" placeholder="Idioma" onChange={atualizarTemp} />
                <input name="nivel" placeholder="Nível" onChange={atualizarTemp} />
              </>
            )}

            {field === "links" && (
              <>
                <input name="nome" placeholder="Nome" onChange={atualizarTemp} />
                <input name="url" placeholder="URL" onChange={atualizarTemp} />
              </>
            )}

            {field === "anexos" && (
              <>
                <input name="nome" placeholder="Nome do arquivo" onChange={atualizarTemp} />
                <input name="tipo" placeholder="Tipo" onChange={atualizarTemp} />
              </>
            )}

            {field === "habilidades" && (
              <>
                <input
                  name="nome"
                  placeholder="Habilidade (ex: Java, Comunicação...)"
                  onChange={atualizarTemp}
                />
              </>
            )}

            <div className="form-buttons">
              <button className="btn ghost" onClick={cancelarForm}>Cancelar</button>
              <button className="btn primary" onClick={() => salvarItem(field)}>Adicionar</button>
            </div>
          </div>
        )}

        {/* LISTAGEM */}
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
                      <p className="periodo">{item.inicio} — {item.fim}</p>
                      <p className="descricao">{item.status}</p>
                    </>
                  )}

                  {field === "experiencias" && (
                    <>
                      <h4>{item.cargo}</h4>
                      <p>{item.empresa}</p>
                      <p className="periodo">{item.inicio} — {item.fim}</p>
                      <p className="descricao">{item.descricao}</p>
                    </>
                  )}

                  {field === "cursos" && (
                    <>
                      <h4>{item.nome}</h4>
                      <p>{item.instituicao}</p>
                      <p>{item.carga} — {item.ano}</p>
                    </>
                  )}

                  {field === "idiomas" && (
                    <p><strong>{item.idioma}</strong> — {item.nivel}</p>
                  )}

                  {field === "links" && (
                    <>
                      <p><strong>{item.nome}</strong></p>
                      <a href={item.url} target="_blank" rel="noreferrer">{item.url}</a>
                    </>
                  )}

                  {field === "anexos" && (
                    <>
                      <p><strong>{item.nome}</strong></p>
                      <p>{item.tipo}</p>
                    </>
                  )}

                  {editing && (
                    <button className="btn danger tiny" onClick={() => removerItem(field, i)}>
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
  }

  /* ==========================================
     RENDER DO PERFIL
  ========================================== */
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
              <button className="btn ghost" onClick={() => { setDraft(profile); setEditing(false); }}>
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
                  <input name={f} value={draft[f] || ""} onChange={handleChange} />
                ) : (
                  <p className="readonly">{profile[f] || "Não informado"}</p>
                )}
              </div>
            ))}
          </div>
        </Section>

        {/* RESUMO PROFISSIONAL */}
        <section className="perfil-card">
          <div className="section-header resumo-header">
            <h3>Resumo Profissional</h3>

            {editing && (
              <button
                className={`btn ai-btn ${loadingIA ? "loading" : ""}`}
                disabled={loadingIA}
                onClick={gerarResumo}
              >
                {loadingIA ? <span className="spinner-purple"></span> : "⚡ Gerar com IA"}
              </button>
            )}
          </div>

          {editing ? (
            <textarea
              name="resumo"
              value={draft.resumo || ""}
              onChange={handleChange}
              placeholder="Escreva ou gere automaticamente um resumo profissional..."
            />
          ) : (
            <p className="readonly">
              {profile.resumo || "Ainda não há resumo profissional cadastrado."}
            </p>
          )}
        </section>

        {/* SEÇÕES PROFISSIONAIS */}
        <Section title="Formação" field="formacao" list={draft.formacao} />
        <Section title="Experiências" field="experiencias" list={draft.experiencias} />
        <Section title="Cursos e Certificações" field="cursos" list={draft.cursos} />
        <Section title="Idiomas" field="idiomas" list={draft.idiomas} />
        <Section title="Habilidades" field="habilidades" list={draft.habilidades} />
        <Section title="Links" field="links" list={draft.links} />
        <Section title="Anexos" field="anexos" list={draft.anexos} />

      </main>
    </div>
  );
}
