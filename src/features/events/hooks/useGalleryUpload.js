/**
 * Handles selection of new gallery files before upload.
 */

import { useState } from "react";

const useGalleryUpload = () => {
  const [galleryFiles, setGalleryFiles] = useState([]);

  const handleGalleryUpload = (e) => {
    const files = Array.from(e.target.files);

    // Validate file count
    if (files.length > 10) {
      alert("Please, select at max 10 files each time.");
      e.target.value = ""; // Clear the input
      return;
    }

    // Validate file types
    const invalidFiles = files.filter(
      (file) => !file.type.startsWith("image/")
    );
    if (invalidFiles.length > 0) {
      alert("Please, only images allowed");
      e.target.value = ""; // Clear the input
      return;
    }

    setGalleryFiles(files);
  };

  return { galleryFiles, setGalleryFiles, handleGalleryUpload };
};

export default useGalleryUpload;
