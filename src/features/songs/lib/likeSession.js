// Chave única pro storage da sessão de likes
const LIKE_STORAGE_KEY = "fyk_likes_session_v1";

// Janela padrão: 30 minutos em milissegundos
const DEFAULT_WINDOW_MS = 30 * 60 * 1000;

// Safe check pra evitar erro em ambiente sem window (build, testes, etc.)
const isBrowser =
  typeof window !== "undefined" && typeof window.localStorage !== "undefined";

/**
 * Lê o mapa de likes do localStorage.
 *
 * Estrutura esperada:
 * {
 *   "123": 1733311200000, // songId => timestamp (ms)
 *   "456": 1733311800000
 * }
 */
function getLikesMap() {
  if (!isBrowser) return {};

  try {
    const raw = window.localStorage.getItem(LIKE_STORAGE_KEY);
    if (!raw) return {};

    const parsed = JSON.parse(raw);

    if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
      return parsed;
    }

    return {};
  } catch (err) {
    console.warn("[likeSession] Falha ao ler storage:", err);
    return {};
  }
}


/**
 *  Salva o mapa de likes no localStorage.
 */
function saveLikesMap(map) {
  if (!isBrowser) return;

  try {
    window.localStorage.setItem(LIKE_STORAGE_KEY, JSON.stringify(map));
  } catch (err) {
    console.warn("[likeSession] Falha ao salvar storage:", err);
  }
}

/**
 * Retorna o timestamp (ms) da última curtida dessa música
 * ou null se nunca foi curtida nessa sessão local.
 */
export function getLastLikeTimestamp(songId) {
  const map = getLikesMap();
  const key = String(songId);
  const value = map[key];

  return typeof value === "number" ? value : null;
}

/**
 * Verifica se o usuário PODE curtir essa música agora.
 */
export function canLikeSong(songId, windowMs = DEFAULT_WINDOW_MS) {
  const last = getLastLikeTimestamp(songId);

  // Nunca curtiu essa música neste device/sessão
  if (!last) {
    return { allowed: true, remainingMs: 0 };
  }

  const now = Date.now();
  const diff = now - last;

  if (diff >= windowMs) {
    return { allowed: true, remainingMs: 0 };
  }

  const remainingMs = windowMs - diff;
  return { allowed: false, remainingMs };
}

/**
 * Registra uma nova curtida para essa música no localStorage,
 * atualizando o timestamp para o momento atual.
 */
export function registerSongLike(songId) {
  const map = getLikesMap();
  const key = String(songId);

  map[key] = Date.now();
  saveLikesMap(map);
}

/**
 * Helper completo:
 * - verifica se pode curtir
 * - se puder, registra e retorna allowed = true
 * - se não puder, retorna allowed = false + remainingMs
 */
export function tryRegisterSongLike(songId, windowMs = DEFAULT_WINDOW_MS) {
  const check = canLikeSong(songId, windowMs);

  if (!check.allowed) {
    return {
      ...check,
      alreadyRegistered: true,
    };
  }

  registerSongLike(songId);

  return {
    allowed: true,
    remainingMs: 0,
    alreadyRegistered: false,
  };
}
