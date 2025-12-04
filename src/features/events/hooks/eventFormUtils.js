/**
 * Utilities for EventForm: slug generation + Supabase storage path extraction.
 */

// Extracts Supabase storage path from public URL
export const extractStoragePath = (publicUrl) => {
  const index = publicUrl.indexOf("events/");
  if (index === -1) return null;
  return publicUrl.slice(index + "events/".length);
};

// Generates slug based on event name + date
export const generateSlug = (name, dateString) => {
  if (!name) return "";

  let base = name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9 ]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .toLowerCase();

  if (!dateString) return base;

  try {
    const d = new Date(dateString);
    const month = new Intl.DateTimeFormat("pt-BR", { month: "short" })
      .format(d)
      .replace(".", "")
      .toLowerCase();
    const year = d.getFullYear();

    return `${base}-${month}-${year}`;
  } catch {
    return base;
  }
};
