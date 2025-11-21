/* ===========================================================
   💼 MOCK API — BANCO COMPLETO (DTO igual ao frontend)
   =========================================================== */

const DB_KEY = "mock_database";

/* ===========================================================
   Helpers
   =========================================================== */
function loadDB() {
  return JSON.parse(
    localStorage.getItem(DB_KEY) ||
      JSON.stringify({
        vagas: [],
        candidaturas: [],
        entrevistas: [],
        perfis: [],
        logs: [] // ⭐ adiciono aqui também para garantir que exista
      })
  );
}

function saveDB(db) {
  localStorage.setItem(DB_KEY, JSON.stringify(db));
}

function generateId() {
  return Date.now() + Math.floor(Math.random() * 99999);
}

/* ===========================================================
   ⭐ FUNÇÃO GLOBAL DE LOG
   =========================================================== */
export function addLog(acao, detalhes, usuario) {
  const db = loadDB();

  const log = {
    id: generateId(),
    acao,           // ex: "login", "editar_vaga"
    detalhes,       // texto explicando a ação
    usuario,        // email do usuário
    data: new Date().toISOString(),
  };

  db.logs = [...(db.logs || []), log];
  saveDB(db);

  return log;
}

/* ===========================================================
   API
   =========================================================== */
export const api = {
  /* ===========================================================
     🟦 VAGAS — DTO COMPLETO
     =========================================================== */
  vagas: {
    getAll() {
      return loadDB().vagas;
    },

    getVaga(id) {
      return loadDB().vagas.find((v) => v.id === id) || null;
    },

    create(data) {
      const db = loadDB();

      const vaga = {
        id: generateId(),

        titulo: data.titulo,
        empresa: data.empresa,
        localizacao: data.localizacao || "",
        modalidade: data.modalidade || "Presencial",
        salario: data.salario || "",
        logo: data.logo || "",
        descricao: data.descricao || "",
        requisitos: data.requisitos || "",
        beneficios: data.beneficios || [],

        formato: data.formato || {
          remoto: false,
          presencial: true,
          hibrido: false,
          periodoIntegral: false,
        },

        detalhes: {
          descricao: data.detalhes?.descricao || "",
          requisitos: data.detalhes?.requisitos || "",
          beneficios: data.detalhes?.beneficios || [],
          formatoJornada: data.detalhes?.formatoJornada || {
            remoto: false,
            presencial: true,
            hibrido: false,
            periodoIntegral: false,
          },
          palavrasChave: data.detalhes?.palavrasChave || [],
        },

        status: "Aberta",
        dataPublicacao: data.dataPublicacao || new Date().toISOString(),
      };

      db.vagas.push(vaga);
      saveDB(db);

      return vaga;
    },

    /* ===========================================================
       🟡 UPDATE — OPÇÃO B (mantém dados antigos se estiver vazio)
       =========================================================== */
    updateVaga(id, changes) {
      const db = loadDB();
      const index = db.vagas.findIndex((v) => v.id === id);
      if (index === -1) return null;

      const vagaAtual = db.vagas[index];

      const vagaAtualizada = {
        ...vagaAtual,

        titulo: changes.titulo || vagaAtual.titulo,
        empresa: changes.empresa || vagaAtual.empresa,
        localizacao: changes.localizacao || vagaAtual.localizacao,
        modalidade: changes.modalidade || vagaAtual.modalidade,
        salario: changes.salario || vagaAtual.salario,
        logo: changes.logo || vagaAtual.logo,
        descricao: changes.descricao || vagaAtual.descricao,
        requisitos: changes.requisitos || vagaAtual.requisitos,

        beneficios:
          changes.beneficios?.length > 0
            ? changes.beneficios
            : vagaAtual.beneficios,

        formato: {
          remoto:
            changes.formato?.remoto !== undefined
              ? changes.formato.remoto
              : vagaAtual.formato.remoto,

          presencial:
            changes.formato?.presencial !== undefined
              ? changes.formato.presencial
              : vagaAtual.formato.presencial,

          hibrido:
            changes.formato?.hibrido !== undefined
              ? changes.formato.hibrido
              : vagaAtual.formato.hibrido,

          periodoIntegral:
            changes.formato?.periodoIntegral !== undefined
              ? changes.formato.periodoIntegral
              : vagaAtual.formato.periodoIntegral,
        },

        detalhes: {
          descricao:
            changes.detalhes?.descricao || vagaAtual.detalhes.descricao,

          requisitos:
            changes.detalhes?.requisitos || vagaAtual.detalhes.requisitos,

          beneficios:
            changes.detalhes?.beneficios?.length > 0
              ? changes.detalhes.beneficios
              : vagaAtual.detalhes.beneficios,

          formatoJornada: {
            remoto:
              changes.detalhes?.formatoJornada?.remoto !== undefined
                ? changes.detalhes.formatoJornada.remoto
                : vagaAtual.detalhes.formatoJornada.remoto,

            presencial:
              changes.detalhes?.formatoJornada?.presencial !== undefined
                ? changes.detalhes.formatoJornada.presencial
                : vagaAtual.detalhes.formatoJornada.presencial,

            hibrido:
              changes.detalhes?.formatoJornada?.hibrido !== undefined
                ? changes.detalhes.formatoJornada.hibrido
                : vagaAtual.detalhes.formatoJornada.hibrido,

            periodoIntegral:
              changes.detalhes?.formatoJornada?.periodoIntegral !== undefined
                ? changes.detalhes.formatoJornada.periodoIntegral
                : vagaAtual.detalhes.formatoJornada.periodoIntegral,
          },

          palavrasChave:
            changes.detalhes?.palavrasChave?.length > 0
              ? changes.detalhes.palavrasChave
              : vagaAtual.detalhes.palavrasChave,
        },
      };

      db.vagas[index] = vagaAtualizada;
      saveDB(db);

      return vagaAtualizada;
    },

    deleteVaga(id) {
      const db = loadDB();
      db.vagas = db.vagas.filter((v) => v.id !== id);
      db.candidaturas = db.candidaturas.filter((c) => c.vagaId !== id);
      db.entrevistas = db.entrevistas.filter((e) => e.vagaId !== id);
      saveDB(db);
    },
  },

  /* ===========================================================
     🟧 CANDIDATURAS — COM PREVENÇÃO DE DUPLICADAS
     =========================================================== */
  candidaturas: {
    getAll() {
      return loadDB().candidaturas;
    },

    create({ vagaId, candidatoEmail, nome, tituloVaga, empresa }) {
      const db = loadDB();

      const jaExiste = db.candidaturas.some(
        (c) => c.vagaId === vagaId && c.candidatoEmail === candidatoEmail
      );

      if (jaExiste) return null;

      const item = {
        id: generateId(),
        vagaId,
        candidatoEmail,
        nome,
        vagaTitulo: tituloVaga,
        empresa,
        data: new Date().toISOString(),
        status: "Pendente",
      };

      db.candidaturas.push(item);
      saveDB(db);
      return item;
    },

    updateStatus(id, newStatus) {
      const db = loadDB();
      const idx = db.candidaturas.findIndex((c) => c.id === id);
      if (idx === -1) return null;

      db.candidaturas[idx].status = newStatus;
      saveDB(db);
      return db.candidaturas[idx];
    },

    delete(id) {
      const db = loadDB();
      db.candidaturas = db.candidaturas.filter((c) => c.id !== id);
      saveDB(db);
    },
  },

  /* ===========================================================
   🟪 ENTREVISTAS — ATUALIZADO
   =========================================================== */
  entrevistas: {
    getAll() {
      return loadDB().entrevistas;
    },

    schedule({
      vagaId,
      candidatoEmail,
      nomeCandidato,
      vagaTitulo,
      empresa,
      data,
      horario,
      linkMeet,
    }) {
      const db = loadDB();

      const entrevista = {
        id: generateId(),
        vagaId,
        candidatoEmail,
        nomeCandidato,
        vagaTitulo,
        empresa,
        data,
        horario,
        linkMeet,
        status: "Agendada",
      };

      db.entrevistas.push(entrevista);
      saveDB(db);

      return entrevista;
    },

    updateStatus(id, newStatus) {
      const db = loadDB();
      const idx = db.entrevistas.findIndex((e) => e.id === id);
      if (idx === -1) return null;

      db.entrevistas[idx].status = newStatus;
      saveDB(db);
      return db.entrevistas[idx];
    },

    delete(id) {
      const db = loadDB();
      db.entrevistas = db.entrevistas.filter((e) => e.id !== id);
      saveDB(db);
    },
  },

  /* ===========================================================
     🟩 PERFIS + LOGS DO JEITO ANTIGO (MANTIDOS)
     =========================================================== */
  perfis: {
    save(email, profile) {
      const db = loadDB();
      const idx = db.perfis.findIndex((p) => p.email === email);

      if (idx >= 0) db.perfis[idx] = profile;
      else db.perfis.push(profile);

      saveDB(db);
    },

    get(email) {
      return loadDB().perfis.find((p) => p.email === email) || null;
    },

    logs: {
      getAll() {
        return loadDB().logs || [];
      },

      add({ tipo, mensagem, usuario, dados }) {
        const db = loadDB();

        if (!db.logs) db.logs = [];

        const log = {
          id: generateId(),
          tipo,
          mensagem,
          usuario,
          dados: dados || {},
          data: new Date().toISOString(),
        };

        db.logs.push(log);
        saveDB(db);

        return log;
      },
    },
  },

  /* ===========================================================
     🧨 RESET DB (TESTES)
     =========================================================== */
  reset() {
    saveDB({
      vagas: [],
      candidaturas: [],
      entrevistas: [],
      perfis: [],
      logs: []
    });
  },
};
