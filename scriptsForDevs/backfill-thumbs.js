import "dotenv/config";
import { createClient } from "@supabase/supabase-js";
import sharp from "sharp";
import pLimit from "p-limit";

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const BUCKET = process.env.SUPABASE_BUCKET || "events";
const THUMB_MAX = Number(process.env.THUMB_MAX_SIZE || 360);

if (!SUPABASE_URL || !SERVICE_KEY) {
  throw new Error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env");
}

const supabase = createClient(SUPABASE_URL, SERVICE_KEY, {
  auth: { persistSession: false },
});

const limit = pLimit(5); // concurrency: 5 is safe
const PAGE_SIZE = 200;

const getPublicUrl = (path) => {
  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
  return data.publicUrl;
};

const isImagePath = (path) =>
  /\.(jpg|jpeg|png|webp|gif|avif)$/i.test(path || "");

const buildThumbPath = (fullPath) => {
  // Example: gallery/<eventId>/abc.jpg -> gallery_thumbs/<eventId>/abc.webp
  const parts = fullPath.split("/");
  const eventId = parts[1]; // gallery/{eventId}/file
  const file = parts[2] || `file-${Date.now()}`;
  const base = file.replace(/\.[^.]+$/, "");
  return `gallery_thumbs/${eventId}/${base}.webp`;
};

async function processRow(row) {
  const { id, event_id, full_storage_path, thumb_storage_path, thumb_url } =
    row;

  if (!full_storage_path) return { id, status: "skip", reason: "no full path" };
  if (thumb_storage_path || thumb_url)
    return { id, status: "skip", reason: "already has thumb" };
  if (!isImagePath(full_storage_path))
    return { id, status: "skip", reason: "not an image" };

  // 1) Download original
  const { data: fileData, error: dlError } = await supabase.storage
    .from(BUCKET)
    .download(full_storage_path);

  if (dlError)
    return { id, status: "fail", reason: `download: ${dlError.message}` };

  const inputBuffer = Buffer.from(await fileData.arrayBuffer());

  // 2) Create thumb (webp, fit inside THUMB_MAX)
  const thumbBuffer = await sharp(inputBuffer)
    .rotate() // respects EXIF orientation
    .resize({
      width: THUMB_MAX,
      height: THUMB_MAX,
      fit: "inside",
      withoutEnlargement: true,
    })
    .webp({ quality: 80 })
    .toBuffer();

  // 3) Upload thumb
  const thumbPath = buildThumbPath(full_storage_path);

  const { error: upError } = await supabase.storage
    .from(BUCKET)
    .upload(thumbPath, thumbBuffer, {
      contentType: "image/webp",
      upsert: false, // don’t overwrite if already created by another run
    });

  if (upError && !/already exists/i.test(upError.message)) {
    return { id, status: "fail", reason: `upload: ${upError.message}` };
  }

  // 4) Update DB with both fields (satisfy check constraint)
  const thumbUrlFinal = getPublicUrl(thumbPath);

  const { error: dbError } = await supabase
    .from("event_media")
    .update({
      thumb_storage_path: thumbPath,
      thumb_url: thumbUrlFinal,
    })
    .eq("id", id);

  if (dbError) return { id, status: "fail", reason: `db: ${dbError.message}` };

  return { id, status: "ok", event_id, thumbPath };
}

async function fetchPage(offset) {
  const { data, error } = await supabase
    .from("event_media")
    .select("id,event_id,role,full_storage_path,thumb_storage_path,thumb_url")
    .eq("role", "gallery")
    .is("thumb_url", null)
    .order("created_at", { ascending: true })
    .range(offset, offset + PAGE_SIZE - 1);

  if (error) throw error;
  return data || [];
}

async function main() {
  let offset = 0;
  let totalOk = 0;
  let totalFail = 0;
  let totalSkip = 0;

  while (true) {
    const page = await fetchPage(offset);
    if (!page.length) break;

    const results = await Promise.all(
      page.map((row) => limit(() => processRow(row))),
    );

    for (const r of results) {
      if (r.status === "ok") totalOk++;
      else if (r.status === "fail") totalFail++;
      else totalSkip++;
    }

    console.log(
      `Processed page offset=${offset} size=${page.length} | ok=${totalOk} fail=${totalFail} skip=${totalSkip}`,
    );

    offset += PAGE_SIZE;
  }

  console.log("DONE", { totalOk, totalFail, totalSkip });
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
