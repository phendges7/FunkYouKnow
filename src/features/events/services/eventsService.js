import { supabase } from "../../../utils/supabaseClient";

export const eventsService = {
  async getAllEvents() {
    const { data, error } = await supabase
      .from("events")
      .select(
        "id, name, slug, description, location, status, date, thumbnail_url, background_video_url, created_at, deleted_at"
      )
      .order("date", { ascending: false });

    if (error) throw error;

    // deixa o filtro published/deleted_at pro caller quando precisar
    return data;
  },

  async getEventBySlug(slug) {
    const { data, error } = await supabase
      .from("events")
      .select(
        "id, name, slug, description, location, status, date, thumbnail_url, background_video_url"
      )
      .eq("slug", slug)
      .is("deleted_at", null)
      .single();

    if (error) throw error;
    return data;
  },

  async getEventById(id) {
    const { data, error } = await supabase
      .from("events")
      .select(
        "id, name, slug, description, location, status, date, thumbnail_url, background_video_url, created_by, created_at, updated_by"
      )
      .eq("id", id)
      .single();

    if (error) throw error;
    return data;
  },

  async createEvent(payload, userId) {
    const insertPayload = {
      ...payload,
      created_by: userId || null,
    };

    const { data, error } = await supabase
      .from("events")
      .insert(insertPayload)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateEvent(id, payload, userId) {
    const updatePayload = {
      ...payload,
      updated_at: new Date().toISOString(),
      ...(userId ? { updated_by: userId } : {}),
    };

    const { data, error } = await supabase
      .from("events")
      .update(updatePayload)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async softDeleteEvent(id, userId) {
    const { error } = await supabase
      .from("events")
      .update({
        deleted_at: new Date().toISOString(),
        deleted_by: userId || null,
      })
      .eq("id", id);

    if (error) throw error;
  },
};
