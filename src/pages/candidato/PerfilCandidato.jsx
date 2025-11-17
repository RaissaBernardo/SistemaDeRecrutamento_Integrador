import React, { useEffect, useState } from "react";
import SidebarCandidato from "../../components/SidebarCandidato";
import "../../styles/candidato/PerfilCandidato.css";
import { getProfile, saveProfile, getLoggedUser } from "../../services/storageService";

/* ==========================================================
 💜 SmartResume.AI — Classificador com 20 Áreas + Texto Gerado
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
          20 ÁREAS — CLASSIFICAÇÃO POR PALAVRAS-CHAVE
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
               DESCRIÇÕES — TODAS AS 20 ÁREAS
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
        "atua com defesa de sistemas, redes e aplicações.",
        "possui experiência com análise de vulnerabilidades e boas práticas de segurança.",
        "trabalha para mitigar riscos e proteger ambientes digitais."
      ],
      redes: [
        "atua na configuração e manutenção de infraestruturas de rede.",
        "possui conhecimento em protocolos, cabeamento e dispositivos de comunicação.",
        "garante estabilidade, segurança e performance."
      ],
      engenharia: [
        "atua no desenvolvimento de soluções técnicas e estruturais.",
        "possui forte capacidade analítica e domínio de processos produtivos.",
        "trabalha com eficiência, precisão e padrão de qualidade."
      ],
      logistica: [
        "atua na gestão de estoques, transporte e cadeia de suprimentos.",
        "possui visão estratégica para redução de custos e otimização de processos.",
        "garante eficiência e fluxo operacional contínuo."
      ],
      administrativo: [
        "atua no suporte à gestão, organização e rotina empresarial.",
        "possui perfil analítico e foco em melhoria de processos.",
        "contribui diretamente para o funcionamento interno do negócio."
      ],
      marketing: [
        "atua com estratégias de comunicação e posicionamento de marca.",
        "possui criatividade e olhar orientado ao comportamento do consumidor.",
        "desenvolve ações para atrair, engajar e converter públicos."
      ],
      vendas: [
        "atua com negociação, relacionamento e fechamento de oportunidades.",
        "possui comunicação clara e forte habilidade comercial.",
        "foca em metas, resultados e fidelização de clientes."
      ],
      atendimento: [
        "atua diretamente com clientes, oferecendo suporte e solução de dúvidas.",
        "possui empatia, clareza e profissionalismo.",
        "trabalha para garantir experiências positivas e rápidas."
      ],
      saúde: [
        "atua no cuidado, monitoramento e assistência a pacientes.",
        "possui responsabilidade, atenção aos detalhes e empatia.",
        "segue protocolos e práticas essenciais para o bem-estar."
      ],
      educacao: [
        "atua na formação, orientação e desenvolvimento intelectual.",
        "possui didática, paciência e comunicação objetiva.",
        "busca promover crescimento e aprendizado contínuo."
      ],
      direito: [
        "atua com análise legal, contratos e conformidade jurídica.",
        "possui interpretação precisa de normas e legislação.",
        "trabalha para garantir segurança jurídica e decisões corretas."
      ],
      recursos_humanos: [
        "atua na gestão de pessoas, recrutamento e desenvolvimento.",
        "possui olhar atento aos talentos e cultura organizacional.",
        "contribui para equipes mais fortes e ambientes saudáveis."
      ],
      arquitetura: [
        "atua na criação de ambientes funcionais e estéticos.",
        "possui domínio em softwares técnicos e normas estruturais.",
        "transforma conceitos em projetos modernos e eficientes."
      ],
      contabilidade: [
        "atua com gestão financeira, fiscal e contábil.",
        "possui precisão e atenção a detalhes.",
        "garante conformidade e saúde financeira das operações."
      ],
      gastronomia: [
        "atua com preparo de alimentos de forma criativa e técnica.",
        "possui organização, sensibilidade e padronização.",
        "busca excelência em sabor, textura e apresentação."
      ],
      construção: [
        "atua na execução e supervisão de obras.",
        "possui domínio em processos técnicos e segurança.",
        "entrega projetos dentro de prazos e padrões de qualidade."
      ],
      audiovisual: [
        "atua com edição, captação e produção de conteúdo visual.",
        "possui criatividade e domínio de técnicas de narrativa.",
        "transforma ideias em projetos visuais impactantes."
      ],
      geral: [
        "atua com versatilidade e profissionalismo.",
        "busca aprendizado contínuo e evolução constante.",
        "preza por qualidade, comprometimento e crescimento."
      ]
    };

    const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

    return `
${nome} ${pick(descricoes[areaDominante] || descricoes.geral)} 
Possui histórico relevante, formação consistente e habilidades técnicas importantes. 
${pick([
      "Busca novos desafios.",
      "Tem foco em crescimento.",
      "É dedicado e profissional."
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

    const stored = getProfile(logged.email);
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
    setFormInline(null);
    setTempItem({});
  }

  function removerItem(field, index) {
    setDraft((p) => ({
      ...p,
      [field]: p[field].filter((_, i) => i !== index)
    }));
  }

  function salvarTudo() {
    const logged = getLoggedUser();
    saveProfile(logged.email, draft);
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


  /* ======================
         COMPONENTE SECTION
  ======================= */
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
                <input name="nome" placeholder="Nome do link" onChange={atualizarTemp} />
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
              <button className="btn ghost" onClick={cancelarForm}>
                Cancelar
              </button>
              <button className="btn primary" onClick={() => salvarItem(field)}>
                Adicionar
              </button>
            </div>
          </div>
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
