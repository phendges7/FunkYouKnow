import { eventMediaService } from "../services/eventMediaService";

/**
 * Syncs gallery media with DB.
 * Only uploads items marked as isNew === true.
 * Existing media is NEVER touched here.
 */
export const useGallerySync = () => {
  const syncGallery = async ({ eventId, galleryItems, createdBy }) => {
    if (!eventId) {
      throw new Error("syncGallery: eventId is required");
    }

    // 1️⃣ Filter only new items
    const newItems = galleryItems.filter((item) => item.isNew && item.file);

    if (!newItems.length) return;

    // 2️⃣ Ask DB how many items already exist
    const existingCount = await eventMediaService.getGalleryCount(eventId);

    let position = existingCount;

    // 3️⃣ Upload sequentially to preserve order
    for (const item of newItems) {
      await eventMediaService.createGalleryItem({
        eventId,
        file: item.file,
        position,
        createdBy,
      });

      position++;
    }
  };

  return { syncGallery };
};
