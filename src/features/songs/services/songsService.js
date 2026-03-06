import { supabase } from "../../../lib/supabase/supabaseClient";

/**
 * Cria uma solicitação de música na tabela requested_songs.
 *
 * @param {Object} payload
 * @param {string} payload.title
 * @param {string} [payload.artist]
 * @param {string} payload.link
 */
export async function createRequestedSong({ title, artist, link }) {
  const cleanTitle = String(title ?? "").trim();
  const cleanArtist = String(artist ?? "").trim();
  const cleanLink = String(link ?? "").trim();

  if (!cleanTitle) throw new Error("Song title is required");
  if (!cleanLink) throw new Error("Song link is required");

  const { error } = await supabase.from("requested_songs").insert([
    {
      title: cleanTitle,
      artist: cleanArtist || null,
      link: cleanLink,
    },
  ]);

  if (error) throw error;
}

/**
 * Busca músicas na tabela requested_songs.
 *
 * @param {Object} options
 * @param {number} [options.limit] - Limite de registros
 * @param {string} [options.orderBy] - Campo para ordenação (ex: "like_count", "created_at")
 * @param {boolean} [options.ascending] - true = ASC, false = DESC
 * @param {string} [options.searchTerm] - Termo para buscar em title/artist
 */
export async function fetchRequestedSongs({
  limit,
  orderBy,
  ascending,
  searchTerm,
} = {}) {
  let query = supabase
    .from("requested_songs")
    .select("id, title, artist, link, like_count, created_at, isDeleted")
    .eq("isDeleted", false);

  const cleanSearch = String(searchTerm ?? "").trim();
  if (cleanSearch) {
    const escaped = cleanSearch.replace(/[%_\\]/g, "\\$&");
    query = query.or(
      `title.ilike.%${escaped}%,artist.ilike.%${escaped}%`
    );
  }

  if (orderBy) {
    query = query.order(orderBy, { ascending: ascending ?? false });
  }

  if (limit) {
    query = query.limit(limit);
  }

  const { data, error } = await query;

  if (error) {
    throw error;
  }

  return data || [];
}

/**
 * Atualiza o like_count de uma música específica.
 *
 * @param {string|number} id - ID da música
 * @param {number} newLikeCount - Novo total de likes
 */
export async function updateRequestedSongLikes(id, newLikeCount) {
  const { error } = await supabase
    .from("requested_songs")
    .update({ like_count: newLikeCount })
    .eq("id", id);

  if (error) {
    throw error;
  }
}

/**
 * Zera o like_count de todas as músicas solicitadas.
 */
export async function clearRequestedSongLikes() {
  const { error } = await supabase
    .from("requested_songs")
    .update({ like_count: 0 })
    .neq("like_count", 0);

  if (error) {
    throw error;
  }
}

/**
 * Faz soft delete de uma música solicitada.
 *
 * @param {string|number} id - ID da música
 */
export async function softDeleteRequestedSong(id) {
  const { error } = await supabase
    .from("requested_songs")
    .update({ isDeleted: true })
    .eq("id", id);

  if (error) {
    throw error;
  }
}
