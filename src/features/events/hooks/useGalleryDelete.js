/**
 * Deletes a gallery image: removes from Supabase Storage and event_media table,
 * then updates the event description/photos.
 */

import { supabase } from "../../../lib/supabase/supabaseClient";
import { extractStoragePath } from "./eventFormUtils";
import { eventMediaService } from "../services/eventMediaService";

const useGalleryDelete = (form, setForm, event) => {
  const deleteGalleryPhoto = async (url) => {
    try {
      const path = extractStoragePath(url);
      if (!path) return;

      // Remove do storage
      const { error: storageError } = await supabase.storage
        .from("events")
        .remove([path]);

      if (storageError) throw storageError;

      // Remove da tabela event_media (se tiver event.id)
      if (event?.id) {
        await eventMediaService.deleteByPublicUrl(event.id, url);
      }

      // Atualiza estado local
      setForm((prev) => ({
        ...prev,
        photos: prev.photos.filter((p) => p !== url),
      }));
    } catch (err) {
      console.error(err.message);
      alert("Error deleting image.");
    }
  };

  return { deleteGalleryPhoto };
};

export default useGalleryDelete;
