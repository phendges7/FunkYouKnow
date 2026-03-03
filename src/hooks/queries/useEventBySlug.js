import { useQuery } from "@tanstack/react-query";
import { supabase } from "../../lib/supabase/supabaseClient";

export const useEventBySlug = (slug) => {
  return useQuery({
    queryKey: ["events", "slug", slug],
    enabled: !!slug,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("events")
        .select("*")
        .eq("slug", slug)
        .single();

      if (error) throw new Error(error.message);
      return data ?? null;
    },
  });
};
