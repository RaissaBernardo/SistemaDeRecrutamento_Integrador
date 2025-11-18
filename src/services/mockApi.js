/* ===========================================================
   💼 MOCK API COMPLETO (MODELO BACKEND REAL)
   Estrutura igual ao Spring Boot, usando 1 banco único.
   =========================================================== */

const DB_KEY = "mock_database";

/* ===========================================================
   Helpers
   =========================================================== */

function loadDB() {
  return JSON.parse(localStorage.getItem(DB_KEY) || JSON.stringify({
    vagas: [],
    candidaturas: [],
    entrevistas: [],
    perfis: []
  }));
}

function saveDB(db) {
  localStorage.setItem(DB_KEY, JSON.stringify(db));
}

function generateId() {
  return Date.now() + Math.floor(Math.random() * 99999);
}

/* ===========================================================
   📌 API PRINCIPAL
   =========================================================== */

export const api = {

  /* ===========================================================
     VAGAS
     =========================================================== */

  getVagas() {
    return loadDB().vagas;
  },

  createVaga(data) {
    const db = loadDB();

    const vaga = {
      id: generateId(),
      titulo: data.titulo,
      empresa: data.empresa,
      local: data.local,
      salario: data.salario,
      descricao: data.descricao,
      requisitos: data.requisitos || [],
      beneficios: data.beneficios || [],
      dataCriacao: new Date().toISOString()
    };

    db.vagas.push(vaga);
    saveDB(db);
    return vaga;
  },

  updateVaga(id, changes) {
    const db = loadDB();
    const index = db.vagas.findIndex(v => v.id === id);
    if (index === -1) return null;

    db.vagas[index] = { ...db.vagas[index], ...changes };
    saveDB(db);
    return db.vagas[index];
  },

  deleteVaga(id) {
    const db = loadDB();

    // remover vaga
    db.vagas = db.vagas.filter(v => v.id !== id);

    // remover candidaturas relacionadas
    db.candidaturas = db.candidaturas.filter(c => c.vagaId !== id);

    // remover entrevistas relacionadas
    db.entrevistas = db.entrevistas.filter(e => e.vagaId !== id);

    saveDB(db);
  },

  /* ===========================================================
     PERFIS
     =========================================================== */

  saveProfile(email, profileData) {
    const db = loadDB();
    const index = db.perfis.findIndex(p => p.email === email);

    if (index >= 0) {
      db.perfis[index] = { ...db.perfis[index], ...profileData };
    } else {
      db.perfis.push(profileData);
    }

    saveDB(db);
  },

  getProfile(email) {
    return loadDB().perfis.find(p => p.email === email) || null;
  },

  /* ===========================================================
     CANDIDATURAS
     =========================================================== */

  getCandidaturas() {
    return loadDB().candidaturas;
  },

  createCandidatura({ vagaId, candidatoEmail, tituloVaga, empresa, nome }) {
    const db = loadDB();

    const cand = {
      id: generateId(),
      vagaId,
      candidatoEmail,
      nome,
      vagaTitulo: tituloVaga,
      empresa,
      data: new Date().toISOString(),
      status: "Pendente"
    };

    db.candidaturas.push(cand);
    saveDB(db);

    return cand;
  },

  updateCandidaturaStatus(id, newStatus) {
    const db = loadDB();
    const index = db.candidaturas.findIndex(c => c.id === id);
    if (index === -1) return null;

    db.candidaturas[index].status = newStatus;
    saveDB(db);
    return db.candidaturas[index];
  },

  deleteCandidatura(id) {
    const db = loadDB();
    db.candidaturas = db.candidaturas.filter(c => c.id !== id);
    saveDB(db);
  },

  /* ===========================================================
     ENTREVISTAS
     =========================================================== */

  getEntrevistas() {
    return loadDB().entrevistas;
  },

  agendarEntrevista({ vagaId, candidatoEmail, nomeCandidato, vagaTitulo, empresa, data, horario, linkMeet }) {
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
      criadoEm: new Date().toISOString()
    };

    db.entrevistas.push(entrevista);
    saveDB(db);

    return entrevista;
  },

  updateStatusEntrevista(id, newStatus) {
    const db = loadDB();
    const index = db.entrevistas.findIndex(e => e.id === id);
    if (index === -1) return null;

    db.entrevistas[index].status = newStatus;
    saveDB(db);
    return db.entrevistas[index];
  },

  deleteEntrevista(id) {
    const db = loadDB();
    db.entrevistas = db.entrevistas.filter(e => e.id !== id);
    saveDB(db);
  },

  /* ===========================================================
     RESET TOTAL
     =========================================================== */

  reset() {
    saveDB({
      vagas: [],
      candidaturas: [],
      entrevistas: [],
      perfis: []
    });
  }
};
