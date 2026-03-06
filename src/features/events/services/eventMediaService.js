import { supabase } from "../../../lib/supabase/supabaseClient";

const TABLE = "event_media";
const BUCKET = "events";

// Tweak these if you want
const THUMB_MAX_SIZE = 360; // px (max width/height)
const THUMB_MIME = "image/webp";
const THUMB_QUALITY = 0.8;

/**
 * Create a resized thumbnail Blob from an image File using canvas.
 * Returns null if anything fails (we then persist thumb_* as null).
 */
const createThumbBlob = async (file) => {
  try {
    if (!file?.type?.startsWith("image/")) return null;

    // Use createImageBitmap when available (faster, no DOM Image decode headaches)
    let bitmap = null;
    if ("createImageBitmap" in window) {
      bitmap = await createImageBitmap(file);
    }

    const img = bitmap
      ? null
      : await new Promise((resolve, reject) => {
          const el = new Image();
          el.onload = () => resolve(el);
          el.onerror = reject;
          el.src = URL.createObjectURL(file);
        });

    const sourceWidth = bitmap ? bitmap.width : img.naturalWidth;
    const sourceHeight = bitmap ? bitmap.height : img.naturalHeight;

    if (!sourceWidth || !sourceHeight) return null;

    const scale = Math.min(
      1,
      THUMB_MAX_SIZE / Math.max(sourceWidth, sourceHeight),
    );

    const targetWidth = Math.max(1, Math.round(sourceWidth * scale));
    const targetHeight = Math.max(1, Math.round(sourceHeight * scale));

    const canvas = document.createElement("canvas");
    canvas.width = targetWidth;
    canvas.height = targetHeight;

    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return null;

    if (bitmap) {
      ctx.drawImage(bitmap, 0, 0, targetWidth, targetHeight);
      bitmap.close?.();
    } else {
      ctx.drawImage(img, 0, 0, targetWidth, targetHeight);
      URL.revokeObjectURL(img.src);
    }

    const blob = await new Promise((resolve) => {
      canvas.toBlob((b) => resolve(b), THUMB_MIME, THUMB_QUALITY);
    });

    return blob || null;
  } catch {
    return null;
  }
};

const getPublicUrl = (path) => {
  const {
    data: { publicUrl },
  } = supabase.storage.from(BUCKET).getPublicUrl(path);
  return publicUrl;
};

const randomFileName = (ext) =>
  `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

const getAuthUserId = async () => {
  const { data, error } = await supabase.auth.getUser();
  if (error) return null;
  return data?.user?.id ?? null;
};

/**
 * Best-effort removal from storage.
 * We do NOT throw on delete failure because it's cleanup (avoid blocking UX).
 */
const safeRemoveFromStorage = async (paths) => {
  try {
    const cleanPaths = (paths || []).filter(Boolean);
    if (cleanPaths.length === 0) return;

    const { error } = await supabase.storage.from(BUCKET).remove(cleanPaths);
    // ignore error (cleanup only)
    void error;
  } catch {
    // ignore
  }
};

/**
 * Manual "upsert" for singleton media roles (cover/background),
 * because Postgres can't infer partial unique indexes via ON CONFLICT,
 * and Supabase upsert can't specify the partial index predicate.
 */
const upsertSingletonMediaRow = async ({
  eventId,
  role, // "cover" | "background"
  fullStoragePath,
  publicUrl,
  createdBy,
}) => {
  // Find existing row for this singleton role
  const { data: existing, error: findError } = await supabase
    .from(TABLE)
    .select("id, full_storage_path")
    .eq("event_id", eventId)
    .eq("role", role)
    .limit(1)
    .maybeSingle();

  if (findError) throw findError;

  // If exists: update row (and cleanup old storage file if path changed)
  if (existing?.id) {
    const oldPath = existing.full_storage_path;

    const { error: updateError } = await supabase
      .from(TABLE)
      .update({
        full_storage_path: fullStoragePath,
        public_url: publicUrl,
        position: 0,
        created_by: createdBy,
      })
      .eq("id", existing.id);

    if (updateError) throw updateError;

    if (oldPath && oldPath !== fullStoragePath) {
      await safeRemoveFromStorage([oldPath]);
    }

    return;
  }

  // Otherwise: insert new row
  const { error: insertError } = await supabase.from(TABLE).insert({
    event_id: eventId,
    role,
    full_storage_path: fullStoragePath,
    public_url: publicUrl,
    position: 0,
    created_by: createdBy,
  });

  if (insertError) throw insertError;
};

export const eventMediaService = {
  async getGalleryByEvent(eventId) {
    const { data, error } = await supabase
      .from(TABLE)
      .select("*")
      .eq("event_id", eventId)
      .eq("role", "gallery")
      .order("position", { ascending: true });

    if (error) throw error;
    return data || [];
  },

  /**
   * Fetch media for a given event and role (optional).
   */
  async getByEvent(eventId, role = null) {
    if (!eventId) throw new Error("getByEvent: missing eventId");

    let query = supabase.from(TABLE).select("*").eq("event_id", eventId);
    if (role) query = query.eq("role", role);

    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  },

  /**
   * Returns the next available gallery position for an event.
   * Uses MAX(position) instead of COUNT(*).
   */
  async getNextGalleryPosition(eventId) {
    const { data, error } = await supabase
      .from(TABLE)
      .select("position")
      .eq("event_id", eventId)
      .eq("role", "gallery")
      .order("position", { ascending: false })
      .limit(1);

    if (error) throw error;
    if (!data || data.length === 0) return 0;
    return (data[0].position ?? -1) + 1;
  },

  /**
   * Creates (or upserts) a gallery item.
   * Uploads full image + thumbnail, then persists DB row.
   */
  async createGalleryItem({
    eventId,
    file,
    position,
    eventTitle = "",
    alt = null,
    createdBy = null,
  }) {
    if (!eventId) throw new Error("createGalleryItem: missing eventId");
    if (!file) return;

    const userId = createdBy ?? (await getAuthUserId());

    const positionNumber = Number.isFinite(position) ? position : 0;

    const computedAlt =
      alt ??
      (eventTitle?.trim()
        ? `${eventTitle.trim()} photo ${positionNumber + 1}`
        : `Event photo ${positionNumber + 1}`);

    const ext = (file.name.split(".").pop() || "jpg").toLowerCase();
    const fileName = randomFileName(ext);

    const fullStoragePath = `gallery/${eventId}/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from(BUCKET)
      .upload(fullStoragePath, file, { upsert: false });

    if (uploadError) throw uploadError;

    const publicUrl = getPublicUrl(fullStoragePath);

    let thumbStoragePath = null;
    let thumbUrl = null;

    const thumbBlob = await createThumbBlob(file);

    if (thumbBlob) {
      const thumbFileNameBase = fileName.replace(/\.[^.]+$/, "");
      const thumbFileName = `${thumbFileNameBase}.webp`;
      thumbStoragePath = `gallery_thumbs/${eventId}/${thumbFileName}`;

      const { error: thumbUploadError } = await supabase.storage
        .from(BUCKET)
        .upload(thumbStoragePath, thumbBlob, {
          upsert: false,
          contentType: THUMB_MIME,
        });

      if (!thumbUploadError) {
        thumbUrl = getPublicUrl(thumbStoragePath);
      } else {
        thumbStoragePath = null;
        thumbUrl = null;
      }
    }

    const { error } = await supabase.from(TABLE).upsert(
      {
        event_id: eventId,
        role: "gallery",
        full_storage_path: fullStoragePath,
        public_url: publicUrl,
        position: positionNumber,
        alt: computedAlt,
        created_by: userId,
        thumb_storage_path: thumbStoragePath,
        thumb_url: thumbUrl,
      },
      {
        onConflict: "event_id,role,full_storage_path",
      },
    );

    if (error) throw error;
  },

  /**
   * Replaces the event cover.
   * NOTE: We DO NOT use Supabase upsert + onConflict here because your uniqueness is enforced via partial indexes.
   */
  async upsertCover({ eventId, file, createdBy = null }) {
    if (!eventId) throw new Error("upsertCover: missing eventId");
    if (!file) return;

    const userId = createdBy ?? (await getAuthUserId());

    const ext = (file.name.split(".").pop() || "jpg").toLowerCase();
    const fileName = `cover-${eventId}-${Date.now()}.${ext}`;
    const storagePath = `covers/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from(BUCKET)
      .upload(storagePath, file, { upsert: true });

    if (uploadError) throw uploadError;

    const publicUrl = getPublicUrl(storagePath);

    await upsertSingletonMediaRow({
      eventId,
      role: "cover",
      fullStoragePath: storagePath,
      publicUrl,
      createdBy: userId,
    });

    return publicUrl;
  },

  /**
   * Replaces the event background video.
   * NOTE: We DO NOT use Supabase upsert + onConflict here because your uniqueness is enforced via partial indexes.
   */
  async upsertBackgroundVideo({ eventId, file, createdBy = null }) {
    if (!eventId) throw new Error("upsertBackgroundVideo: missing eventId");
    if (!file) return;

    const userId = createdBy ?? (await getAuthUserId());

    const ext = (file.name.split(".").pop() || "mp4").toLowerCase();
    const fileName = `background-${eventId}-${Date.now()}.${ext}`;
    const storagePath = `backgrounds/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from(BUCKET)
      .upload(storagePath, file, { upsert: true });

    if (uploadError) throw uploadError;

    const publicUrl = getPublicUrl(storagePath);

    await upsertSingletonMediaRow({
      eventId,
      role: "background",
      fullStoragePath: storagePath,
      publicUrl,
      createdBy: userId,
    });

    return publicUrl;
  },

  /**
   * Hard deletes a gallery item:
   * - removes file(s) from storage
   * - removes row from event_media
   */
  async deleteGalleryItem({ id, fullStoragePath, thumbStoragePath = null }) {
    if (!id || !fullStoragePath) {
      throw new Error("deleteGalleryItem: missing params");
    }

    // 1️⃣ Delete file(s) from storage
    const paths = [fullStoragePath];
    if (thumbStoragePath) paths.push(thumbStoragePath);

    const { error: storageError } = await supabase.storage
      .from(BUCKET)
      .remove(paths);
    if (storageError) throw storageError;

    // 2️⃣ Delete row from DB
    const { error: dbError } = await supabase.from(TABLE).delete().eq("id", id);
    if (dbError) throw dbError;
  },
};
