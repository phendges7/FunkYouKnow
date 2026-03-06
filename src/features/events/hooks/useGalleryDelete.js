import { useState } from "react";
import { eventMediaService } from "../services/eventMediaService";

/**
 * Handles hard deletion of gallery items.
 */
const useGalleryDelete = (onDeleted) => {
  const [deletingId, setDeletingId] = useState(null);
  const [error, setError] = useState(null);

  const deleteGalleryItem = async (item) => {
    try {
      setDeletingId(item.id);
      setError(null);

      await eventMediaService.deleteGalleryItem({
        id: item.id,
        fullStoragePath: item.full_storage_path,
      });

      onDeleted?.(item.id);
    } catch (err) {
      console.error("[useGalleryDelete]", err);
      setError("Failure deleting gallery item.");
    } finally {
      setDeletingId(null);
    }
  };

  return {
    deleteGalleryItem,
    deletingId,
    error,
  };
};

export default useGalleryDelete;
