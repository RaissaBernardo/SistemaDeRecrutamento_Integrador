/* ===========================================================
   💼 MOCK API (Simulação fiel do backend Spring Boot)
   =========================================================== */

const DB_KEY = "mock_database";

/* ===========================================================
   Helpers com AUTO-REPARO (🔥 ESSENCIAL)
   =========================================================== */
function loadDB() {
  let db = JSON.parse(localStorage.getItem(DB_KEY)) || {};

  // 🔥 Garante que TODAS as tabelas existam
  if (!db.vagas) db.vagas = [];
  if (!db.candidaturas) db.candidaturas = [];
  if (!db.entrevistas) db.entrevistas = [];
  if (!db.perfis) db.perfis = [];
  if (!db.logs) db.logs = [];
  if (!db.notificacoes) db.notificacoes = []; // 🔥 essencial p/ não quebrar

  return db;
}

function saveDB(db) {
  localStorage.setItem(DB_KEY, JSON.stringify(db));
}

function generateId() {
  return Date.now() + Math.floor(Math.random() * 99999);
}

/* ===========================================================
   ⭐ GLOBAL LOG
   =========================================================== */
export function addLog(acao, detalhes, usuario) {
  const db = loadDB();

  const log = {
    id: generateId(),
    acao,
    detalhes,
    usuario,
    data: new Date().toISOString(),
  };

  db.logs.push(log);
  saveDB(db);

  return log;
}

/* ===========================================================
   API PRINCIPAL
   =========================================================== */
export const api = {
  /* ===========================================================
     🟦 VAGAS
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

    updateVaga(id, changes) {
      const db = loadDB();
      const index = db.vagas.findIndex((v) => v.id === id);
      if (index === -1) return null;

      const vagaAtual = db.vagas[index];

      const vagaAtualizada = {
        ...vagaAtual,
        ...changes,
        detalhes: {
          ...vagaAtual.detalhes,
          ...(changes.detalhes || {}),
        },
        formato: {
          ...vagaAtual.formato,
          ...(changes.formato || {}),
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
     🟧 CANDIDATURAS
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
     🟪 ENTREVISTAS
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
      entrevistadorNome,
      entrevistadorEmail,
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
        entrevistadorNome,
        entrevistadorEmail,
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
     🟩 PERFIS
     =========================================================== */
  perfis: {
    save(email, profile) {
      const db = loadDB();

      // Nunca reaproveita perfis antigos
      db.perfis = db.perfis.filter((p) => p.email !== email);

      db.perfis.push(profile);

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
     🧨 RESET MANUAL
     =========================================================== */
  reset() {
    saveDB({
      vagas: [],
      candidaturas: [],
      entrevistas: [],
      perfis: [],
      logs: [],
      notificacoes: [],
    });
  },
};
