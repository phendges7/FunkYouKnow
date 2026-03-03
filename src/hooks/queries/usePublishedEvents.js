// src/hooks/queries/usePublishedEvents.js
import { useQuery } from "@tanstack/react-query";
import { supabase } from "../../lib/supabase/supabaseClient";

export const usePublishedEvents = () => {
  return useQuery({
    queryKey: ["events", "published"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("events")
        .select("*")
        .eq("status", "published")
        .is("deleted_at", null)
        .order("date", { ascending: false });

      if (error) throw new Error(error.message);
      return data ?? [];
    },
  });
};
