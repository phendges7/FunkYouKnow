// src/lib/react-query/queryClient.js
import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false, // ⚡️ disable tab-switch refetch spam
      retry: 1, // 🚨 only retry once if query fails
      staleTime: 1000 * 60 * 5, // 🕒 5 minutes before data goes stale
    },
  },
});
