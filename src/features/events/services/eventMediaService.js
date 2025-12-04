/**
 * Service for managing event_media records (cover + gallery).
 * Keeps Supabase Storage and metadata table in sync.
 */

import { supabase } from "../../../lib/supabase/supabaseClient";

export const eventMediaService = {
  async getGalleryByEvent(eventId) {
    const { data, error } = await supabase
      .from("event_media")
      .select("id, event_id, role, storage_path, public_url, position, alt")
      .eq("event_id", eventId)
      .eq("role", "gallery")
      .order("position", { ascending: true })
      .order("created_at", { ascending: true });

    if (error) throw error;
    return data || [];
  },

  async createGalleryItem({ eventId, storagePath, publicUrl, position, alt }) {
    const { data, error } = await supabase
      .from("event_media")
      .insert({
        event_id: eventId,
        role: "gallery",
        storage_path: storagePath,
        public_url: publicUrl,
        position,
        alt,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async deleteByPublicUrl(eventId, publicUrl) {
    const { error } = await supabase
      .from("event_media")
      .delete()
      .eq("event_id", eventId)
      .eq("public_url", publicUrl);

    if (error) throw error;
  },
};
