/* ===========================================================
   💼 MOCK API (Com compatibilidade total + logs restaurados)
   =========================================================== */

const DB_KEY = "mock_database";

/* ===========================================================
   Helpers com auto-reparo
   =========================================================== */
function loadDB() {
  let db = JSON.parse(localStorage.getItem(DB_KEY)) || {};

  if (!db.vagas) db.vagas = [];
  if (!db.candidaturas) db.candidaturas = [];
  if (!db.entrevistas) db.entrevistas = [];
  if (!db.perfis) db.perfis = [];
  if (!db.logs) db.logs = [];
  if (!db.notificacoes) db.notificacoes = [];

  return db;
}

function saveDB(db) {
  localStorage.setItem(DB_KEY, JSON.stringify(db));
}

function generateId() {
  return Date.now() + Math.floor(Math.random() * 99999);
}

/* ===========================================================
   ⭐ GLOBAL LOG (forma nova, oficial)
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
   🎯 Estados permitidos
   =========================================================== */
const VALID_STATES = [
  "Pendente",
  "Em análise",
  "Entrevista agendada",
  "Aprovado",
  "Reprovado",
];

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
        formato: data.formato || {},
        detalhes: data.detalhes || {},
        status: "Aberta",
        dataPublicacao: new Date().toISOString(),
      };

      db.vagas.push(vaga);
      saveDB(db);
      return vaga;
    },

    updateVaga(id, changes) {
      const db = loadDB();
      const idx = db.vagas.findIndex((v) => v.id === id);
      if (idx === -1) return null;

      db.vagas[idx] = { ...db.vagas[idx], ...changes };
      saveDB(db);
      return db.vagas[idx];
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

      const existe = db.candidaturas.some(
        (c) => c.vagaId === vagaId && c.candidatoEmail === candidatoEmail
      );
      if (existe) return null;

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

      if (!VALID_STATES.includes(newStatus)) return null;

      db.candidaturas[idx].status = newStatus;
      saveDB(db);
      return db.candidaturas[idx];
    },

    delete(id) {
      const db = loadDB();
      const cand = db.candidaturas.find((c) => c.id === id);
      if (!cand) return false;

      if (cand.status !== "Pendente") return false;

      db.candidaturas = db.candidaturas.filter((c) => c.id !== id);
      saveDB(db);
      return true;
    },
  },

  /* ===========================================================
       🟪 ENTREVISTAS
     =========================================================== */
  entrevistas: {
    getAll() {
      return loadDB().entrevistas;
    },

    schedule(payload) {
      const db = loadDB();

      const entrevista = {
        id: generateId(),
        ...payload,
        status: "Entrevista agendada",
      };

      db.entrevistas.push(entrevista);
      saveDB(db);
      return entrevista;
    },

    updateStatus(id, newStatus) {
      const db = loadDB();
      const idx = db.entrevistas.findIndex((e) => e.id === id);
      if (idx === -1) return null;

      if (!VALID_STATES.includes(newStatus)) return null;

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
       🟩 PERFIS (com logs herdados restaurados)
     =========================================================== */
  perfis: {
    get(email) {
      return loadDB().perfis.find((p) => p.email === email) || null;
    },

    save(email, profile) {
      const db = loadDB();

      db.perfis = db.perfis.filter((p) => p.email !== email);
      db.perfis.push(profile);

      saveDB(db);
      return profile;
    },

    getAll() {
      return loadDB().perfis;
    },

    // 🔥 RESTAURAMOS perfis.logs.add() (total compat.)
    logs: {
      add(logEntry) {
        return addLog(
          logEntry.tipo || "acao",
          logEntry.dados || {},
          logEntry.usuario || "sistema"
        );
      },
    },
  },

  /* ===========================================================
       🧨 RESET
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
