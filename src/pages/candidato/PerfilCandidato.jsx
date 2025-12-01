import React, { useEffect, useState } from "react";
import InlineForm from "./InlineForm";

import { api } from "../../services/mockApi";
import { getLoggedUser } from "../../services/storageService";

import "../../styles/candidato/PerfilCandidato.css";

/* ==========================================================
   🔧 ENGENHARIA DE ATRIBUTOS / "TREINAMENTO" DA IA
   - areaMap: regex por área
   - frases: saídas naturais por área
   ========================================================== */

const areaMap = {
  tecnologia:
    /(java|python|react|node|api|html|css|javascript|js\b|typescript|ts\b|sql|postgres|mysql|mongodb|firebase|arduino|sistemas|software|programação|developer|frontend|backend|fullstack|cloud|aws|azure|docker|kubernetes|devops|git|github|rest|restful|ci\/cd|json|linux|vue|angular|swift|kotlin|dart|flutter|microserviços|arquitetura de software|clean code)/i,

  dados:
    /(dados|data|data science|ciência de dados|estatística|analytics|machine learning|ml\b|deep learning|dl\b|ia|inteligência artificial|big data|etl|powerbi|excel|sql|python|pandas|numpy|scikit|tensorflow|keras|modelagem|previsão|clusterização|kmeans|regressão|classificação)/i,

  engenharia:
    /(engenheir|mecânic|elétric|civil|produção|industrial|materiais|energia|hidráulica|pneumática|robótica|cad|solidworks|projeto|manutenção|automação|processos industriais|lean|kaizen)/i,

  administrativo:
    /(administração|gestão|financeiro|planner|planejamento|orçamento|custos|relatórios|compras|dp|departamento pessoal|compliance|auditoria|pagamentos|contas|processos)/i,

  marketing:
    /(marketing|design|ux|ui|social media|criativ|branding|campanha|seo|ads|tráfego|conteúdo|copy|publicidade|vídeo|editor|identidade visual)/i,

  educacao:
    /(ensino|professor|pedagogia|metodologia|aula|educação|treinamento|instrução|aprendizagem|mediação|tutoria)/i,

  saúde:
    /(hospital|saúde|clínic|enfermagem|psicolog|nutricion|odontolog|fisioterap|terapia|cuidados|prontuário)/i,

  direito:
    /(direito|advogad|jurídic|contrato|legislação|leis|normas|processo|civil|penal|tributário|compliance jurídico)/i,

  vendas:
    /(vendas|comercial|negociação|prospecção|clientes|crm|pipeline|follow up|fechamento|meta|resultado|comissionamento)/i,

  logistica:
    /(logística|estoque|transporte|supply|armazenagem|distribuição|rastreio|frete|roteirização|depósito|inventário)/i,

  ciberseguranca:
    /(segurança|cyber|firewall|vpn|criptografia|hacker|owasp|pentest|malware|proteção|siem|forense)/i,

  recursos_humanos:
    /(rh|recrutamento|seleção|treinamento|desenvolvimento humano|entrevista|gestão de pessoas|líder|cargos e salários|onboarding)/i,

  arquitetura:
    /(arquitetura|urbanismo|autocad|revit|obra|paisagismo|maquete|render|3d|projeto arquitetônico)/i,

  contabilidade:
    /(contábil|imposto|irpf|balanço|tributário|auditoria|fiscal|nota fiscal|conciliação|financeiro)/i,

  audiovisual:
    /(vídeo|edição|filmagem|câmera|motion|after effects|premiere|roteiro|produção audiovisual|fotografia)/i,

  gastronomia:
    /(culinária|gastronomia|cozinha|chef|alimentos|preparo|receitas|cardápio|cozinheiro)/i,

  construção:
    /(obra|construção|pedreiro|mestre de obras|engenharia civil|alvenaria|estrutura|canteiro|reformas)/i,

  redes:
    /(rede|roteador|switch|servidor|infraestrutura|cisco|lan|wan|vpn|conectividade|cabos|tcp|ip)/i,

  atendimento:
    /(atendimento|suporte|cliente|call center|helpdesk|relacionamento|satisfação|ticket|chat)/i,

  biotecnologia:
    /(biotecnologia|genética|genômica|laboratório|pcr|enzimas|bioinformática|molecular|microbiologia)/i,

  energias_renovaveis:
    /(energia solar|energia eólica|fotovoltaica|painéis|turbinas|sustentabilidade|energia limpa)/i,

  game_dev:
    /(game|jogo|unity|unreal|gameplay|sprites|level design|dev de jogos|godot|c#|c\+\+)/i,

  psicologia:
    /(psicologia|terapia|cognitivo|emocional|comportamental|saúde mental|psicoterap)/i,

  design_produto:
    /(design de produto|3d|prototipagem|ergonomia|modelagem|industrial design|conceito)/i,

  logística_internacional:
    /(importação|exportação|aduana|frete internacional|incoterms|comex|desembaraço)/i,

  e_commerce:
    /(e-commerce|loja online|marketplace|shopify|woocommerce|checkout|carrinho|pagamentos)/i,

  biomedicina:
    /(biomedicina|análises clínicas|hematologia|citologia|diagnóstico|exames)/i,

  fintech:
    /(fintech|pix|open banking|pagamentos|criptomoeda|blockchain|carteira digital|transferências)/i,

  robótica:
    /(robótica|mecatrônica|autônomo|arduino|sensores|atuadores|drones|prototipagem)/i,

  // ⭐ Novas áreas
  pmo_gestao_projetos:
    /(projeto|pmo|scrum|kanban|gestão de projetos|pmi|cronograma|jira|planner|metodologias ágeis)/i,

  sustentabilidade_esg:
    /(esg|sustentabilidade|impacto ambiental|meio ambiente|responsabilidade social|carbono)/i,

  comunicacao_jornalismo:
    /(comunicação|redação|jornalismo|conteúdo|reportagem|texto|entrevista|apresentação)/i,

  esportes_educacao_fisica:
    /(esporte|atividade física|treinador|educação física|alongamento|treino|saúde esportiva)/i,

  hotelaria_turismo:
    /(hotel|recepção|turismo|viajar|hospedagem|hotelaria|reservas|atendimento ao hóspede)/i,

  // 🔁 Fallback geral
  geral:
    /(profissional|experiência|trabalho|responsável|organização|projetos|atividades|competências|colaboração|equipe|comunicação|processos|aprendizado|multidisciplinar)/i,
};

const frasesPorArea = {
  tecnologia: [
    "é um profissional de tecnologia dedicado a soluções inovadoras.",
    "destaca-se pela habilidade em desenvolver sistemas eficientes e escaláveis.",
    "atua com foco em performance, boas práticas e arquitetura moderna.",
    "tem forte capacidade de resolver problemas utilizando ferramentas tecnológicas.",
    "busca constante evolução no universo do desenvolvimento de software.",
  ],

  dados: [
    "é analista de dados com foco em transformar informações em insights acionáveis.",
    "atua com técnicas estatísticas e machine learning para modelagem preditiva.",
    "tem experiência com ferramentas de análise e visualização de dados.",
    "é voltado para decisões baseadas em evidências.",
    "possui pensamento lógico e habilidade analítica destacada.",
  ],

  engenharia: [
    "atua na engenharia com foco em soluções práticas e eficientes.",
    "participa de projetos técnicos com visão sistêmica e analítica.",
    "possui forte domínio de ferramentas e metodologias de engenharia.",
    "preza pela segurança, qualidade e planejamento eficiente.",
    "atua na otimização de processos industriais e técnicos.",
  ],

  administrativo: [
    "atua na área administrativa com foco em organização e eficiência.",
    "tem boa capacidade de planejamento e controle de processos.",
    "é profissional responsável e orientado a resultados.",
    "atua no suporte estratégico de operações e rotinas administrativas.",
    "possui visão integrada de negócios.",
  ],

  marketing: [
    "é um profissional criativo, com domínio em comunicação e estratégias digitais.",
    "atua na criação de campanhas que conectam marcas ao público.",
    "tem experiência em análise de métricas e otimização de conteúdo.",
    "preza pela estética e assertividade das mensagens.",
    "combina criatividade com foco em resultados.",
  ],

  educacao: [
    "atua na área educacional com dedicação e metodologia clara.",
    "tem facilidade para ensinar e facilitar aprendizagens.",
    "valoriza inclusão, didática e desenvolvimento humano.",
    "é comunicativo, paciente e organizado.",
    "contribui para ambientes de estudo produtivos.",
  ],

  saúde: [
    "atua na área da saúde com responsabilidade e empatia.",
    "preza pelo cuidado humano e atendimento ético.",
    "possui conhecimento técnico aplicado a rotinas clínicas.",
    "atua para promover qualidade de vida e bem-estar.",
    "coloca o paciente no centro da assistência.",
  ],

  direito: [
    "atua com foco em legislação, organização jurídica e análise crítica.",
    "tem perfil analítico e atento aos detalhes.",
    "preza pela ética, responsabilidade e conformidade legal.",
    "atua em atividades que requerem precisão e segurança jurídica.",
    "possui comunicação formal e objetiva.",
  ],

  vendas: [
    "atua com foco em negociação, persuasão e relacionamento com clientes.",
    "é orientado a resultados e metas.",
    "possui boa comunicação e capacidade de argumentação.",
    "atua fortalecendo vínculos comerciais.",
    "trabalha bem sob pressão e desafios.",
  ],

  logistica: [
    "atua na logística com foco em organização, fluxo e eficiência operacional.",
    "tem facilidade com processos de armazenagem e distribuição.",
    "preza pela precisão e agilidade.",
    "atua garantindo entregas e operações sem falhas.",
    "possui visão estratégica de cadeia de suprimentos.",
  ],

  ciberseguranca: [
    "atua com foco na proteção de sistemas e dados.",
    "tem forte conhecimento em análise de vulnerabilidades.",
    "preza pela segurança e integridade da informação.",
    "atua com boas práticas e ferramentas de defesa digital.",
    "possui perfil analítico e preventivo.",
  ],

  recursos_humanos: [
    "atua no desenvolvimento de pessoas e talentos.",
    "preza por processos humanizados e eficientes.",
    "possui boa comunicação e empatia.",
    "atua conectando profissionais às vagas ideais.",
    "tem foco em clima organizacional e desenvolvimento.",
  ],

  arquitetura: [
    "atua com criatividade e técnica na criação de ambientes e projetos.",
    "tem facilidade com softwares de modelagem e planejamento.",
    "preza pela estética, funcionalidade e sustentabilidade.",
    "atua conciliando conceito e prática.",
    "possui visão espacial e precisão de detalhes.",
  ],

  contabilidade: [
    "atua com foco em organização financeira e conformidade fiscal.",
    "é responsável, meticuloso e atento a números.",
    "preza pela precisão e transparência.",
    "atua garantindo controle e análises confiáveis.",
    "tem forte raciocínio lógico e cuidado técnico.",
  ],

  audiovisual: [
    "atua na criação e edição de conteúdo visual impactante.",
    "possui forte sensibilidade estética.",
    "tem domínio de ferramentas modernas de edição.",
    "atua com criatividade e dinamismo.",
    "transforma ideias em produções profissionais.",
  ],

  gastronomia: [
    "atua com criatividade e técnica no preparo de alimentos.",
    "preza pela organização e qualidade em cozinha.",
    "possui sensibilidade com sabores e apresentações.",
    "atua com responsabilidade e higiene.",
    "tem experiência com rotinas gastronômicas profissionais.",
  ],

  construção: [
    "atua em obras com foco em execução eficiente e segura.",
    "possui experiência prática e técnica.",
    "preza pela qualidade e prazos de entrega.",
    "atua com planejamento e organização.",
    "tem facilidade em trabalhos operacionais e técnicos.",
  ],

  redes: [
    "atua configurando e mantendo infraestruturas de rede.",
    "possui domínio de protocolos e conectividade.",
    "preza pela estabilidade e segurança da comunicação.",
    "atua resolvendo problemas técnicos de rede.",
    "tem foco em disponibilidade e desempenho.",
  ],

  atendimento: [
    "atua no atendimento ao cliente com empatia e clareza.",
    "possui boa comunicação e postura profissional.",
    "resolve problemas com eficiência e cordialidade.",
    "preza pela satisfação e suporte assertivo.",
    "atua bem em ambientes dinâmicos.",
  ],

  biotecnologia: [
    "atua com técnicas laboratoriais e análises biológicas.",
    "preza por precisão e ética científica.",
    "possui domínio de processos experimentais.",
    "atua no avanço e aplicação da biotecnologia.",
    "é atento a detalhes e protocolos.",
  ],

  energias_renovaveis: [
    "atua com foco em energia limpa e sustentável.",
    "preza por eficiência energética.",
    "possui conhecimento técnico em sistemas renováveis.",
    "atua no planejamento e manutenção de soluções verdes.",
    "tem visão ambiental moderna.",
  ],

  game_dev: [
    "atua na criação e desenvolvimento de jogos digitais.",
    "possui criatividade e domínio técnico.",
    "atua com engines modernas.",
    "preza por experiência do usuário e jogabilidade.",
    "integra arte e programação de forma eficiente.",
  ],

  psicologia: [
    "atua promovendo bem-estar e desenvolvimento emocional.",
    "preza pela empatia e escuta ativa.",
    "possui olhar sensível e responsável.",
    "atua com ética e clareza.",
    "tem foco no cuidado humano.",
  ],

  design_produto: [
    "atua desenvolvendo produtos inovadores e funcionais.",
    "preza por ergonomia, estética e usabilidade.",
    "possui domínio técnico em modelagem.",
    "atua unindo criatividade e engenharia.",
    "tem visão moderna de design.",
  ],

  logística_internacional: [
    "atua com processos globais de importação e exportação.",
    "preza por precisão documental.",
    "possui conhecimento em rotinas de comércio exterior.",
    "atua garantindo fluidez logística.",
    "tem visão global e analítica.",
  ],

  e_commerce: [
    "atua otimizando vendas online e fluxos digitais.",
    "preza por experiência do usuário e conversão.",
    "possui domínio de plataformas e marketplaces.",
    "atua analisando métricas e performance.",
    "é dinâmico, organizado e orientado a resultados.",
  ],

  biomedicina: [
    "atua em análises clínicas e diagnósticos laboratoriais.",
    "preza por precisão e segurança.",
    "possui conhecimento em exames e protocolos.",
    "atua com responsabilidade técnica.",
    "tem perfil detalhista e comprometido.",
  ],

  fintech: [
    "atua com tecnologias financeiras modernas.",
    "preza por segurança e inovação.",
    "possui domínio de soluções digitais de pagamento.",
    "atua com foco em eficiência e automação.",
    "tem visão analítica do mercado financeiro.",
  ],

  robótica: [
    "atua com automação e sistemas inteligentes.",
    "preza por precisão técnica.",
    "possui domínio de sensores, atuadores e programação.",
    "atua desenvolvendo protótipos funcionais.",
    "tem perfil criativo e engenhoso.",
  ],

  // ⭐ Novas áreas
  pmo_gestao_projetos: [
    "atua na gestão de projetos com foco em organização e eficiência.",
    "tem domínio de metodologias tradicionais e ágeis.",
    "preza por comunicação clara e acompanhamento estruturado.",
    "atua garantindo prazos, custos e qualidade.",
    "possui visão estratégica e habilidade de planejamento.",
  ],

  sustentabilidade_esg: [
    "atua com foco em sustentabilidade e impacto ambiental positivo.",
    "preza por práticas éticas, sociais e de governança.",
    "possui visão moderna de responsabilidade ambiental.",
    "atua em projetos voltados a ESG.",
    "tem forte compromisso com mudanças sustentáveis.",
  ],

  comunicacao_jornalismo: [
    "atua com comunicação clara, escrita técnica e narrativa envolvente.",
    "preza por apuração, pesquisa e consistência.",
    "possui boa escrita, dicção e estratégia de comunicação.",
    "atua criando conteúdos institucionais e informativos.",
    "tem perfil criativo e analítico.",
  ],

  esportes_educacao_fisica: [
    "atua promovendo saúde e atividade física.",
    "preza pela evolução individual e qualidade de vida.",
    "possui conhecimento técnico em treinos e condicionamento.",
    "atua criando rotinas personalizadas.",
    "tem energia, motivação e disciplina.",
  ],

  hotelaria_turismo: [
    "atua com hospitalidade, atendimento e organização.",
    "preza por experiência agradável ao cliente.",
    "possui boa comunicação e visão multicultural.",
    "atua com reservas, recepção e suporte ao hóspede.",
    "tem perfil dinâmico e cordial.",
  ],

  // 🔁 Fallback geral
  geral: [
    "é um profissional comprometido, com postura responsável e foco em resultados.",
    "demonstra organização e dedicação em suas atividades.",
    "atua com boa comunicação, adaptabilidade e disciplina.",
    "possui perfil colaborativo e aprendizado contínuo.",
    "é focado em entregar valor e evoluir profissionalmente.",
  ],
};

/* ==========================================================
   🧠 FUNÇÃO PRINCIPAL DE IA — MINERAÇÃO / CLASSIFICAÇÃO
========================================================== */
function minerarResumoIA(dados) {
  try {
    // 1) SELEÇÃO / COLETA DOS DADOS (KDD)
    const nome = dados.nome?.split(" ")[0] || "O candidato";
    const exp = dados.experiencias || [];
    const form = dados.formacao || [];
    const habs = dados.habilidades?.map((h) => h?.nome?.toLowerCase()) || [];
    const cursos = dados.cursos?.map((c) => c.nome?.toLowerCase()) || [];
    const idiomas = dados.idiomas?.map((i) => `${i.idioma} (${i.nivel})`) || [];

    const totalCampos =
      exp.length + form.length + habs.length + cursos.length + idiomas.length;

    if (totalCampos === 0) {
      return `${nome} ainda não forneceu informações suficientes para gerar um resumo automático. Adicione experiências, cursos ou habilidades para um resultado mais completo.`;
    }

    // 2) TRANSFORMAÇÃO EM ATRIBUTOS (vetor simples de termos)
    const termos = [
      ...habs,
      ...cursos,
      ...form.map((f) => f.curso?.toLowerCase() || ""),
      ...exp.map((e) => `${e.cargo} ${e.empresa}`.toLowerCase() || ""),
    ];

    // 3) "MINERAÇÃO": aplica regex por área e conta matches
    const pontuacoes = Object.fromEntries(
      Object.entries(areaMap).map(([area, regex]) => [
        area,
        termos.filter((t) => regex.test(t)).length,
      ])
    );

    // 4) ESCOLHA DA ÁREA (MÉTRICA SIMPLES)
    const scores = Object.values(pontuacoes);
    const maxPontuacao = scores.length ? Math.max(...scores) : 0;

    let areaDominante = Object.keys(pontuacoes).find(
      (a) => pontuacoes[a] === maxPontuacao
    );

    if (!areaDominante || maxPontuacao === 0) {
      areaDominante = "geral";
    }

    const scoreDominante = pontuacoes[areaDominante] || 0;

    // 5) GERAÇÃO DO TEXTO FINAL (APRESENTAÇÃO DO RESULTADO)
    const frasesArea = frasesPorArea[areaDominante] || frasesPorArea.geral;
    const fraseSugestao =
      frasesArea[Math.floor(Math.random() * frasesArea.length)];

    const metricaTexto =
      areaDominante !== "geral"
        ? ` (análise de palavras-chave: ${scoreDominante} ocorrências relacionadas a essa área).`
        : ".";

    return `${nome} atua na área de ${areaDominante}${metricaTexto} ${fraseSugestao}`;
  } catch (erro) {
    console.error("Erro ao gerar resumo IA:", erro);
    return "Não foi possível gerar o resumo automático.";
  }
}

/* ==========================================================
   COMPONENTE PRINCIPAL — PERFIL DO CANDIDATO
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
      return;
    }

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
      anexos: [],
    };

    setProfile(base);
    setDraft(base);
    api.perfis.save(logged.email, base);
  }, []);

  function handleChange(e) {
    const { name, value } = e.target;
    setDraft((prev) => ({ ...prev, [name]: value }));
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
    const { name, value } = e.target;
    setTempItem((prev) => ({ ...prev, [name]: value }));
  }

  function salvarItem(field) {
    setDraft((prev) => ({
      ...prev,
      [field]: [
        ...(prev[field] || []),
        field === "habilidades" ? { nome: tempItem.nome } : tempItem,
      ],
    }));
    cancelarForm();
  }

  function removerItem(field, index) {
    setDraft((prev) => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index),
    }));
  }

  function salvarTudo() {
    const logged = getLoggedUser();
    if (!logged) return;

    api.perfis.save(logged.email, draft);
    setProfile(draft);
    setEditing(false);
  }

  function gerarResumo() {
    setLoadingIA(true);

    setTimeout(() => {
      const texto = minerarResumoIA(draft);
      setDraft((prev) => ({ ...prev, resumo: texto }));
      setLoadingIA(false);
    }, 1500);
  }

  return (
    <div className="main-content page-perfil-candidato">
      <main className="perfil-wrapper">
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

        {/* RESUMO PROFISSIONAL */}
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

        {/* LISTAS INLINE */}
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
   InlineSection — bloco reaproveitável para listas
========================================================== */
function InlineSection({
  title,
  field,
  list,
  editing,
  abrirForm,
  formInline,
  tempItem,
  atualizarTemp,
  salvarItem,
  cancelarForm,
  removerItem,
}) {
  const isOpen = formInline === field;
  const hasItems = Array.isArray(list) && list.length > 0;

  return (
    <section className="perfil-card">
      <div className="section-header">
        <h3>{title}</h3>

        {editing && (
          <button className="btn ghost tiny" onClick={() => abrirForm(field)}>
            + Adicionar
          </button>
        )}
      </div>

      {isOpen && editing && (
        <InlineForm
          field={field}
          tempItem={tempItem}
          atualizarTemp={atualizarTemp}
          salvarItem={salvarItem}
          cancelarForm={cancelarForm}
        />
      )}

      {hasItems && (
        <div className="list-area">
          {list.map((item, index) => (
            <div key={index} className="list-card">
              <FieldCard field={field} item={item} />

              {editing && (
                <button
                  className="btn danger tiny"
                  onClick={() => removerItem(field, index)}
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
   FieldCard — renderização dos itens de cada seção
========================================================== */
function FieldCard({ field, item }) {
  if (field === "habilidades") {
    return <div className="chip">{item.nome}</div>;
  }

  if (field === "formacao") {
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
  }

  if (field === "experiencias") {
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
  }

  if (field === "cursos") {
    return (
      <>
        <h4>{item.nome}</h4>
        <p>{item.instituicao}</p>
        <p>
          {item.carga} — {item.ano}
        </p>
      </>
    );
  }

  if (field === "idiomas") {
    return (
      <p>
        <strong>{item.idioma}</strong> — {item.nivel}
      </p>
    );
  }

  if (field === "links") {
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
  }

  if (field === "anexos") {
    return (
      <>
        <p>
          <strong>{item.nome}</strong>
        </p>
        <p>{item.tipo}</p>
      </>
    );
  }

  return null;
}
