// ==========================================================
// 🔑 CHAVES GLOBAIS — compatíveis com todo o sistema
// ==========================================================
const KEYS = {
  USERS: "users",
  LOGGED: "loggedUser",
  PROFILES: "perfis",
  VAGAS: "vagas",
  CANDIDATURAS: "candidaturas",
  ENTREVISTAS: "entrevistas",
};

// ==========================================================
// 🧩 Utils seguros
// ==========================================================
function safeParse(val) {
  try {
    return JSON.parse(val);
  } catch {
    return null;
  }
}

function safeStringify(val) {
  try {
    return JSON.stringify(val);
  } catch {
    return "[]";
  }
}

// ==========================================================
// 👥 Usuários (Banco global)
// ==========================================================
export function getUsers() {
  return safeParse(localStorage.getItem(KEYS.USERS)) || [];
}

export function saveUsers(list) {
  localStorage.setItem(KEYS.USERS, safeStringify(list || []));
}

// ==========================================================
// 🔐 SESSÃO — agora por aba (sessionStorage)
// ==========================================================
export function setLoggedUser(user) {
  sessionStorage.setItem(KEYS.LOGGED, safeStringify(user));
}

export function getLoggedUser() {
  return safeParse(sessionStorage.getItem(KEYS.LOGGED));
}

export function clearLoggedUser() {
  sessionStorage.removeItem(KEYS.LOGGED);
}

// ==========================================================
// 🧾 Perfis (mantido por compatibilidade)
// ==========================================================
export function getProfile(email) {
  const profiles = safeParse(localStorage.getItem(KEYS.PROFILES)) || {};
  return profiles[email] || null;
}

export function saveProfile(email, profileObj) {
  const profiles = safeParse(localStorage.getItem(KEYS.PROFILES)) || {};
  profiles[email] = profileObj;
  localStorage.setItem(KEYS.PROFILES, safeStringify(profiles));
}

// ==========================================================
// 💼 Vagas — modo legado
// ==========================================================
export function getVagas() {
  return safeParse(localStorage.getItem(KEYS.VAGAS)) || [];
}

export function saveVagas(list) {
  localStorage.setItem(KEYS.VAGAS, safeStringify(list || []));
}

// ==========================================================
// 📄 Candidaturas — modo legado
// ==========================================================
export function getCandidaturas() {
  return safeParse(localStorage.getItem(KEYS.CANDIDATURAS)) || [];
}

export function saveCandidaturas(list) {
  localStorage.setItem(KEYS.CANDIDATURAS, safeStringify(list || []));
}

// ==========================================================
// 📅 Entrevistas — modo legado
// ==========================================================
export function getEntrevistas() {
  return safeParse(localStorage.getItem(KEYS.ENTREVISTAS)) || [];
}

export function saveEntrevistas(list) {
  localStorage.setItem(KEYS.ENTREVISTAS, safeStringify(list || []));
}
