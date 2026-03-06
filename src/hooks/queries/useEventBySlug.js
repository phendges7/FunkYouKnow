import { useQuery } from "@tanstack/react-query";
import { supabase } from "../../lib/supabase/supabaseClient";

export const useEventBySlug = (slug) => {
  return useQuery({
    queryKey: ["events", "slug", slug],
    enabled: !!slug,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("events")
        .select(
          "id, name, slug, description, location, date, thumbnail_url, background_video_url, ticket_url",
        )
        .eq("slug", slug)
        .is("deleted_at", null)
        .single();

      if (error) throw new Error(error.message);
      return data ?? null;
    },
  });
};
