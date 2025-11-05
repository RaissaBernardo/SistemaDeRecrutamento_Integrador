const USER_KEY = "usuarios";
const LOGGED_KEY = "usuarioLogado";
const PROFILE_KEY = "perfisPorEmail";
const VAGAS_KEY = "vagas";
const CANDS_KEY = "candidaturas";
const ENTREV_KEY = "entrevistas";

function safeParse(val){ try{ return JSON.parse(val); } catch{ return null; } }

// Users
export function getUsers(){ return safeParse(localStorage.getItem(USER_KEY)) || []; }
export function saveUsers(list){ localStorage.setItem(USER_KEY, JSON.stringify(list||[])); }

// Sessão
export function setLoggedUser(user){ localStorage.setItem(LOGGED_KEY, JSON.stringify(user)); }
export function getLoggedUser(){ return safeParse(localStorage.getItem(LOGGED_KEY)); }
export function clearLoggedUser(){ localStorage.removeItem(LOGGED_KEY); }

// Perfil por e-mail
export function getProfile(email){ if(!email) return null; const map = safeParse(localStorage.getItem(PROFILE_KEY)) || {}; return map[email] || null; }
export function saveProfile(email, profileObj){ if(!email) return; const map = safeParse(localStorage.getItem(PROFILE_KEY)) || {}; map[email] = profileObj; localStorage.setItem(PROFILE_KEY, JSON.stringify(map)); }

// Vagas
export function getVagas(){ return safeParse(localStorage.getItem(VAGAS_KEY)) || []; }
export function saveVagas(list){ localStorage.setItem(VAGAS_KEY, JSON.stringify(list||[])); }

// Candidaturas
export function getCandidaturas(){ return safeParse(localStorage.getItem(CANDS_KEY)) || []; }
export function saveCandidaturas(list){ localStorage.setItem(CANDS_KEY, JSON.stringify(list||[])); }

// Entrevistas
export function getEntrevistas(){ return safeParse(localStorage.getItem(ENTREV_KEY)) || []; }
export function saveEntrevistas(list){ localStorage.setItem(ENTREV_KEY, JSON.stringify(list||[])); }
