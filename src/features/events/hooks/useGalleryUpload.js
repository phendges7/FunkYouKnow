import { useState } from "react";

/**
 * Manages client-side gallery selection & previews.
 * Does NOT upload or persist anything.
 */
const MAX_FILES_PER_BATCH = 10;

const useGalleryUpload = (initialItems = []) => {
  const [galleryItems, setGalleryItems] = useState(initialItems);
  const [error, setError] = useState(null);

  const addFiles = (fileList) => {
    const files = Array.from(fileList);
    setError(null);

    if (files.length > MAX_FILES_PER_BATCH) {
      setError("You can upload up to 10 images at a time.");
      return;
    }

    const invalidFiles = files.filter(
      (file) => !file.type.startsWith("image/"),
    );

    if (invalidFiles.length > 0) {
      setError("Only image files are allowed.");
      return;
    }

    const mapped = files.map((file) => ({
      id: crypto.randomUUID(),
      file,
      previewUrl: URL.createObjectURL(file),
      isNew: true,
    }));

    setGalleryItems((prev) => [...prev, ...mapped]);
  };

  const removeItem = (id) => {
    setGalleryItems((prev) => prev.filter((item) => item.id !== id));
  };

  const resetGallery = () => {
    setGalleryItems([]);
    setError(null);
  };

  return {
    galleryItems,
    addFiles,
    removeItem,
    resetGallery,
    error,
  };
};

export default useGalleryUpload;
