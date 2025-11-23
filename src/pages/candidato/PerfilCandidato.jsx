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
      // Removido "geral" daqui para evitar sobrepontuação
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

    // Encontra a área com pontuação máxima; fallback para "geral" se max === 0
    const maxPontuacao = Math.max(...Object.values(pontuacoes));
    let areaDominante = "geral";
    if (maxPontuacao > 0) {
      areaDominante = Object.entries(pontuacoes)
        .filter(([_, score]) => score === maxPontuacao)
        [0][0]; // Pega a primeira em caso de empate
    }

    // Frases definidas (exemplos naturais e profissionais para cada área)
    const frases = {
      tecnologia: [
        "é um profissional de tecnologia dedicado a soluções inovadoras e eficientes.",
        "destaca-se no desenvolvimento de software com foco em performance e escalabilidade.",
        "apaixonado por programação, busca integrar tecnologias emergentes em projetos reais.",
        "com expertise em codificação, visa otimizar processos digitais.",
        "é entusiasta de TI, priorizando código limpo e colaboração ágil."
      ],
      dados: [
        "é especialista em análise de dados, transformando informações em insights acionáveis.",
        "focado em ciência de dados, utiliza ferramentas avançadas para prever tendências.",
        "com habilidades em big data, busca extrair valor de conjuntos complexos.",
        "profissional de analytics, enfatiza decisões baseadas em evidências.",
        "entusiasta de IA, aplica machine learning para resolver problemas reais."
      ],
      engenharia: [
        "é engenheiro comprometido com projetos inovadores e sustentáveis.",
        "especializado em automação, otimiza processos industriais.",
        "com background em mecânica, desenvolve soluções técnicas eficientes.",
        "focado em produção, integra tecnologia e eficiência.",
        "profissional de energia, prioriza fontes renováveis e inovação."
      ],
      administrativo: [
        "é gestor administrativo com visão estratégica para negócios.",
        "especializado em planejamento, otimiza recursos e processos.",
        "com expertise financeira, garante controle e crescimento sustentável.",
        "focado em administração, promove eficiência operacional.",
        "profissional de negócios, valoriza liderança e resultados."
      ],
      marketing: [
        "é criativo em marketing, criando campanhas impactantes e envolventes.",
        "especializado em design digital, melhora experiências de usuário.",
        "com habilidades em mídias sociais, constrói marcas fortes.",
        "focado em branding, utiliza storytelling para conectar audiências.",
        "profissional de publicidade, prioriza inovação e métricas."
      ],
      educacao: [
        "é educador dedicado ao desenvolvimento de habilidades e conhecimentos.",
        "especializado em pedagogia, cria ambientes de aprendizado dinâmicos.",
        "com expertise em treinamento, capacita equipes para o sucesso.",
        "focado em ensino, promove inclusão e inovação didática.",
        "profissional de educação, valoriza o impacto transformador."
      ],
      saúde: [
        "é profissional de saúde comprometido com o bem-estar e cuidados de qualidade.",
        "especializado em enfermagem, prioriza atendimento humanizado.",
        "com habilidades em psicologia, apoia saúde mental e emocional.",
        "focado em nutrição, promove hábitos saudáveis e preventivos.",
        "profissional clínico, integra tecnologia e empatia."
      ],
      direito: [
        "é jurista com foco em compliance e soluções legais éticas.",
        "especializado em direito, gerencia contratos e normas com precisão.",
        "com expertise advocatícia, defende interesses com integridade.",
        "focado em leis, promove justiça e conformidade.",
        "profissional jurídico, valoriza análise crítica e estratégia."
      ],
      vendas: [
        "é vendedor dinâmico, expert em negociação e fechamento de deals.",
        "especializado em prospecção, constrói relacionamentos duradouros.",
        "com habilidades comerciais, impulsiona resultados e crescimento.",
        "focado em clientes, prioriza soluções personalizadas.",
        "profissional de vendas, combina persuasão e ética."
      ],
      logistica: [
        "é especialista em logística, otimizando cadeias de suprimentos eficientes.",
        "especializado em transporte, garante entregas pontuais e seguras.",
        "com expertise em estoque, minimiza custos e maximiza disponibilidade.",
        "focado em distribuição, integra tecnologia para fluidez.",
        "profissional de supply chain, valoriza sustentabilidade."
      ],
      ciberseguranca: [
        "é expert em cibersegurança, protegendo sistemas contra ameaças.",
        "especializado em criptografia, implementa defesas robustas.",
        "com habilidades em firewall, monitora e responde a incidentes.",
        "focado em OWASP, promove práticas seguras de desenvolvimento.",
        "profissional de cyber, prioriza prevenção e resiliência."
      ],
      recursos_humanos: [
        "é profissional de RH, focado em recrutamento e desenvolvimento de talentos.",
        "especializado em seleção, constrói equipes de alto desempenho.",
        "com expertise em treinamento, promove crescimento organizacional.",
        "focado em desenvolvimento humano, valoriza diversidade e inclusão.",
        "profissional de pessoas, integra estratégia e bem-estar."
      ],
      arquitetura: [
        "é arquiteto criativo, projetando espaços funcionais e estéticos.",
        "especializado em urbanismo, planeja ambientes sustentáveis.",
        "com habilidades em AutoCAD, transforma ideias em realidade.",
        "focado em obras, gerencia projetos com precisão.",
        "profissional de design espacial, prioriza inovação."
      ],
      contabilidade: [
        "é contador preciso, gerenciando finanças e impostos com expertise.",
        "especializado em balanços, garante conformidade tributária.",
        "com habilidades financeiras, analisa dados para decisões estratégicas.",
        "focado em contabilidade, otimiza recursos empresariais.",
        "profissional fiscal, valoriza transparência e eficiência."
      ],
      audiovisual: [
        "é criador audiovisual, expert em edição e produção de conteúdo.",
        "especializado em filmagem, captura momentos com criatividade.",
        "com habilidades em motion graphics, eleva narrativas visuais.",
        "focado em fotografia, combina técnica e arte.",
        "profissional de cinema, prioriza storytelling impactante."
      ],
      gastronomia: [
        "é chef apaixonado por culinária, criando pratos inovadores e saborosos.",
        "especializado em gastronomia, gerencia cozinhas com eficiência.",
        "com habilidades em alimentos, promove sustentabilidade e saúde.",
        "focado em técnicas culinárias, experimenta sabores únicos.",
        "profissional de cozinha, valoriza tradição e criatividade."
      ],
      construção: [
        "é profissional de construção, gerenciando obras com segurança e qualidade.",
        "especializado em engenharia civil, constrói infraestruturas duráveis.",
        "com expertise em pedreiria, executa projetos precisos.",
        "focado em civil, integra planejamento e execução.",
        "profissional de obras, prioriza sustentabilidade."
      ],
      redes: [
        "é especialista em redes, configurando infraestruturas robustas.",
        "especializado em Cisco, otimiza conectividade e performance.",
        "com habilidades em servidores, garante disponibilidade contínua.",
        "focado em switches, resolve problemas de rede eficientemente.",
        "profissional de TI, valoriza segurança e escalabilidade."
      ],
      atendimento: [
        "é expert em atendimento ao cliente, resolvendo questões com empatia.",
        "especializado em suporte, constrói relacionamentos positivos.",
        "com habilidades em call center, gerencia interações eficientes.",
        "focado em relacionamento, prioriza satisfação do cliente.",
        "profissional de serviço, combina rapidez e qualidade."
      ],
      geral: [
        "é um profissional versátil, adaptável a diversos desafios.",
        "com habilidades multidisciplinares, contribui para equipes dinâmicas.",
        "focado em crescimento, busca oportunidades de impacto.",
        "profissional generalista, valoriza aprendizado e colaboração.",
        "entusiasta de carreira, integra conhecimento e prática."
      ]
    };

    const pick = arr => arr[Math.floor(Math.random() * arr.length)];

    // Melhorias em textos: limitar listas, adicionar "e" no join, fallback para múltiplos
    const habilidadesTxt =
      habs.length ? `Possui habilidades em ${habs.slice(0, 5).join(", ").replace(/, ([^,]*)$/, " e $1")}.` : "";
    const idiomasTxt =
      idiomas.length ? `Comunica-se em ${idiomas.join(", ").replace(/, ([^,]*)$/, " e $1")}.` : "";
    const expTxt =
      exp.length
        ? `Já atuou em cargos como ${exp
            .slice(0, 3)
            .map(e => e.cargo || e.empresa)
            .join(", ")
            .replace(/, ([^,]*)$/, " e $1")}.`
        : "";
    const formTxt =
      form.length
        ? `Formado em ${form.slice(0, 2).map(f => f.curso).join(" e ")}${
            form[0]?.instituicao ? ` em instituições como ${form[0].instituicao}` : ""
          }.`
        : ""; // Limitado a 2 cursos, genérico para instituições

    const intro = `${nome} ${pick(frases[areaDominante])}`;
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
  } catch (error) {
    console.error("Erro na geração de resumo:", error); // Log para debug
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
