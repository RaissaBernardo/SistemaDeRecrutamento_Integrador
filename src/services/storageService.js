// ==========================
// 🔹 Chaves locais
// ==========================
const KEYS = {
  USERS: "usuarios",
  LOGGED: "usuarioLogado",
  PROFILES: "perfisPorEmail",
  VAGAS: "vagas",
  CANDIDATURAS: "candidaturas",
  ENTREVISTAS: "entrevistas",
};

// 🔹 URL base do back-end (ajuste quando o Spring Boot estiver ativo)
const BASE_URL = "http://localhost:8080/api"; // exemplo — o back pode mudar isso

// ==========================
// 🧩 Funções utilitárias
// ==========================
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
    console.error("Erro ao salvar no localStorage:", val);
    return "[]";
  }
}

// ==========================
// 👥 Usuários
// ==========================
export function getUsers() {
  return safeParse(localStorage.getItem(KEYS.USERS)) || [];
}

export function saveUsers(list) {
  localStorage.setItem(KEYS.USERS, safeStringify(list || []));
}

// ==========================
// 🔐 Sessão
// ==========================
export function setLoggedUser(user) {
  localStorage.setItem(KEYS.LOGGED, safeStringify(user));
}

export function getLoggedUser() {
  return safeParse(localStorage.getItem(KEYS.LOGGED));
}

export function clearLoggedUser() {
  localStorage.removeItem(KEYS.LOGGED);
}

// ==========================
// 🧾 Perfil por e-mail
// ==========================
export function getProfile(email) {
  if (!email) return null;
  const profiles = safeParse(localStorage.getItem(KEYS.PROFILES)) || {};
  return profiles[email] || null;
}

export function saveProfile(email, profileObj) {
  if (!email) return;
  const profiles = safeParse(localStorage.getItem(KEYS.PROFILES)) || {};
  profiles[email] = profileObj;
  localStorage.setItem(KEYS.PROFILES, safeStringify(profiles));
}

// ==========================
// 💼 Vagas
// ==========================
export function getVagas() {
  return safeParse(localStorage.getItem(KEYS.VAGAS)) || [];
}

export function saveVagas(list) {
  localStorage.setItem(KEYS.VAGAS, safeStringify(list || []));
}

/*
// 🔹 Integração futura (Spring Boot):
export async function fetchVagas() {
  try {
    const res = await fetch(`${BASE_URL}/vagas`);
    if (!res.ok) throw new Error("Erro ao buscar vagas");
    const data = await res.json();
    return data;
  } catch (err) {
    console.error("Erro no fetchVagas:", err);
    return getVagas(); // fallback local
  }
}
*/

// ==========================
// 📄 Candidaturas
// ==========================
export function getCandidaturas() {
  return safeParse(localStorage.getItem(KEYS.CANDIDATURAS)) || [];
}

export function saveCandidaturas(list) {
  localStorage.setItem(KEYS.CANDIDATURAS, safeStringify(list || []));
}

// ==========================
// 📅 Entrevistas
// ==========================
export function getEntrevistas() {
  return safeParse(localStorage.getItem(KEYS.ENTREVISTAS)) || [];
}

export function saveEntrevistas(list) {
  localStorage.setItem(KEYS.ENTREVISTAS, safeStringify(list || []));
}

/*
// 🔹 Integração futura (Spring Boot):
export async function fetchEntrevistas() {
  try {
    const res = await fetch(`${BASE_URL}/entrevistas`);
    if (!res.ok) throw new Error("Erro ao buscar entrevistas");
    return await res.json();
  } catch (err) {
    console.error("Erro no fetchEntrevistas:", err);
    return getEntrevistas(); // fallback local
  }
}
*/
