import "dotenv/config";
import { createClient } from "@supabase/supabase-js";
import pLimit from "p-limit";

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const BACKFILL_USER_ID =
  process.env.BACKFILL_USER_ID || "a00505cd-7643-4894-97c5-a40bb53f809d";

if (!SUPABASE_URL || !SERVICE_KEY) {
  throw new Error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env");
}

const supabase = createClient(SUPABASE_URL, SERVICE_KEY, {
  auth: { persistSession: false },
});

const PAGE_SIZE = 500;
const limit = pLimit(10); // concurrency
const ROLE = "gallery"; // change if you want to include other roles

const cleanEventName = (name) => (name || "").trim();

const buildAlt = (eventName, position) => {
  const safeName = cleanEventName(eventName) || "Event";
  const pos = Number.isFinite(position) ? position : 0;
  return `${safeName} photo ${pos + 1}`;
};

async function fetchEventsNameMap() {
  // Pull minimal data: id + name
  const map = new Map();
  let from = 0;

  while (true) {
    const to = from + PAGE_SIZE - 1;

    const { data, error } = await supabase
      .from("events")
      .select("id,name")
      .order("created_at", { ascending: true })
      .range(from, to);

    if (error) throw error;
    if (!data || data.length === 0) break;

    for (const e of data) map.set(e.id, e.name);

    if (data.length < PAGE_SIZE) break;
    from += PAGE_SIZE;
  }

  return map;
}

async function fetchMediaBatch(offset) {
  const to = offset + PAGE_SIZE - 1;

  // Target only rows that need backfill:
  // - alt is null OR created_by is null (you can tighten/loosen this)
  const { data, error } = await supabase
    .from("event_media")
    .select("id,event_id,role,position,alt,created_by")
    .eq("role", ROLE)
    .or("alt.is.null,created_by.is.null")
    .order("created_at", { ascending: true })
    .range(offset, to);

  if (error) throw error;
  return data || [];
}

async function updateRow(row, eventName) {
  const nextAlt = row.alt?.trim() ? row.alt : buildAlt(eventName, row.position);

  // You asked to fill created_by with a specific id (even if already set?).
  // I will only fill if null; flip this logic if you want to overwrite.
  const nextCreatedBy = row.created_by ?? BACKFILL_USER_ID;

  const payload = {};
  if (row.alt?.trim() !== nextAlt) payload.alt = nextAlt;
  if (row.created_by !== nextCreatedBy) payload.created_by = nextCreatedBy;

  if (Object.keys(payload).length === 0) {
    return { id: row.id, status: "skip" };
  }

  const { error } = await supabase
    .from("event_media")
    .update(payload)
    .eq("id", row.id);

  if (error) {
    return { id: row.id, status: "fail", reason: error.message };
  }

  return { id: row.id, status: "ok" };
}

async function main() {
  console.log("Backfill started:", {
    ROLE,
    BACKFILL_USER_ID,
    PAGE_SIZE,
  });

  const eventsNameMap = await fetchEventsNameMap();
  console.log("Loaded events:", eventsNameMap.size);

  let offset = 0;
  let ok = 0;
  let skip = 0;
  let fail = 0;

  while (true) {
    const batch = await fetchMediaBatch(offset);
    if (!batch.length) break;

    const results = await Promise.all(
      batch.map((row) =>
        limit(() => {
          const eventName = eventsNameMap.get(row.event_id) || "Event";
          return updateRow(row, eventName);
        }),
      ),
    );

    for (const r of results) {
      if (r.status === "ok") ok++;
      else if (r.status === "skip") skip++;
      else fail++;
    }

    console.log(
      `Batch offset=${offset} size=${batch.length} | ok=${ok} skip=${skip} fail=${fail}`,
    );

    if (batch.length < PAGE_SIZE) break;
    offset += PAGE_SIZE;
  }

  console.log("DONE:", { ok, skip, fail });
}

main().catch((e) => {
  console.error("Backfill failed:", e);
  process.exit(1);
});
