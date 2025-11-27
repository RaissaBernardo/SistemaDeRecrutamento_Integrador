import React, { useEffect, useState } from "react";
import SidebarCandidato from "../../components/SidebarCandidato";
import InlineForm from "./InlineForm";

import { api } from "../../services/mockApi";
import { getLoggedUser } from "../../services/storageService";

import "../../styles/candidato/PerfilCandidato.css";


function minerarResumoIA(dados) {
  try {
    const nome = dados.nome?.split(" ")[0] || "O candidato";
    const exp = dados.experiencias || [];
    const form = dados.formacao || [];
    const habs = dados.habilidades?.map(h => h?.nome?.toLowerCase()) || [];
    const cursos = dados.cursos?.map(c => c.nome?.toLowerCase()) || [];
    const idiomas = dados.idiomas?.map(i => `${i.idioma} (${i.nivel})`) || [];

    if (exp.length + form.length + habs.length + cursos.length + idiomas.length === 0)
      return `${nome} ainda não forneceu informações suficientes para gerar um resumo automático. Adicione experiências, cursos ou habilidades para um resultado mais completo.`;

    const areaMap = {
      tecnologia: /(java|python|react|node|api|html|css|javascript|sql|arduino|sistemas|software|programa|devops|cloud|docker|kubernetes|typescript|angular|vue)/i,
      dados: /(dados|estatística|analytics|machine learning|ia|inteligência artificial|big data|data|visualização|python|r|powerbi|excel|sql)/i,
      engenharia: /(engenheir|automação|mecânic|elétric|industrial|produção|energia|robótica|civil|materiais|projeto|CAD|CAD 3D)/i,
      administrativo: /(gestão|administração|financeiro|planejamento|negócios|controle|processos|orçamento|relatórios|logística interna|compliance)/i,
      marketing: /(design|ux|ui|mídia|criativ|publicid|social|storytelling|branding|campanha|seo|ads|content|influencer|email marketing)/i,
      educacao: /(ensino|professor|pedagog|educa|instrutor|treinamento|didátic|alfabetização|tutoria|capacitação|mentoria)/i,
      saúde: /(hospital|saúde|clínic|enfermagem|psicolog|fisioterap|nutricion|odontologia|farmácia|biomedicina|cardiologia)/i,
      direito: /(jurídic|advogad|direito|compliance|contrato|leis|normas|penal|civil|trabalhista|tributário)/i,
      vendas: /(vendas|negociação|comercial|prospecção|clientes|resultados|crm|pipeline|fechamento|apresentação|estratégia)/i,
      logistica: /(logística|estoque|transporte|supply|distribuição|armazenamento|rastreio|frete|planejamento logístico|estoque físico|inventário)/i,
      ciberseguranca: /(segurança|cyber|firewall|criptografia|owasp|vpn|antivirus|hacker|penetration|malware|monitoramento)/i,
      recursos_humanos: /(rh|recrutamento|seleção|treinamento|desenvolvimento humano|benefícios|remuneração|avaliação|talento|coaching|liderança)/i,
      arquitetura: /(arquitetura|urbanismo|autocad|revit|obra|paisagismo|design de interiores|planta baixa|projeto arquitetônico|modelagem 3D|renderização)/i,
      contabilidade: /(contábil|imposto|balanço|finanças|tributário|auditoria|planejamento fiscal|custos|conciliação|demonstração|orçamento)/i,
      audiovisual: /(vídeo|edição|filmagem|motion|gravação|fotografia|cinema|animação|som|mixagem|direção)/i,
      gastronomia: /(culinária|cozinha|gastronomia|chef|alimentos|receitas|cardápio|cozinha internacional|panificação|coquetelaria|food styling)/i,
      construção: /(obra|construção|civil|pedreiro|engenharia civil|estrutura|projeto estrutural|materiais|alvenaria|planejamento|reformas)/i,
      redes: /(rede|roteador|cisco|infraestrutura|servidor|switch|LAN|WAN|firewall|VPN|conectividade)/i,
      atendimento: /(atendimento|cliente|suporte|call center|relacionamento|chat|helpdesk|resolução|feedback|ticket|CRM)/i,
      biotecnologia: /(biotecnologia|genética|biologia molecular|bioinformática|enzimas|clonagem|PCR|bioprocessos|bioquímica|microbiologia)/i,
      energias_renovaveis: /(solar|eólica|fotovoltaica|painel|turbina|biomassa|sustentável|energia limpa|geotérmica|hidráulica)/i,
      game_dev: /(game|unity|unreal|desenvolvimento de jogos|sprites|c\#|c\+\+|programação gráfica|level design|gameplay)/i,
      psicologia: /(psicologia|terapia|cognitivo|comportamental|neuropsicologia|avaliação psicológica|psiquiatria|aconselhamento|psicoterapia|psicodiagnóstico)/i,
      design_produto: /(design de produto|prototipagem|3D|CAD|ergonomia|materiais|industrial|modelagem|conceito|renderização)/i,
      logística_internacional: /(importação|exportação|aduana|frete internacional|comércio exterior|despacho|incoterms|armazém|trâmites|logística global)/i,
      e_commerce: /(e-commerce|loja online|marketplace|woocommerce|shopify|SEO|campanhas digitais|checkout|UX|pagamentos)/i,
      biomedicina: /(biomedicina|análises clínicas|exames|diagnóstico|pesquisa biomédica|citologia|hematologia|imunologia|microbiologia|genética molecular)/i,
      fintech: /(fintech|pagamentos|blockchain|criptomoeda|open banking|app financeiro|investimentos|crowdfunding|API bancária|regtech)/i,
      robótica: /(robótica|automação|drones|mecatrônica|IA|sensores|controladores|arduino|prototipagem|robôs)/i
    };


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

      biotecnologia: [
        "é especialista em biotecnologia, aplicando inovação em pesquisas biológicas.",
        "com habilidades em genética e bioinformática, contribui para avanços científicos.",
        "focado em bioquímica, transforma conhecimento em soluções laboratoriais.",
        "profissional de biotecnologia, integra tecnologia e ciência aplicada.",
        "experiente em processos biológicos, prioriza precisão e ética na pesquisa."
      ],
      energias_renovaveis: [
        "é engenheiro em energias renováveis, projetando soluções sustentáveis.",
        "especializado em solar e eólica, busca eficiência energética em projetos.",
        "com foco em energia limpa, integra inovação e sustentabilidade.",
        "profissional de energias renováveis, prioriza impacto ambiental positivo.",
        "dedicado a sistemas sustentáveis, otimizando fontes de energia renováveis."
      ],
      game_dev: [
        "é desenvolvedor de games, criando experiências interativas envolventes.",
        "especializado em Unity e Unreal, transforma ideias em jogos funcionais.",
        "com habilidades em design de gameplay, aprimora experiências de usuário.",
        "profissional de game dev, integra arte, tecnologia e diversão.",
        "apaixonado por programação gráfica, entrega jogos criativos e otimizados."
      ],
      psicologia: [
        "é psicólogo dedicado, promovendo bem-estar e desenvolvimento emocional.",
        "especializado em terapia cognitivo-comportamental, auxilia mudanças positivas.",
        "com foco em avaliação psicológica, interpreta comportamentos de forma ética.",
        "profissional de psicologia, prioriza empatia e escuta ativa.",
        "experiente em psicoterapia, integra ciência e cuidado humanizado."
      ],
      design_produto: [
        "é designer de produto, criando soluções funcionais e inovadoras.",
        "especializado em prototipagem e modelagem 3D, transforma ideias em realidade.",
        "com habilidades em ergonomia, prioriza conforto e usabilidade.",
        "profissional de design industrial, integra estética e funcionalidade.",
        "focado em inovação de produto, busca soluções eficientes e criativas."
      ],
      logística_internacional: [
        "é especialista em logística internacional, otimizando operações globais.",
        "com experiência em importação e exportação, garante eficiência no comércio exterior.",
        "focado em despacho aduaneiro, minimiza riscos e custos.",
        "profissional de supply chain global, integra processos e compliance.",
        "dedicado a transporte internacional, prioriza pontualidade e rastreabilidade."
      ],
      e_commerce: [
        "é especialista em e-commerce, criando experiências de compra intuitivas.",
        "com habilidades em marketplaces e SEO, aumenta conversões online.",
        "focado em UX e checkout, otimiza jornadas de clientes.",
        "profissional de comércio digital, integra marketing e tecnologia.",
        "dedicado a vendas online, melhora performance e satisfação do cliente."
      ],
      biomedicina: [
        "é biomédico, especializado em análises clínicas e diagnósticos precisos.",
        "com experiência em citologia e hematologia, contribui para pesquisas avançadas.",
        "focado em imunologia e microbiologia, aplica ciência para saúde.",
        "profissional de biomedicina, prioriza qualidade e segurança laboratorial.",
        "dedicado à genética molecular, integra tecnologia e conhecimento biomédico."
      ],
      fintech: [
        "é especialista em fintech, desenvolvendo soluções financeiras inovadoras.",
        "com habilidades em blockchain e pagamentos digitais, transforma serviços financeiros.",
        "focado em open banking, integra tecnologia e compliance bancário.",
        "profissional de fintech, otimiza processos financeiros e experiências do usuário.",
        "dedicado a investimentos digitais, prioriza segurança e inovação."
      ],
      robótica: [
        "é engenheiro de robótica, criando sistemas automatizados eficientes.",
        "com experiência em drones e automação, integra hardware e software.",
        "focado em mecatrônica, desenvolve soluções inteligentes e precisas.",
        "profissional de robótica, combina inovação, programação e engenharia.",
        "dedicado a controle de robôs, prioriza precisão e segurança operacional."
      ]
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

    const maxPontuacao = Math.max(...Object.values(pontuacoes));
    let areaDominante = Object.keys(pontuacoes).find(a => pontuacoes[a] === maxPontuacao);
    if (!areaDominante) areaDominante = "tecnologia";

    const fraseSugestao = frases[areaDominante][Math.floor(Math.random() * frases[areaDominante].length)];

    return `${nome} atua na área de ${areaDominante}. ${fraseSugestao}`;
  } catch (erro) {
    console.error("Erro ao gerar resumo IA:", erro);
    return "Não foi possível gerar o resumo automático.";
  }
}

/* ==========================================================
                 COMPONENTE PRINCIPAL — CORRIGIDO
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
      api.perfis.save(logged.email, base);
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
    api.perfis.save(logged.email, draft);
    setProfile(draft);
    setEditing(false);
  }

  function gerarResumo() {
    setLoadingIA(true);

    setTimeout(() => {
      const texto = minerarResumoIA(draft);
      setDraft((p) => ({ ...p, resumo: texto }));
      setLoadingIA(false);
    }, 1500);
  }

  /* ==========================================================
       LAYOUT CORRIGIDO (SEM DUPLICAÇÃO DE SIDEBAR)
  ========================================================== */
  return (
    <div className="app-candidato">
   

      <main className="main-content-candidato perfil-wrapper">

        {/* HEADER */}
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
        </section>

        {/* RESUMO */}
        <section className="perfil-card">
          <div className="section-header resumo-header">
            <h3>Resumo Profissional</h3>

            {editing && (
              <button
                className={`btn ai-btn ${loadingIA ? "loading" : ""}`}
                onClick={!loadingIA ? gerarResumo : undefined}
                style={loadingIA ? { pointerEvents: "none", opacity: 0.8 } : {}}
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
 InlineSection
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
 FieldCard
========================================================== */
function FieldCard({ field, item }) {
  if (field === "habilidades")
    return <div className="chip">{item.nome}</div>;

  if (field === "formacao")
    return (
      <>
        <h4>{item.curso}</h4>
        <p>{item.instituicao}</p>
        <p className="periodo">
          {item.inicio} — {item.fim}
        </p>
        <p className="descricao">{item.status}</p>
      </>
    );

  if (field === "experiencias")
    return (
      <>
        <h4>{item.cargo}</h4>
        <p>{item.empresa}</p>
        <p className="periodo">
          {item.inicio} — {item.fim}
        </p>
        <p className="descricao">{item.descricao}</p>
      </>
    );

  if (field === "cursos")
    return (
      <>
        <h4>{item.nome}</h4>
        <p>{item.instituicao}</p>
        <p>
          {item.carga} — {item.ano}
        </p>
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
        <p>
          <strong>{item.nome}</strong>
        </p>
        <a href={item.url} target="_blank" rel="noreferrer">
          {item.url}
        </a>
      </>
    );

  if (field === "anexos")
    return (
      <>
        <p>
          <strong>{item.nome}</strong>
        </p>
        <p>{item.tipo}</p>
      </>
    );

  return null;
}
